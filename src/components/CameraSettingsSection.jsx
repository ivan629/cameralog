import React from 'react'
import { FormInput } from './FormInput';
import { FORM_FIELDS } from "../constants";

// Smart Input Component with Auto-complete and Recent Values
const SmartInput = ({
                        label,
                        name,
                        value,
                        onChange,
                        onBlur,
                        error,
                        touched,
                        placeholder,
                        type = "text",
                        recentValues = [],
                        validation,
                        className,
                        ...props
                    }) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);

    React.useEffect(() => {
        if (value && recentValues.length > 0) {
            const filtered = recentValues.filter(item =>
                item.toLowerCase().includes(value.toLowerCase()) &&
                item.toLowerCase() !== value.toLowerCase()
            ).slice(0, 5);
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(recentValues.slice(0, 5));
        }
    }, [value, recentValues]);

    const handleInputChange = (e) => {
        onChange(e);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        const syntheticEvent = {
            target: { value: suggestion }
        };
        onChange(syntheticEvent);
        setShowSuggestions(false);
    };

    const handleBlur = (e) => {
        // Delay hiding suggestions to allow clicks
        setTimeout(() => setShowSuggestions(false), 150);
        if (onBlur) onBlur(e);
    };

    const handleFocus = () => {
        if (recentValues.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className={`relative ${className || ''}`}>
            <FormInput
                label={label}
                name={name}
                type={type}
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                error={error}
                touched={touched}
                placeholder={placeholder}
                {...props}
            />

            {/* Auto-complete Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <div className="p-2">
                        <div className="text-xs text-gray-500 mb-2">
                            {value ? 'Suggestions:' : 'Recent:'}
                        </div>
                        {filteredSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md text-sm transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Camera Settings Section with Smart Inputs
export const CameraSettingsSection = ({
                                          formData,
                                          errors,
                                          touched,
                                          handleInputChange,
                                          handleBlur,
                                          recentValues = {} // Pass recent values from parent component
                                      }) => {

    // Validation functions
    const validateLens = (value) => {
        if (!value) return null;
        if (value.length < 2) return 'Lens name too short';
        if (value.length > 100) return 'Lens name too long';
        return null;
    };

    const validateFilter = (value) => {
        if (!value) return null;
        if (value.length > 50) return 'Filter name too long';
        return null;
    };

    const validateLUT = (value) => {
        if (!value) return null;
        if (value.length > 50) return 'LUT name too long';
        return null;
    };

    const validateFStop = (value) => {
        if (!value) return null;

        // Accept f/numbers, T/numbers, or just numbers
        const fStopPattern = /^([fFtT]\/)?(\d+\.?\d*)$/;
        if (!fStopPattern.test(value)) {
            return 'Format: f/2.8, T/2.1, or 2.8';
        }

        const numericValue = parseFloat(value.replace(/^[fFtT]\//, ''));
        if (numericValue < 0.7 || numericValue > 32) {
            return 'F-stop should be between f/0.7 and f/32';
        }

        return null;
    };

    const validateShutter = (value) => {
        if (!value) return null;

        // Accept various shutter formats
        const shutterPatterns = [
            /^1\/\d+$/, // 1/50, 1/125, etc.
            /^\d+°$/, // 180°, 90°, etc.
            /^\d+fps$/, // 24fps, etc.
            /^\d+\.?\d*$/ // Just numbers
        ];

        const isValid = shutterPatterns.some(pattern => pattern.test(value));
        if (!isValid) {
            return 'Format: 1/50, 180°, 24fps, or numeric value';
        }

        return null;
    };

    const validateISO = (value) => {
        if (!value) return null;

        const numericValue = parseInt(value);
        if (isNaN(numericValue)) {
            return 'ISO must be a number';
        }

        if (numericValue < 25 || numericValue > 409600) {
            return 'ISO should be between 25 and 409600';
        }

        return null;
    };

    // Helper to get validation error
    const getValidationError = (field, value) => {
        switch (field) {
            case FORM_FIELDS.LENS:
                return validateLens(value);
            case FORM_FIELDS.FILTER:
                return validateFilter(value);
            case FORM_FIELDS.LUT:
                return validateLUT(value);
            case FORM_FIELDS.F_STOP:
                return validateFStop(value);
            case FORM_FIELDS.SHUTTER:
                return validateShutter(value);
            case FORM_FIELDS.ISO:
                return validateISO(value);
            default:
                return null;
        }
    };

    // Enhanced change handler with validation
    const handleSmartInputChange = (field) => (e) => {
        const value = e.target.value;
        handleInputChange(field, value);

        // Real-time validation feedback (optional)
        const validationError = getValidationError(field, value);
        if (validationError && touched[field]) {
            // Could show inline validation hints here
        }
    };

    return (
        <div className="space-y-4">
            {/* Lens Input */}
            <SmartInput
                label="Lens"
                name={FORM_FIELDS.LENS}
                value={formData.lens}
                onChange={handleSmartInputChange(FORM_FIELDS.LENS)}
                onBlur={() => handleBlur(FORM_FIELDS.LENS)}
                error={errors[FORM_FIELDS.LENS]}
                touched={touched[FORM_FIELDS.LENS]}
                placeholder="e.g., Zeiss CP.3 35mm T2.1, Canon 24-70mm f/2.8"
                recentValues={recentValues.lenses || []}
            />

            {/* Filter Input */}
            <SmartInput
                label="Filter"
                name={FORM_FIELDS.FILTER}
                value={formData.filter}
                onChange={handleSmartInputChange(FORM_FIELDS.FILTER)}
                onBlur={() => handleBlur(FORM_FIELDS.FILTER)}
                error={errors[FORM_FIELDS.FILTER]}
                touched={touched[FORM_FIELDS.FILTER]}
                placeholder="e.g., ND 0.9, Pro-Mist 1/4, Polarizer"
                recentValues={recentValues.filters || []}
            />

            {/* LUT Input */}
            <SmartInput
                label="LUT"
                name={FORM_FIELDS.LUT}
                value={formData.lut}
                onChange={handleSmartInputChange(FORM_FIELDS.LUT)}
                onBlur={() => handleBlur(FORM_FIELDS.LUT)}
                error={errors[FORM_FIELDS.LUT]}
                touched={touched[FORM_FIELDS.LUT]}
                placeholder="e.g., Alexa_LogC_to_Rec709, Show_LUT_v3"
                recentValues={recentValues.luts || []}
            />

            {/* F-Stop and Shutter - Side by Side */}
            <div className="grid grid-cols-2 gap-4">
                <SmartInput
                    label="F-Stop / Aperture"
                    name={FORM_FIELDS.F_STOP}
                    value={formData.fStop}
                    onChange={handleSmartInputChange(FORM_FIELDS.F_STOP)}
                    onBlur={() => handleBlur(FORM_FIELDS.F_STOP)}
                    error={errors[FORM_FIELDS.F_STOP]}
                    touched={touched[FORM_FIELDS.F_STOP]}
                    placeholder="e.g., f/2.8, T/2.1, 5.6"
                    recentValues={recentValues.fStops || []}
                />

                <SmartInput
                    label="Shutter"
                    name={FORM_FIELDS.SHUTTER}
                    value={formData.shutter}
                    onChange={handleSmartInputChange(FORM_FIELDS.SHUTTER)}
                    onBlur={() => handleBlur(FORM_FIELDS.SHUTTER)}
                    error={errors[FORM_FIELDS.SHUTTER]}
                    touched={touched[FORM_FIELDS.SHUTTER]}
                    placeholder="e.g., 1/50, 180°, 1/125"
                    recentValues={recentValues.shutters || []}
                />
            </div>

            {/* ISO Input */}
            <SmartInput
                label="ISO / EI"
                name={FORM_FIELDS.ISO}
                type="number"
                value={formData.iso}
                onChange={handleSmartInputChange(FORM_FIELDS.ISO)}
                onBlur={() => handleBlur(FORM_FIELDS.ISO)}
                error={errors[FORM_FIELDS.ISO]}
                touched={touched[FORM_FIELDS.ISO]}
                placeholder="e.g., 800, 1600, 3200"
                min="25"
                max="409600"
                recentValues={recentValues.isos || []}
                inputMode="numeric"
            />
        </div>
    );
};

