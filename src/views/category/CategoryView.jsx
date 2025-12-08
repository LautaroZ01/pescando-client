import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, Check, AlertCircle, Loader2 } from 'lucide-react';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Iconos disponibles para categorías
const availableIcons = [
  '💪', '🏃', '📚', '🧘', '💼', '🎯', '🌱', '💧', 
  '🍎', '😴', '🧠', '❤️', '✍️', '🎨', '🎵', '🏋️',
  '⚡', '🔥', '💡', '🎓', '🏆', '⏰', '📝', '🌟'
];

// Colores predefinidos con sus nombres
const predefinedColors = [
  { name: 'Rosa-Púrpura', color: '#E91E63', gradient: 'linear-gradient(135deg, #E91E63, #9C27B0)' },
  { name: 'Azul-Cyan', color: '#00BCD4', gradient: 'linear-gradient(135deg, #00BCD4, #2196F3)' },
  { name: 'Verde-Esmeralda', color: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50, #009688)' },
  { name: 'Naranja-Amarillo', color: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800, #FFC107)' },
  { name: 'Rojo-Rosa', color: '#F06292', gradient: 'linear-gradient(135deg, #F06292, #E91E63)' },
  { name: 'Índigo-Azul', color: '#5C6BC0', gradient: 'linear-gradient(135deg, #5C6BC0, #3F51B5)' },
  { name: 'Teal-Verde', color: '#26A69A', gradient: 'linear-gradient(135deg, #26A69A, #009688)' },
  { name: 'Ámbar-Naranja', color: '#FFA726', gradient: 'linear-gradient(135deg, #FFA726, #FF9800)' }
];

export default function HabitCategoriesApp() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#26A69A',
    icon: '💪'
  });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/category`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        }
        throw new Error('Error al cargar las categorías');
      }

      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidHexColor = (color) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleSave = async () => {
    setFormError('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }

    if (!formData.color.trim()) {
      setFormError('El color es obligatorio');
      return;
    }

    if (!isValidHexColor(formData.color)) {
      setFormError('El color debe ser un código hexadecimal válido');
      return;
    }

    if (!formData.icon) {
      setFormError('Debes seleccionar un ícono');
      return;
    }

    try {
      setSaving(true);
      const url = editingCategory 
        ? `${API_BASE_URL}/category/${editingCategory._id}`
        : `${API_BASE_URL}/category`;

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          color: formData.color.trim(),
          icon: formData.icon
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar la categoría');
      }

      setSuccessMessage(editingCategory ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente');
      await fetchCategories();
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/category/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar la categoría');
      }

      setSuccessMessage('Categoría eliminada correctamente');
      await fetchCategories();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#26A69A',
      icon: '💪'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      icon: category.icon
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#26A69A',
      icon: '💪'
    });
    setFormError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Mis categorías
          </h1>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg"
          >
            + Nueva categoría
          </button>
        </div>

        {/* Mensajes */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <Check size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

     {/* Grid de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-500">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id, category.name)}
                    className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay categorías</h3>
            <p className="text-gray-500 mb-6">Crea tu primera categoría</p>
          </div>
        )}


        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 md:p-8 relative my-4 max-h-[95vh] overflow-y-auto" style={{ border: '3px solid #3B82F6' }}>
              {/* Header del Modal */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E91E63, #9C27B0)' }}
                >
                  {formData.icon}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Nueva Categoría</h2>
              </div>

              {formError && (
                <div className="bg-red-500 text-white px-4 py-3 rounded-xl mb-4">
                  {formError}
                </div>
              )}


              {/* Nombre */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-gray-600 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                  placeholder="Profesional"
                  disabled={saving}
                />
              </div>

              {/* Aca se agrega descripción */}
<div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-gray-600 text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-blue-400 resize-none text-sm sm:text-base"
                  placeholder="Describe brevemente esta categoría..."
                  rows="3"
                  maxLength="200"
                  disabled={saving}/>
                <p className="text-gray-400 text-xs mt-1">{formData.description.length}/200 caracteres</p>
              </div>


              {/* Color de la categoría */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  Color de la categoría
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {predefinedColors.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => setFormData({ ...formData, color: colorOption.color })}
                      className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-white font-semibold transition-all text-sm sm:text-base ${
                        formData.color === colorOption.color 
                          ? 'ring-2 sm:ring-4 ring-white shadow-xl' 
                          : 'hover:scale-105'
                      }`}
                      style={{ background: colorOption.gradient }}
                      disabled={saving}
                    >
                      {colorOption.name}
                    </button>
                  ))}
                </div>
              </div>

              {/*Icono a elección */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  Ícono de la categoría
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 sm:gap-2 p-2 sm:p-4 bg-gray-600 rounded-xl max-h-40 sm:max-h-48 overflow-y-auto">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-2xl sm:text-3xl p-2 sm:p-3 rounded-lg transition-all hover:scale-110 ${
                        formData.icon === icon 
                          ? 'bg-blue-500 ring-2 sm:ring-4 ring-white shadow-xl' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      disabled={saving}
                      type="button"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista previa */}
              <div className="mb-4 sm:mb-6 bg-gray-600 rounded-xl p-3 sm:p-4">
                <label className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  Vista previa
                </label>
                <div 
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full text-white font-semibold shadow-lg text-sm sm:text-base"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name || 'Profesional'}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleCloseModal}
                  className="w-full py-2.5 sm:py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-colors text-sm sm:text-base"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="w-full py-2.5 sm:py-3 text-white rounded-full font-semibold transition-all shadow-lg disabled:opacity-50 text-sm sm:text-base"
                  style={{ background: 'linear-gradient(135deg, #E91E63, #FF9800)' }}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    'Crear Categoría'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}