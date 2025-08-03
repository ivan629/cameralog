import { FormSelect } from './FormSelect';
import { FormInput } from './FormInput';

import {F_STOP_OPTIONS, FILTER_OPTIONS, FORM_FIELDS, LENS_OPTIONS, LUT_OPTIONS, SHUTTER_OPTIONS} from "../constants";

export const CameraSettingsSection = ({ formData, errors, touched, handleInputChange, handleBlur }) => (
    <div className="space-y-4">
        <FormSelect
            label="Lens"
            name={FORM_FIELDS.LENS}
            value={formData.lens}
            onChange={(e) => handleInputChange(FORM_FIELDS.LENS, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.LENS)}
            error={errors[FORM_FIELDS.LENS]}
            touched={touched[FORM_FIELDS.LENS]}
            options={LENS_OPTIONS}
            placeholder="Select Lens"
        />

        <FormSelect
            label="Filter"
            name={FORM_FIELDS.FILTER}
            value={formData.filter}
            onChange={(e) => handleInputChange(FORM_FIELDS.FILTER, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.FILTER)}
            error={errors[FORM_FIELDS.FILTER]}
            touched={touched[FORM_FIELDS.FILTER]}
            options={FILTER_OPTIONS}
        />

        <FormSelect
            label="LUT"
            name={FORM_FIELDS.LUT}
            value={formData.lut}
            onChange={(e) => handleInputChange(FORM_FIELDS.LUT, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.LUT)}
            error={errors[FORM_FIELDS.LUT]}
            touched={touched[FORM_FIELDS.LUT]}
            options={LUT_OPTIONS}
            placeholder="Select LUT"
        />

        <div className="grid grid-cols-2 gap-4">
            <FormSelect
                label="F-Stop"
                name={FORM_FIELDS.F_STOP}
                value={formData.fStop}
                onChange={(e) => handleInputChange(FORM_FIELDS.F_STOP, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.F_STOP)}
                error={errors[FORM_FIELDS.F_STOP]}
                touched={touched[FORM_FIELDS.F_STOP]}
                options={F_STOP_OPTIONS}
                placeholder="Select F-Stop"
            />

            <FormSelect
                label="Shutter"
                name={FORM_FIELDS.SHUTTER}
                value={formData.shutter}
                onChange={(e) => handleInputChange(FORM_FIELDS.SHUTTER, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.SHUTTER)}
                error={errors[FORM_FIELDS.SHUTTER]}
                touched={touched[FORM_FIELDS.SHUTTER]}
                options={SHUTTER_OPTIONS}
                placeholder="Select Shutter"
            />
        </div>

        <FormInput
            label="ISO / EI"
            name={FORM_FIELDS.ISO}
            type="number"
            value={formData.iso}
            onChange={(e) => handleInputChange(FORM_FIELDS.ISO, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.ISO)}
            error={errors[FORM_FIELDS.ISO]}
            touched={touched[FORM_FIELDS.ISO]}
            min="100"
            max="6400"
            placeholder="e.g., 800"
        />
    </div>
);
