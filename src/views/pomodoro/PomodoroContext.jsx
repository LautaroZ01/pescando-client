import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

const PomodoroContext = createContext(null);

// Valores iniciales por defecto (solo para el primer render)
const INITIAL_SETTINGS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  dailyGoal: 8,
};

const getDurationForMode = (mode, settings) => {
  const s = settings ?? INITIAL_SETTINGS;

  if (mode === 'pomodoro') return s.pomodoro * 60;
  if (mode === 'shortBreak') return s.shortBreak * 60;
  if (mode === 'longBreak') return s.longBreak * 60;

  return INITIAL_SETTINGS.pomodoro * 60;
};

export function PomodoroProvider({ children }) {
  const [mode, setMode] = useState('pomodoro');

  // acá van los tiempos configurables, incluido lo que el usuario escribe en el modal
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // tiempo restante en segundos, usando SIEMPRE los settings actuales
  const [timeLeft, setTimeLeft] = useState(() =>
    getDurationForMode('pomodoro', INITIAL_SETTINGS),
  );

  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const audioRef = useRef(null);

  // Derivamos minutos/segundos del total en segundos
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Pedir permiso de notificaciones (si existe la API)
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleCycleComplete = useCallback(() => {
    setIsActive(false);

    // Notificación
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('¡Pomodoro completado! 🎉', {
          body:
            mode === 'pomodoro'
              ? 'Tiempo de descansar'
              : '¡Listo para otro pomodoro!',
          icon: '/favicon.ico',
        });
      }
    }

    // Sonido suave
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    if (mode === 'pomodoro') {
      setPomodorosCompleted((prev) => prev + 1);
    }
  }, [mode]);

  // Efecto del timer
  useEffect(() => {
    if (!isActive) return;

    if (timeLeft === 0) {
      handleCycleComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // deja que el efecto de arriba dispare la acción
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleCycleComplete]);

  const toggleTimer = () => setIsActive((prev) => !prev);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getDurationForMode(mode, settings)); //  usa SIEMPRE los tiempos configurados
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(getDurationForMode(newMode, settings)); // idem
  };

  const updateSettings = (newSettings) => {
    
    setSettings(newSettings);
    
  };

  const value = {
    minutes,
    seconds,
    isActive,
    mode,
    pomodorosCompleted,
    settings,
    audioRef,
    toggleTimer,
    resetTimer,
    switchMode,
    updateSettings,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
      
      <audio ref={audioRef} src="/pomodoro-soft.mp3" />
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro debe usarse dentro de PomodoroProvider');
  }
  return context;
}
