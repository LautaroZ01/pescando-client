// pescando-client/src/components/CreateHabitModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const categorias = [
  { value: 'Estudio', color: '#3B82F6' },
  { value: 'Programación', color: '#8B5CF6' },
  { value: 'Deporte', color: '#10B981' },
  { value: 'Salud', color: '#F59E0B' },
  { value: 'Lectura', color: '#EF4444' },
  { value: 'Trabajo', color: '#6366F1' },
  { value: 'Otro', color: '#6B7280' }
];

const CreateHabitModal = ({ isOpen, onClose, onSubmit, editHabit = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Estudio',
    color: '#8B5CF6'
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editHabit) {
      setFormData({
        nombre: editHabit.nombre || '',
        categoria: editHabit.categoria || 'Estudio',
        color: editHabit.color || '#8B5CF6'
      });
    } else {
      setFormData({
        nombre: '',
        categoria: 'Estudio',
        color: '#8B5CF6'
      });
    }
  }, [editHabit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre.trim()) {
      onSubmit(formData);
    }
  };

  const handleCategoryChange = (categoria) => {
    const selectedCategory = categorias.find(c => c.value === categoria);
    setFormData({
      ...formData,
      categoria,
      color: selectedCategory?.color || '#8B5CF6'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editHabit ? 'Editar hábito' : 'Nuevo hábito'}
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Nombre del hábito */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Nombre del hábito
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Practicar JavaScript"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
              required
            />
          </div>

          {/* Categoría */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Categoría
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.value}
                </option>
              ))}
            </select>
          </div>

          {/* Preview del color */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full shadow-md"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-gray-600">{formData.categoria}</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
            >
              {editHabit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabitModal;