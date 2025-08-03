import { useState } from 'react'
import { FORM_FIELDS } from './constants';
import { Camera, Film, Save } from 'lucide-react';

import { AdditionalSettingsSection, SceneInfoSection, BasicInfoSection, CameraSettingsSection, NotesSection, TimestampSection } from './components';

// Main Form Component
export const CameraLogForm = ({ initialData, onSave, onCancel, isEditing }) => {
    const [formData, setFormData] = useState(initialData);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = (field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case FORM_FIELDS.CAMERA:
                if (!value) {
                    newErrors[field] = 'Camera is required';
                } else {
                    delete newErrors[field];
                }
                break;
            case FORM_FIELDS.ROLL:
                if (!value || value < 1) {
                    newErrors[field] = 'Roll number must be at least 1';
                } else {
                    delete newErrors[field];
                }
                break;
            case FORM_FIELDS.TAKE:
                if (!value || value < 1) {
                    newErrors[field] = 'Take number must be at least 1';
                } else {
                    delete newErrors[field];
                }
                break;
            case FORM_FIELDS.TIMECODE:
                if (value && !/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(value)) {
                    newErrors[field] = 'Format should be HH:MM:SS:FF';
                } else {
                    delete newErrors[field];
                }
                break;
            case FORM_FIELDS.ISO:
                if (value && (value < 100 || value > 6400)) {
                    newErrors[field] = 'ISO should be between 100 and 6400';
                } else {
                    delete newErrors[field];
                }
                break;
            case FORM_FIELDS.USER:
                if (value && value.length > 3) {
                    newErrors[field] = 'Maximum 3 characters';
                } else {
                    delete newErrors[field];
                }
                break;
            case FORM_FIELDS.NOTES:
                if (value && value.length > 500) {
                    newErrors[field] = 'Maximum 500 characters';
                } else {
                    delete newErrors[field];
                }
                break;
            default:
                delete newErrors[field];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (touched[field]) {
            validateField(field, value);
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field]);
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

    const handleSubmit = async () => {
        setSaving(true);

        const allFields = [
            FORM_FIELDS.CAMERA,
            FORM_FIELDS.ROLL,
            FORM_FIELDS.TAKE,
            FORM_FIELDS.TIMECODE,
            FORM_FIELDS.ISO,
            FORM_FIELDS.USER,
            FORM_FIELDS.NOTES,
            FORM_FIELDS.LENS,
            FORM_FIELDS.FILTER,
            FORM_FIELDS.LUT,
            FORM_FIELDS.F_STOP,
            FORM_FIELDS.SHUTTER,
            FORM_FIELDS.WHITE_BALANCE,
            FORM_FIELDS.SCENE,
            FORM_FIELDS.SHOT,
            FORM_FIELDS.SLATE
        ];

        const newTouched = {};
        const newErrors = {};
        let firstErrorField = null;

        allFields.forEach(field => {
            newTouched[field] = true;
            const fieldValue = formData[field];
            let hasError = false;

            switch (field) {
                case FORM_FIELDS.CAMERA:
                    if (!fieldValue) {
                        newErrors[field] = 'Camera is required';
                        hasError = true;
                    }
                    break;
                case FORM_FIELDS.ROLL:
                    if (!fieldValue || fieldValue < 1) {
                        newErrors[field] = 'Roll number must be at least 1';
                        hasError = true;
                    }
                    break;
                case FORM_FIELDS.TAKE:
                    if (!fieldValue || fieldValue < 1) {
                        newErrors[field] = 'Take number must be at least 1';
                        hasError = true;
                    }
                    break;
                case FORM_FIELDS.TIMECODE:
                    if (fieldValue && !/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(fieldValue)) {
                        newErrors[field] = 'Format should be HH:MM:SS:FF';
                        hasError = true;
                    }
                    break;
                case FORM_FIELDS.ISO:
                    if (fieldValue && (fieldValue < 100 || fieldValue > 6400)) {
                        newErrors[field] = 'ISO should be between 100 and 6400';
                        hasError = true;
                    }
                    break;
                case FORM_FIELDS.USER:
                    if (fieldValue && fieldValue.length > 3) {
                        newErrors[field] = 'Maximum 3 characters';
                        hasError = true;
                    }
                    break;
                case FORM_FIELDS.NOTES:
                    if (fieldValue && fieldValue.length > 500) {
                        newErrors[field] = 'Maximum 500 characters';
                        hasError = true;
                    }
                    break;
            }

            if (hasError && !firstErrorField) {
                firstErrorField = field;
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSaving(false);
            setTimeout(() => {
                if (firstErrorField) {
                    scrollToField(firstErrorField);
                }
            }, 100);
            return;
        }

        const success = onSave(formData);
        if (success) {
            onCancel();
        }
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-white">
            <div className="h-screen w-full flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Film className="w-5 h-5" />
                            {isEditing ? 'Edit Log' : 'New Log'}
                        </h2>
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
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

                {/* Fixed Bottom Actions */}
                <div className="px-4 py-4 border-t border-gray-100 bg-white flex-shrink-0">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
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
