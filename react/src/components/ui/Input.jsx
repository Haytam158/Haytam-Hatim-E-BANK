export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  variant = 'dark', // 'dark' for white backgrounds, 'light' for dark backgrounds
  className = '',
  ...props
}) {
  // Style variants based on background
  const variantStyles = {
    dark: {
      label: 'text-gray-700',
      inputText: 'text-gray-900',
      placeholder: 'placeholder-gray-400',
      background: 'bg-white',
      border: 'border-gray-300',
      error: 'text-red-600'
    },
    light: {
      label: 'text-white/90',
      inputText: 'text-white',
      placeholder: 'placeholder-white/50',
      background: 'bg-white/10 backdrop-blur-sm',
      border: 'border-white/20',
      error: 'text-red-200'
    }
  }

  const styles = variantStyles[variant] || variantStyles.dark

  return (
    <div>
      {label && (
        <label htmlFor={id} className={`block text-sm font-semibold mb-2 ${styles.label}`}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border ${
          error ? 'border-red-500' : styles.border
        } rounded-xl ${styles.inputText} ${styles.placeholder} ${styles.background} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${className}`}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-sm ${styles.error}`}>{error}</p>
      )}
    </div>
  )
}

