import { useState } from 'react'
import { WB_OPTIONS, FORM_FIELDS, LENS_OPTIONS, LUT_OPTIONS, FILTER_OPTIONS, F_STOP_OPTIONS, SHUTTER_OPTIONS, CAMERA_OPTIONS } from './constants';
import { Camera, Clock, Film, Save } from 'lucide-react';

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

    const getInputClassName = (field) => {
        const baseClass = "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base";
        const hasError = errors[field] && touched[field];

        if (hasError) {
            return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`;
        }
        return `${baseClass} border-gray-300 focus:ring-blue-500`;
    };

    const renderFieldError = (field) => {
        if (errors[field] && touched[field]) {
            return (
                <div className="text-red-500 text-sm mt-1">
                    {errors[field]}
                </div>
            );
        }
        return null;
    };

    const handleSubmit = async () => {
        setSaving(true);

        // Validate all fields
        const fieldsToValidate = [
            FORM_FIELDS.CAMERA,
            FORM_FIELDS.ROLL,
            FORM_FIELDS.TAKE,
            FORM_FIELDS.TIMECODE,
            FORM_FIELDS.ISO,
            FORM_FIELDS.USER,
            FORM_FIELDS.NOTES
        ];

        let hasErrors = false;
        const newTouched = {};

        fieldsToValidate.forEach(field => {
            newTouched[field] = true;
            if (!validateField(field, formData[field])) {
                hasErrors = true;
            }
        });

        setTouched(newTouched);

        if (hasErrors) {
            setSaving(false);
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
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Camera *
                                </label>
                                <select
                                    value={formData.camera}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.CAMERA, e.target.value)}
                                    onBlur={() => handleBlur(FORM_FIELDS.CAMERA)}
                                    className={getInputClassName(FORM_FIELDS.CAMERA)}
                                    required
                                >
                                    <option value="">Select Camera</option>
                                    {CAMERA_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {renderFieldError(FORM_FIELDS.CAMERA)}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Roll *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.roll}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.ROLL, parseInt(e.target.value) || 1)}
                                        onBlur={() => handleBlur(FORM_FIELDS.ROLL)}
                                        className={getInputClassName(FORM_FIELDS.ROLL)}
                                        required
                                        min="1"
                                    />
                                    {renderFieldError(FORM_FIELDS.ROLL)}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Take *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.take}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.TAKE, parseInt(e.target.value) || 1)}
                                        onBlur={() => handleBlur(FORM_FIELDS.TAKE)}
                                        className={getInputClassName(FORM_FIELDS.TAKE)}
                                        required
                                        min="1"
                                    />
                                    {renderFieldError(FORM_FIELDS.TAKE)}
                                </div>
                            </div>
                        </div>

                        {/* Timestamp & Timecode */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timestamp
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.timestamp}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.TIMESTAMP, e.target.value)}
                                    className={getInputClassName(FORM_FIELDS.TIMESTAMP)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timecode
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.timecode}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.TIMECODE, e.target.value)}
                                        onBlur={() => handleBlur(FORM_FIELDS.TIMECODE)}
                                        placeholder="HH:MM:SS:FF"
                                        className={getInputClassName(FORM_FIELDS.TIMECODE)}
                                    />
                                    {renderFieldError(FORM_FIELDS.TIMECODE)}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Clips per Take
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.clips}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.CLIPS, parseInt(e.target.value) || 1)}
                                        className={getInputClassName(FORM_FIELDS.CLIPS)}
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Camera Settings */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lens
                                </label>
                                <select
                                    value={formData.lens}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.LENS, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                >
                                    <option value="">Select Lens</option>
                                    {LENS_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter
                                </label>
                                <select
                                    value={formData.filter}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.FILTER, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                >
                                    {FILTER_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LUT
                                </label>
                                <select
                                    value={formData.lut}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.LUT, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                >
                                    <option value="">Select LUT</option>
                                    {LUT_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        F-Stop
                                    </label>
                                    <select
                                        value={formData.fStop}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.F_STOP, e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    >
                                        <option value="">Select F-Stop</option>
                                        {F_STOP_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shutter
                                    </label>
                                    <select
                                        value={formData.shutter}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.SHUTTER, e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    >
                                        <option value="">Select Shutter</option>
                                        {SHUTTER_OPTIONS.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ISO / EI
                                </label>
                                <input
                                    type="number"
                                    value={formData.iso}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.ISO, e.target.value)}
                                    onBlur={() => handleBlur(FORM_FIELDS.ISO)}
                                    className={getInputClassName(FORM_FIELDS.ISO)}
                                    min="100"
                                    max="6400"
                                    placeholder="e.g., 800"
                                />
                                {renderFieldError(FORM_FIELDS.ISO)}
                            </div>
                        </div>

                        {/* Additional Settings */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    White Balance
                                </label>
                                <select
                                    value={formData.whiteBalance}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.WHITE_BALANCE, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                >
                                    {WB_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    User Initials
                                </label>
                                <input
                                    type="text"
                                    value={formData.user}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.USER, e.target.value.slice(0, 3))}
                                    onBlur={() => handleBlur(FORM_FIELDS.USER)}
                                    className={getInputClassName(FORM_FIELDS.USER)}
                                    maxLength="3"
                                    placeholder="ABC"
                                />
                                {renderFieldError(FORM_FIELDS.USER)}
                            </div>
                        </div>

                        {/* Scene/Shot/Slate */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Scene
                                </label>
                                <input
                                    type="text"
                                    value={formData.scene}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.SCENE, e.target.value)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    placeholder="e.g., 12"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shot
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shot}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.SHOT, e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                        placeholder="e.g., B"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Slate
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slate}
                                        onChange={(e) => handleInputChange(FORM_FIELDS.SLATE, e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                        placeholder="e.g., 3"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes & Circle Take */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.NOTES, e.target.value.slice(0, 500))}
                                    onBlur={() => handleBlur(FORM_FIELDS.NOTES)}
                                    className={`${getInputClassName(FORM_FIELDS.NOTES)} resize-none`}
                                    rows="4"
                                    maxLength="500"
                                    placeholder="Additional notes or comments..."
                                />
                                {renderFieldError(FORM_FIELDS.NOTES)}
                                <div className="text-sm text-gray-500 mt-1">
                                    {formData.notes?.length || 0}/500 characters
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="circled"
                                    checked={formData.circled}
                                    onChange={(e) => handleInputChange(FORM_FIELDS.CIRCLED, e.target.checked)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="circled" className="ml-3 block text-sm text-gray-700">
                                    Circle Take (Mark as good take)
                                </label>
                            </div>
                        </div>
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

// Log Display Component
export const LogDisplay = ({ logs, onEditRecord }) => {
    if (logs.length === 0) return null;

    return (
        <div className="py-4 space-y-3">
            {logs.map((log) => (
                <div
                    key={log.id}
                    onClick={() => onEditRecord(log)}
                    className="bg-white border border-gray-200 rounded-lg p-4 active:bg-gray-50 transition-colors cursor-pointer"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                    Scene {log.scene} - Take {log.take}
                                </span>
                                {log.circled && (
                                    <span className="text-green-600 text-xs">⭕</span>
                                )}
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <div>Camera {log.camera} {log.lens && `• ${log.lens}`}</div>
                                <div>{log.timecode}</div>
                                {log.notes && (
                                    <div className="text-gray-600 mt-2 text-sm line-clamp-2">
                                        {log.notes}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Camera className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                </div>
            ))}
        </div>
    );
};