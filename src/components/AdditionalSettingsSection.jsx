import React, { useState } from 'react';
import { FORM_FIELDS } from "../constants";
import { FormInput } from "./FormInput";

// Smart Input Component with Auto-complete (same as CameraSettingsSection)
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
                        maxLength,
                        className,
                        ...props
                    }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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
        let inputValue = e.target.value;

        // Apply maxLength if specified
        if (maxLength && inputValue.length > maxLength) {
            inputValue = inputValue.slice(0, maxLength);
        }

        // Create new event with potentially modified value
        const modifiedEvent = {
            ...e,
            target: {
                ...e.target,
                value: inputValue
            }
        };

        onChange(modifiedEvent);
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
                maxLength={maxLength}
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

// Additional Settings Section with Smart Inputs
export const AdditionalSettingsSection = ({
                                              formData,
                                              errors,
                                              touched,
                                              handleInputChange,
                                              handleBlur,
                                              recentValues = {} // Pass recent values from parent component
                                          }) => {

    // Enhanced change handler for User Initials
    const handleUserInitialsChange = (e) => {
        let value = e.target.value.toUpperCase(); // Auto-capitalize
        value = value.replace(/[^A-Z]/g, ''); // Only allow letters
        value = value.slice(0, 3); // Max 3 characters

        const modifiedEvent = {
            ...e,
            target: {
                ...e.target,
                value: value
            }
        };

        handleInputChange(FORM_FIELDS.USER, value);
    };

    return (
        <div className="space-y-4">
            {/* White Balance - Smart Input */}
            <SmartInput
                label="White Balance"
                name={FORM_FIELDS.WHITE_BALANCE}
                value={formData.whiteBalance}
                onChange={(e) => handleInputChange(FORM_FIELDS.WHITE_BALANCE, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.WHITE_BALANCE)}
                error={errors[FORM_FIELDS.WHITE_BALANCE]}
                touched={touched[FORM_FIELDS.WHITE_BALANCE]}
                placeholder="e.g., Daylight, Tungsten, 3200K, Auto"
                recentValues={recentValues.whiteBalance || []}
            />

            {/* User Initials - Enhanced Input with Auto-formatting */}
            <div className="relative">
                <FormInput
                    label="User Initials"
                    name={FORM_FIELDS.USER}
                    value={formData.user}
                    onChange={handleUserInitialsChange}
                    onBlur={() => handleBlur(FORM_FIELDS.USER)}
                    error={errors[FORM_FIELDS.USER]}
                    touched={touched[FORM_FIELDS.USER]}
                    maxLength="3"
                    placeholder="ABC"
                    className="uppercase"
                    style={{ textTransform: 'uppercase' }}
                />

                {/* Real-time character count */}
                <div className="text-xs text-gray-500 mt-1">
                    {formData.user?.length || 0}/3 characters
                </div>

                {/* Helper text */}
                <div className="text-xs text-gray-400 mt-1">
                    Letters only, auto-capitalized
                </div>
            </div>
        </div>
    );
};
