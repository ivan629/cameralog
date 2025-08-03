import { FormCheckbox } from './FormCheckbox';
import { FormTextarea } from './FormTextarea';
import { FORM_FIELDS } from '../constants';

export const NotesSection = ({ formData, errors, touched, handleInputChange, handleBlur }) => (
    <div className="space-y-4">
        <FormTextarea
            label="Notes"
            name={FORM_FIELDS.NOTES}
            value={formData.notes}
            onChange={(e) => handleInputChange(FORM_FIELDS.NOTES, e.target.value.slice(0, 500))}
            onBlur={() => handleBlur(FORM_FIELDS.NOTES)}
            error={errors[FORM_FIELDS.NOTES]}
            touched={touched[FORM_FIELDS.NOTES]}
            maxLength="500"
            rows="4"
            placeholder="Additional notes or comments..."
        />

        <FormCheckbox
            label="Circle Take (Mark as good take)"
            name={FORM_FIELDS.CIRCLED}
            checked={formData.circled}
            onChange={(e) => handleInputChange(FORM_FIELDS.CIRCLED, e.target.checked)}
        />
    </div>
);
