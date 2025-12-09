export default function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "danger" // 'danger', 'warning', 'info'
}) {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch(type) {
            case 'danger':
                return {
                    icon: '🗑️',
                    gradient: 'from-red-400 to-pink-500',
                    hoverGradient: 'from-red-500 to-pink-600'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    gradient: 'from-yellow-400 to-orange-500',
                    hoverGradient: 'from-yellow-500 to-orange-600'
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    gradient: 'from-blue-400 to-indigo-500',
                    hoverGradient: 'from-blue-500 to-indigo-600'
                };
            default:
                return {
                    icon: '❓',
                    gradient: 'from-gray-400 to-gray-500',
                    hoverGradient: 'from-gray-500 to-gray-600'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <span className="text-6xl mb-4 block">{styles.icon}</span>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3 rounded-full bg-gradient-to-r ${styles.gradient} hover:${styles.hoverGradient} text-white font-medium shadow-md transition-all hover:scale-105`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}