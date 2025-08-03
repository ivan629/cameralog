import { FormInput } from './FormInput';
import {  FORM_FIELDS } from '../constants';

export const SceneInfoSection = ({ formData, errors, touched, handleInputChange, handleBlur }) => (
    <div className="space-y-4">
        <FormInput
            label="Scene"
            name={FORM_FIELDS.SCENE}
            value={formData.scene}
            onChange={(e) => handleInputChange(FORM_FIELDS.SCENE, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.SCENE)}
            error={errors[FORM_FIELDS.SCENE]}
            touched={touched[FORM_FIELDS.SCENE]}
            placeholder="e.g., 12"
        />

        <div className="grid grid-cols-2 gap-4">
            <FormInput
                label="Shot"
                name={FORM_FIELDS.SHOT}
                value={formData.shot}
                onChange={(e) => handleInputChange(FORM_FIELDS.SHOT, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.SHOT)}
                error={errors[FORM_FIELDS.SHOT]}
                touched={touched[FORM_FIELDS.SHOT]}
                placeholder="e.g., B"
            />

            <FormInput
                label="Slate"
                name={FORM_FIELDS.SLATE}
                value={formData.slate}
                onChange={(e) => handleInputChange(FORM_FIELDS.SLATE, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.SLATE)}
                error={errors[FORM_FIELDS.SLATE]}
                touched={touched[FORM_FIELDS.SLATE]}
                placeholder="e.g., 3"
            />
        </div>
    </div>
);
