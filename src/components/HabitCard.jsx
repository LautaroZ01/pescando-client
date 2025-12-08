// frontend/src/components/HabitCard.jsx
import { useState } from 'react';
import { CheckCircle, Circle, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const HabitCard = ({ habit, tasks, onComplete, onEdit, onDelete, onAddTask, onToggleTask, onDeleteTask }) => {
  const [expanded, setExpanded] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  const completedTasks = tasks.filter(t => t.completada).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleAddTask = async () => {
    if (newTaskName.trim()) {
      await onAddTask(habit._id, newTaskName);
      setNewTaskName('');
      setAddingTask(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      {/* Header del Hábito */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: habit.color || '#8B5CF6' }}
          >
            {habit.nombre.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg">{habit.nombre}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{habit.categoria}</span>
              {habit.diasConsecutivos > 0 && (
                <span className="text-orange-500 font-medium">
                  🔥 {habit.diasConsecutivos} días consecutivos
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={() => onEdit(habit)}
            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(habit._id)}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Barra de progreso si hay tareas */}
      {totalTasks > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso</span>
            <span>{completedTasks}/{totalTasks} tareas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                backgroundColor: habit.color || '#8B5CF6'
              }}
            />
          </div>
        </div>
      )}

      {/* Botón de completar hábito */}
      {totalTasks === 0 && (
        <button
          onClick={() => onComplete(habit._id)}
          disabled={habit.completado}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            habit.completado
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600'
          }`}
        >
          {habit.completado ? (
            <>
              <CheckCircle size={20} />
              Completado
            </>
          ) : (
            <>
              <Circle size={20} />
              Marcar como completado
            </>
          )}
        </button>
      )}

      {/* Lista de Tareas (expandible) */}
      {expanded && (
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-700">Tareas</h4>
            <button
              onClick={() => setAddingTask(!addingTask)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              + Agregar tarea
            </button>
          </div>

          {/* Formulario para agregar tarea */}
          {addingTask && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                placeholder="Nombre de la tarea"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Agregar
              </button>
              <button
                onClick={() => {
                  setAddingTask(false);
                  setNewTaskName('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Lista de tareas */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No hay tareas aún. ¡Agrega la primera!
              </p>
            ) : (
              tasks.map(task => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => onToggleTask(task._id)}
                    className="flex-shrink-0"
                  >
                    {task.completada ? (
                      <CheckCircle size={24} className="text-green-500" />
                    ) : (
                      <Circle size={24} className="text-gray-400" />
                    )}
                  </button>
                  
                  <span className={`flex-1 ${task.completada ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.nombre}
                  </span>
                  
                  <button
                    onClick={() => onDeleteTask(task._id)}
                    className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;