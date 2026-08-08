export default function FormField({ label, error, required, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function inputClass(error) {
  return `w-full border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary ${
    error ? 'border-red-400' : 'border-gray-300'
  }`;
}
