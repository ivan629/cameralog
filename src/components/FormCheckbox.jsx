export const FormCheckbox = ({ label, name, checked, onChange, className }) => {
    return (
        <div className={`flex items-center ${className || ''}`}>
            <input
                type="checkbox"
                id={name}
                name={name}
                checked={checked}
                onChange={onChange}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={name} className="ml-3 block text-sm text-gray-700">
                {label}
            </label>
        </div>
    );
};
