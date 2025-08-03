// Select Input Component
export const FormSelect = ({ label, name, value, onChange, onBlur, error, touched, required, options, placeholder, className }) => {
    const getInputClassName = () => {
        const baseClass = "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base";
        const hasError = error && touched;

        if (hasError) {
            return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClass} border-gray-300 focus:ring-blue-500`;
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <select
                name={name}
                data-field={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={getInputClassName()}
                required={required}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {error && touched && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}
        </div>
    );
};
