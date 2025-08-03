import { useState } from 'react'
import { FORM_FIELDS } from './constants';
import { Camera, Film, Save } from 'lucide-react';

import { AdditionalSettingsSection, SceneInfoSection, BasicInfoSection, CameraSettingsSection, NotesSection, TimestampSection } from './components';

// Enhanced validation functions
const validateField = (field, value) => {
    switch (field) {
        // Required fields
        case FORM_FIELDS.CAMERA:
            if (!value || !value.trim()) {
                return 'Camera is required';
            }
            if (value.length > 100) {
                return 'Camera name too long (max 100 characters)';
            }
            return null;

        case FORM_FIELDS.ROLL:
            if (!value) {
                return 'Roll number is required';
            }
            const rollNum = parseInt(value);
            if (isNaN(rollNum) || rollNum < 1) {
                return 'Roll number must be at least 1';
            }
            if (rollNum > 9999) {
                return 'Roll number too large (max 9999)';
            }
            return null;

        case FORM_FIELDS.TAKE:
            if (!value) {
                return 'Take number is required';
            }
            const takeNum = parseInt(value);
            if (isNaN(takeNum) || takeNum < 1) {
                return 'Take number must be at least 1';
            }
            if (takeNum > 999) {
                return 'Take number too large (max 999)';
            }
            return null;

        // Optional fields with format validation
        case FORM_FIELDS.TIMECODE:
            if (value && value.trim()) {
                const timecodePattern = /^\d{2}:\d{2}:\d{2}:\d{2}$/;
                if (!timecodePattern.test(value)) {
                    return 'Format should be HH:MM:SS:FF (e.g., 01:23:45:12)';
                }

                // Validate ranges
                const [hours, minutes, seconds, frames] = value.split(':').map(Number);
                if (hours > 23) return 'Hours must be 00-23';
                if (minutes > 59) return 'Minutes must be 00-59';
                if (seconds > 59) return 'Seconds must be 00-59';
                if (frames > 29) return 'Frames must be 00-29';
            }
            return null;

        case FORM_FIELDS.TIMESTAMP:
            if (value && value.trim()) {
                const timestamp = new Date(value);
                if (isNaN(timestamp.getTime())) {
                    return 'Invalid timestamp format';
                }

                // Check if timestamp is not too far in the future
                const now = new Date();
                const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
                if (timestamp > oneYearFromNow) {
                    return 'Timestamp cannot be more than a year in the future';
                }
            }
            return null;

        case FORM_FIELDS.CLIPS:
            if (value) {
                const clipsNum = parseInt(value);
                if (isNaN(clipsNum) || clipsNum < 1) {
                    return 'Clips must be at least 1';
                }
                if (clipsNum > 100) {
                    return 'Clips number too large (max 100)';
                }
            }
            return null;

        // Camera settings validation
        case FORM_FIELDS.LENS:
            if (value && value.trim()) {
                if (value.length < 2) {
                    return 'Lens name too short (min 2 characters)';
                }
                if (value.length > 100) {
                    return 'Lens name too long (max 100 characters)';
                }
                // Check for invalid characters
                if (!/^[a-zA-Z0-9\s\-\.\/°°]+$/.test(value)) {
                    return 'Lens name contains invalid characters';
                }
            }
            return null;

        case FORM_FIELDS.FILTER:
            if (value && value.trim()) {
                if (value.length > 50) {
                    return 'Filter name too long (max 50 characters)';
                }
                if (!/^[a-zA-Z0-9\s\-\.\/°()]+$/.test(value)) {
                    return 'Filter name contains invalid characters';
                }
            }
            return null;

        case FORM_FIELDS.LUT:
            if (value && value.trim()) {
                if (value.length > 50) {
                    return 'LUT name too long (max 50 characters)';
                }
                if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(value)) {
                    return 'LUT name contains invalid characters';
                }
            }
            return null;

        case FORM_FIELDS.F_STOP:
            if (value && value.trim()) {
                // Accept f/numbers, T/numbers, or just numbers
                const fStopPattern = /^([fFtT]\/)?(\d+\.?\d*)$/;
                if (!fStopPattern.test(value)) {
                    return 'Format: f/2.8, T/2.1, or 2.8';
                }

                const numericValue = parseFloat(value.replace(/^[fFtT]\//, ''));
                if (numericValue < 0.5 || numericValue > 45) {
                    return 'F-stop should be between f/0.5 and f/45';
                }
            }
            return null;

        case FORM_FIELDS.SHUTTER:
            if (value && value.trim()) {
                const shutterPatterns = [
                    /^1\/\d+$/, // 1/50, 1/125, etc.
                    /^\d+°$/, // 180°, 90°, etc.
                    /^\d+fps$/i, // 24fps, etc.
                    /^\d+\.?\d*$/ // Just numbers
                ];

                const isValid = shutterPatterns.some(pattern => pattern.test(value));
                if (!isValid) {
                    return 'Format: 1/50, 180°, 24fps, or numeric value';
                }

                // Additional validation for specific formats
                if (value.includes('/')) {
                    const speed = parseInt(value.split('/')[1]);
                    if (speed < 1 || speed > 8000) {
                        return 'Shutter speed should be between 1/1 and 1/8000';
                    }
                } else if (value.includes('°')) {
                    const angle = parseInt(value.replace('°', ''));
                    if (angle < 1 || angle > 360) {
                        return 'Shutter angle should be between 1° and 360°';
                    }
                }
            }
            return null;

        case FORM_FIELDS.ISO:
            if (value && value.trim()) {
                const isoNum = parseInt(value);
                if (isNaN(isoNum)) {
                    return 'ISO must be a number';
                }
                if (isoNum < 25 || isoNum > 409600) {
                    return 'ISO should be between 25 and 409,600';
                }
            }
            return null;

        // Additional settings
        case FORM_FIELDS.WHITE_BALANCE:
            if (value && value.trim()) {
                if (value.length > 30) {
                    return 'White balance setting too long (max 30 characters)';
                }
            }
            return null;

        case FORM_FIELDS.USER:
            if (value && value.trim()) {
                if (value.length > 3) {
                    return 'Maximum 3 characters';
                }
                if (!/^[a-zA-Z]+$/.test(value)) {
                    return 'Only letters allowed';
                }
            }
            return null;

        // Scene info
        case FORM_FIELDS.SCENE:
            if (value && value.trim()) {
                if (value.length > 20) {
                    return 'Scene name too long (max 20 characters)';
                }
            }
            return null;

        case FORM_FIELDS.SHOT:
            if (value && value.trim()) {
                if (value.length > 10) {
                    return 'Shot name too long (max 10 characters)';
                }
            }
            return null;

        case FORM_FIELDS.SLATE:
            if (value && value.trim()) {
                if (value.length > 20) {
                    return 'Slate info too long (max 20 characters)';
                }
            }
            return null;

        // Notes
        case FORM_FIELDS.NOTES:
            if (value && value.trim()) {
                if (value.length > 500) {
                    return 'Maximum 500 characters';
                }
            }
            return null;

        default:
            return null;
    }
};

// Main Form Component with Enhanced Validation
export const CameraLogForm = ({ initialData, onSave, onCancel, isEditing }) => {
    const [formData, setFormData] = useState(initialData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Enhanced field validation
    const validateFieldWrapper = (field, value) => {
        const newErrors = { ...errors };
        const error = validateField(field, value);

        if (error) {
            newErrors[field] = error;
        } else {
            delete newErrors[field];
        }

        setErrors(newErrors);
        return !error;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Real-time validation for touched fields
        if (touched[field]) {
            validateFieldWrapper(field, value);
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateFieldWrapper(field, formData[field]);
    };

    const scrollToField = (fieldName) => {
        const element = document.querySelector(`[name="${fieldName}"], [data-field="${fieldName}"]`);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            element.focus();
        }
    };

    // Enhanced submit validation
    const handleSubmit = async () => {
        setSaving(true);

        // All possible fields in the form
        const allFields = [
            FORM_FIELDS.CAMERA,
            FORM_FIELDS.ROLL,
            FORM_FIELDS.TAKE,
            FORM_FIELDS.TIMESTAMP,
            FORM_FIELDS.TIMECODE,
            FORM_FIELDS.CLIPS,
            FORM_FIELDS.LENS,
            FORM_FIELDS.FILTER,
            FORM_FIELDS.LUT,
            FORM_FIELDS.F_STOP,
            FORM_FIELDS.SHUTTER,
            FORM_FIELDS.ISO,
            FORM_FIELDS.WHITE_BALANCE,
            FORM_FIELDS.USER,
            FORM_FIELDS.SCENE,
            FORM_FIELDS.SHOT,
            FORM_FIELDS.SLATE,
            FORM_FIELDS.NOTES,
            FORM_FIELDS.CIRCLED
        ];

        const newTouched = {};
        const newErrors = {};
        let firstErrorField = null;

        // Validate all fields
        allFields.forEach(field => {
            newTouched[field] = true;
            const fieldValue = formData[field];
            const error = validateField(field, fieldValue);

            if (error) {
                newErrors[field] = error;
                if (!firstErrorField) {
                    firstErrorField = field;
                }
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);

        // If there are validation errors, scroll to first error
        if (Object.keys(newErrors).length > 0) {
            setSaving(false);

            // Show summary of errors for better UX
            const errorCount = Object.keys(newErrors).length;
            const errorMessage = `${errorCount} field${errorCount > 1 ? 's' : ''} need${errorCount === 1 ? 's' : ''} attention. Please check the highlighted fields.`;

            // You could show a toast/alert here
            console.warn(errorMessage, newErrors);

            setTimeout(() => {
                if (firstErrorField) {
                    scrollToField(firstErrorField);
                }
            }, 100);
            return;
        }

        // Additional business logic validation
        try {
            // Check for duplicate entries (if needed)
            // Validate against production rules (if needed)
            // Format data for submission

            const success = await onSave(formData);
            if (success) {
                onCancel();
            } else {
                // Handle save failure
                setSaving(false);
            }
        } catch (error) {
            console.error('Save error:', error);
            setSaving(false);
            // You could show an error toast here
        }
    };

    // Validation summary for debugging/development
    const getValidationSummary = () => {
        const errorFields = Object.keys(errors);
        const touchedFields = Object.keys(touched);
        const requiredFields = [FORM_FIELDS.CAMERA, FORM_FIELDS.ROLL, FORM_FIELDS.TAKE];
        const missingRequired = requiredFields.filter(field => !formData[field]);

        return {
            hasErrors: errorFields.length > 0,
            errorCount: errorFields.length,
            touchedCount: touchedFields.length,
            missingRequired: missingRequired.length,
            isValid: errorFields.length === 0 && missingRequired.length === 0
        };
    };

    const validationSummary = getValidationSummary();

    return (
        <div className="fixed inset-0 z-50 bg-white">
            <div className="h-screen w-full flex flex-col">
                {/* Header with Validation Indicator */}
                <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <Film className="w-5 h-5" />
                                {isEditing ? 'Edit Log' : 'New Log'}
                            </h2>

                            {/* Validation Status Indicator */}
                            {Object.keys(touched).length > 0 && (
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    validationSummary.isValid
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        validationSummary.isValid ? 'bg-green-500' : 'bg-yellow-500'
                                    }`} />
                                    {validationSummary.isValid ? 'Valid' : `${validationSummary.errorCount} error${validationSummary.errorCount !== 1 ? 's' : ''}`}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onCancel}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="space-y-6">
                        <BasicInfoSection
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />

                        <TimestampSection
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />

                        <CameraSettingsSection
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />

                        <AdditionalSettingsSection
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />

                        <SceneInfoSection
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />

                        <NotesSection
                            formData={formData}
                            errors={errors}
                            touched={touched}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />
                    </div>
                </div>

                {/* Fixed Bottom Actions with Enhanced Validation Feedback */}
                <div className="px-4 py-4 border-t border-gray-100 bg-white flex-shrink-0">
                    {/* Validation Error Summary */}
                    {validationSummary.hasErrors && Object.keys(touched).length > 0 && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="text-sm text-red-700 font-medium">
                                Please fix {validationSummary.errorCount} error{validationSummary.errorCount !== 1 ? 's' : ''} before saving:
                            </div>
                            <div className="text-xs text-red-600 mt-1">
                                Check the highlighted fields above
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving || (validationSummary.hasErrors && Object.keys(touched).length > 0)}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Log'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the validation function for use in other components
export { validateField };