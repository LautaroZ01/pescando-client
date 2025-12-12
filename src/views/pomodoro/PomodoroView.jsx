import { useState } from 'react';
import { usePomodoro } from './PomodoroContext';

export default function SideBar() {
    const {
        minutes,
        seconds,
        isActive,
        mode,
        pomodorosCompleted,
        settings,
        toggleTimer,
        resetTimer,
        switchMode,
        updateSettings,
    } = usePomodoro();

    const [showSettings, setShowSettings] = useState(false);
    const [closingSettings, setClosingSettings] = useState(false);

    const formatTime = (mins, secs) =>
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const handleSettingsChange = (field, value) => {
        updateSettings({
            ...settings,
            [field]: Number(value),
        });
    };

    const applySettings = () => {
        resetTimer();

        // Animación de cierre
        setClosingSettings(true);
        setTimeout(() => {
            setShowSettings(false);
            setClosingSettings(false);
        }, 280);
    };

    const percentage = () => {
        const totalMinutes =
            mode === 'pomodoro'
                ? settings.pomodoro
                : mode === 'shortBreak'
                    ? settings.shortBreak
                    : settings.longBreak;

        const totalSeconds = totalMinutes * 60;
        if (!totalSeconds) return 0;

        const remainingSeconds = minutes * 60 + seconds;
        const passedSeconds = totalSeconds - remainingSeconds;

        return Math.max(0, Math.min((passedSeconds / totalSeconds) * 100, 100));
    };

    const getModeColor = () => {
        if (mode === 'pomodoro') return 'from-orange-400 to-red-400';
        if (mode === 'shortBreak') return 'from-green-400 to-emerald-400';
        return 'from-blue-400 to-indigo-400';
    };

    const goal = settings.dailyGoal || 8;

    return (
        <div className="min-h-screen bg-gradient-to-br mt-4 from-pink-100 via-orange-100 to-orange-200">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🍅</span>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                                Pomodoro Pescando
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setClosingSettings(false);
                                setShowSettings(true);
                            }}
                            className="p-2 rounded-full hover:bg-orange-100 transition"
                        >
                            <span className="text-2xl">⚙️</span>
                        </button>
                    </div>
                </div>

                {/* Settings Modal */}
                {showSettings && (
                    <div
                        className={`bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-6 transform transition-all duration-300 origin-top ${closingSettings
                            ? 'opacity-0 -translate-y-2 scale-95'
                            : 'opacity-100 translate-y-0 scale-100'
                            }`}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Configuración
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Pomodoro (minutos)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.pomodoro}
                                    onChange={(e) =>
                                        handleSettingsChange('pomodoro', e.target.value)
                                    }
                                    className="w-full px-4 py-2 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Descanso corto (minutos)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={settings.shortBreak}
                                    onChange={(e) =>
                                        handleSettingsChange('shortBreak', e.target.value)
                                    }
                                    className="w-full px-4 py-2 rounded-xl bg-white border-2 border-gray-200 focus:border-green-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Descanso largo (minutos)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.longBreak}
                                    onChange={(e) =>
                                        handleSettingsChange('longBreak', e.target.value)
                                    }
                                    className="w-full px-4 py-2 rounded-xl bg-white border-2 border-gray-200 focus:border-blue-400 focus:outline-none"
                                />
                            </div>

                            {/* Meta diaria */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Meta diaria (pomodoros)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={settings.dailyGoal}
                                    onChange={(e) =>
                                        handleSettingsChange('dailyGoal', e.target.value)
                                    }
                                    className="w-full px-4 py-2 rounded-xl bg-white border-2 border-gray-200 focus:border-pink-400 focus:outline-none"
                                />
                            </div>

                            <button
                                onClick={applySettings}
                                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                )}

                {/* Mode Selector */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-4 mb-6">
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => !isActive && switchMode('pomodoro')}
                            disabled={isActive}
                            className={`px-3 py-2 rounded-full font-medium transition-all text-sm md:text-base ${mode === 'pomodoro'
                                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${isActive ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                            Pomodoro
                        </button>
                        <button
                            onClick={() => !isActive && switchMode('shortBreak')}
                            disabled={isActive}
                            className={`px-3 py-2 rounded-full font-medium transition-all text-sm md:text-base ${mode === 'shortBreak'
                                ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${isActive ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                            Descanso
                        </button>
                        <button
                            onClick={() => !isActive && switchMode('longBreak')}
                            disabled={isActive}
                            className={`px-3 py-2 rounded-full font-medium transition-all text-sm md:text-base ${mode === 'longBreak'
                                ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${isActive ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                            Descanso L.
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Timer Display */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-8 md:p-10">
                        <div className="relative">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="85"
                                    stroke="#E5E7EB"
                                    strokeWidth="10"
                                    fill="none"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="85"
                                    stroke="url(#gradient)"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 85}`}
                                    strokeDashoffset={`${2 * Math.PI * 85 * (1 - percentage() / 100)
                                        }`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                />
                                <defs>
                                    <linearGradient
                                        id="gradient"
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop
                                            offset="0%"
                                            className={
                                                mode === 'pomodoro'
                                                    ? 'text-orange-400'
                                                    : mode === 'shortBreak'
                                                        ? 'text-green-400'
                                                        : 'text-blue-400'
                                            }
                                            stopColor="currentColor"
                                        />
                                        <stop
                                            offset="100%"
                                            className={
                                                mode === 'pomodoro'
                                                    ? 'text-red-400'
                                                    : mode === 'shortBreak'
                                                        ? 'text-emerald-400'
                                                        : 'text-indigo-400'
                                            }
                                            stopColor="currentColor"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
                                        {formatTime(minutes, seconds)}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">
                                        {mode === 'pomodoro'
                                            ? 'Enfócate'
                                            : mode === 'shortBreak'
                                                ? 'Descansa'
                                                : 'Descansa Largo'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center mt-6">
                            <button
                                onClick={toggleTimer}
                                className={`flex-1 px-6 py-3 rounded-full font-medium shadow-md transition-all hover:scale-105 bg-gradient-to-r ${getModeColor()} text-white`}
                            >
                                {isActive ? 'Pausar' : 'Iniciar'}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all"
                            >
                                Reiniciar
                            </button>
                        </div>
                    </div>

                    {/* Stats & Info */}
                    <div className="space-y-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">Pomodoros hoy</p>
                                    <p className="text-4xl font-bold text-gray-800">
                                        {pomodorosCompleted}
                                    </p>
                                </div>
                                <span className="text-5xl">🎯</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(
                                            (pomodorosCompleted / goal) * 100,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Meta diaria: {goal} pomodoros
                            </p>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span>💡</span>
                                ¿Cómo funciona?
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 font-bold">1.</span>
                                    <span>Elige una tarea</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 font-bold">2.</span>
                                    <span>Trabaja 25 minutos concentrado</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">3.</span>
                                    <span>Descansa 5 minutos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">4.</span>
                                    <span>Cada 4 pomodoros, descansa 15-30 min</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-3xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <span>✨</span>
                                Tip del día
                            </h3>
                            <p className="text-sm text-gray-700 italic">
                                "Durante el pomodoro, elimina todas las distracciones. Silencia
                                notificaciones y enfócate en una sola tarea."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
