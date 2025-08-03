import {FORM_FIELDS} from "../constants";
import {FormInput} from "./FormInput";

export const TimestampSection = ({ formData, errors, touched, handleInputChange, handleBlur }) => (
    <div className="space-y-4">
        <FormInput
            label="Timestamp"
            name={FORM_FIELDS.TIMESTAMP}
            type="datetime-local"
            value={formData.timestamp}
            onChange={(e) => handleInputChange(FORM_FIELDS.TIMESTAMP, e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormInput
                label="Timecode"
                name={FORM_FIELDS.TIMECODE}
                value={formData.timecode}
                onChange={(e) => handleInputChange(FORM_FIELDS.TIMECODE, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.TIMECODE)}
                error={errors[FORM_FIELDS.TIMECODE]}
                touched={touched[FORM_FIELDS.TIMECODE]}
                placeholder="HH:MM:SS:FF"
            />

            <FormInput
                label="Clips per Take"
                name={FORM_FIELDS.CLIPS}
                type="number"
                value={formData.clips}
                onChange={(e) => handleInputChange(FORM_FIELDS.CLIPS, e.target.value)}
                onBlur={() => handleBlur(FORM_FIELDS.CLIPS)}
                error={errors[FORM_FIELDS.CLIPS]}
                touched={touched[FORM_FIELDS.CLIPS]}
                min="1"
                inputMode="numeric"
            />
        </div>
    </div>
);
