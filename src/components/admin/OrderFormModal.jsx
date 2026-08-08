export default function OrderFormModal({ title, onClose, onSubmit, submitting, errors, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1" aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {errors?.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}
          {children}

          <div className="flex gap-3 pt-4 border-t border-admin-border sticky bottom-0 bg-white pb-1">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-admin-primary hover:bg-admin-primary-dark text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Order'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
