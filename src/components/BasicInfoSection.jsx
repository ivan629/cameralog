import { FormSelect } from './FormSelect';
import { FormInput } from './FormInput';

import {CAMERA_OPTIONS, FORM_FIELDS} from "../constants";

export const BasicInfoSection = ({ formData, errors, touched, handleInputChange, handleBlur }) => (
    <div className="grid grid-cols-1 gap-4">
        <FormSelect
            label="Camera"
            name={FORM_FIELDS.CAMERA}
            value={formData.camera}
            onChange={(e) => handleInputChange(FORM_FIELDS.CAMERA, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.CAMERA)}
            error={errors[FORM_FIELDS.CAMERA]}
            touched={touched[FORM_FIELDS.CAMERA]}
            required
            options={CAMERA_OPTIONS}
            placeholder="Select Camera"
        />

        <div className="grid grid-cols-2 gap-4">
            <FormInput
                label="Roll"
                name={FORM_FIELDS.ROLL}
                type="number"
                value={formData.roll}
                onChange={(e) => handleInputChange(FORM_FIELDS.ROLL, parseInt(e.target.value) || 1)}
                onBlur={() => handleBlur(FORM_FIELDS.ROLL)}
                error={errors[FORM_FIELDS.ROLL]}
                touched={touched[FORM_FIELDS.ROLL]}
                required
                min="1"
            />

            <FormInput
                label="Take"
                name={FORM_FIELDS.TAKE}
                type="number"
                value={formData.take}
                onChange={(e) => handleInputChange(FORM_FIELDS.TAKE, parseInt(e.target.value) || 1)}
                onBlur={() => handleBlur(FORM_FIELDS.TAKE)}
                error={errors[FORM_FIELDS.TAKE]}
                touched={touched[FORM_FIELDS.TAKE]}
                required
                min="1"
            />
        </div>
    </div>
);
