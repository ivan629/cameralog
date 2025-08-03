// Textarea Component
export const FormTextarea = ({ label, name, value, onChange, onBlur, error, touched, maxLength, placeholder, className, ...props }) => {
    const getInputClassName = () => {
        const baseClass = "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base resize-none";
        const hasError = error && touched;

        if (hasError) {
            return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClass} border-gray-300 focus:ring-blue-500`;
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <textarea
                name={name}
                data-field={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={getInputClassName()}
                maxLength={maxLength}
                placeholder={placeholder}
                {...props}
            />
            {error && touched && (
                <div className="text-red-500 text-sm mt-1">
                    {error}
                </div>
            )}
            {maxLength && (
                <div className="text-sm text-gray-500 mt-1">
                    {value?.length || 0}/{maxLength} characters
                </div>
            )}
        </div>
    );
};
