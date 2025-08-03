export const FormInput = ({ label, name, type = "text", value, onChange, onBlur, error, touched, required, className, ...props }) => {
    const getInputClassName = () => {
        const baseClass = "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base";
        const hasError = error && touched;

        if (hasError) {
            return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClass} border-gray-300 focus:ring-blue-500`;
    };

    const handleChange = (e) => {
        if (type === "number") {
            // For number inputs, pass the raw string value to allow empty strings
            // The parent component should handle the conversion
            onChange(e);
        } else {
            onChange(e);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && '*'}
            </label>
            <input
                name={name}
                data-field={name}
                type={type}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                className={getInputClassName()}
                required={required}
                {...props}
            />
            {error && touched && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}
        </div>
    );
};