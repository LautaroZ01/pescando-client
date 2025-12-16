import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Iconos disponibles para categorías
const availableIcons = [
  '💪', '🏃', '📚', '🧘', '💼', '🎯', '🌱', '💧',
  '💻', '😴', '🧠', '❤️', '✍️', '🎨', '🎵', '🏋️',
  '⚡', '🔥', '💡', '🎓', '🏆', '⏰', '📝', '🌟'
];

// Colores predefinidos
const predefinedColors = [
  { name: 'Rosa-Púrpura', color: '#E91E63', gradient: 'from-pink-500 to-purple-600' },
  { name: 'Azul-Cyan', color: '#00BCD4', gradient: 'from-cyan-500 to-blue-500' },
  { name: 'Verde-Esmeralda', color: '#4CAF50', gradient: 'from-green-500 to-teal-600' },
  { name: 'Naranja-Amarillo', color: '#FF9800', gradient: 'from-orange-400 to-yellow-500' },
  { name: 'Rojo-Rosa', color: '#F06292', gradient: 'from-red-400 to-pink-500' },
  { name: 'Índigo-Azul', color: '#5C6BC0', gradient: 'from-indigo-500 to-blue-600' },
  { name: 'Teal-Verde', color: '#26A69A', gradient: 'from-teal-500 to-green-600' },
  { name: 'Ámbar-Naranja', color: '#FFA726', gradient: 'from-amber-400 to-orange-500' }
];

export default function HabitCategoriesApp() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
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
      const response = await fetch(`${API_BASE_URL}/category/user`, {
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
  const onRequestDelete = (id, name) => {
    setCategoryToDelete({ id, name });
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/category/${categoryToDelete.id}`, {
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
    } finally {

      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  }

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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-orange-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 to-orange-200">
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Categorías</h1>
            <p className="text-gray-600">Organiza tus hábitos con categorías personalizadas</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-6 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Nueva Categoría
          </button>
        </div>

        {/* Mensajes */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2">
            <Check size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Grid de categorías */}
        {categories.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              ¡Crea tu primera categoría!
            </p>
            <p className="text-gray-600 mb-6">
              Las categorías te ayudan a organizar mejor tus hábitos
            </p>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white px-8 py-3 rounded-full shadow-md font-medium transition-all hover:scale-105"
            >
              Crear mi primera categoría
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-xl mb-1">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {category.user && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => onRequestDelete(category._id, category.name)}
                      className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>

                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                  disabled={saving}
                >
                  <X size={24} />
                </button>
              </div>

              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {formError}
                </div>
              )}

              {/* Nombre */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
                  placeholder="Ej: Salud, Estudio, Finanzas..."
                  disabled={saving}
                />
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-orange-400 focus:outline-none resize-none"
                  placeholder="Describe brevemente esta categoría..."
                  rows="3"
                  maxLength="200"
                  disabled={saving}
                />
                <p className="text-gray-500 text-xs mt-1">{formData.description.length}/200 caracteres</p>
              </div>

              {/* Color */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Color de la categoría
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedColors.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => setFormData({ ...formData, color: colorOption.color })}
                      className={`px-4 py-3 rounded-xl text-white font-semibold transition-all bg-gradient-to-r ${colorOption.gradient} ${formData.color === colorOption.color
                        ? 'ring-4 ring-orange-300 shadow-xl scale-105'
                        : 'hover:scale-105 shadow-md'
                        }`}
                      disabled={saving}
                      type="button"
                    >
                      {colorOption.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Iconos */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Ícono de la categoría
                </label>
                <div className="grid grid-cols-8 gap-2 p-4 bg-white/50 rounded-xl max-h-48 overflow-y-auto border-2 border-gray-200">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-3xl p-3 rounded-lg transition-all hover:scale-110 ${formData.icon === icon
                        ? 'bg-orange-200 ring-2 ring-orange-400 shadow-lg scale-110'
                        : 'bg-white hover:bg-orange-50'
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
              <div className="mb-6 bg-white/50 rounded-xl p-4 border-2 border-gray-200">
                <label className="block text-gray-700 font-medium mb-3">
                  Vista previa
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {formData.name || 'Nombre de la categoría'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.description || 'Descripción de la categoría'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium shadow-md transition-all hover:scale-105 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    editingCategory ? 'Actualizar' : 'Crear'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>


  );
}