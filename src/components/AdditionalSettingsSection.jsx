// Additional Settings Section
import {FORM_FIELDS, WB_OPTIONS} from "../constants";
import { FormInput} from "./FormInput";
import {FormSelect} from "./FormSelect";

export const AdditionalSettingsSection = ({ formData, errors, touched, handleInputChange, handleBlur }) => (
    <div className="space-y-4">
        <FormSelect
            label="White Balance"
            name={FORM_FIELDS.WHITE_BALANCE}
            value={formData.whiteBalance}
            onChange={(e) => handleInputChange(FORM_FIELDS.WHITE_BALANCE, e.target.value)}
            onBlur={() => handleBlur(FORM_FIELDS.WHITE_BALANCE)}
            error={errors[FORM_FIELDS.WHITE_BALANCE]}
            touched={touched[FORM_FIELDS.WHITE_BALANCE]}
            options={WB_OPTIONS}
        />

        <FormInput
            label="User Initials"
            name={FORM_FIELDS.USER}
            value={formData.user}
            onChange={(e) => handleInputChange(FORM_FIELDS.USER, e.target.value.slice(0, 3))}
            onBlur={() => handleBlur(FORM_FIELDS.USER)}
            error={errors[FORM_FIELDS.USER]}
            touched={touched[FORM_FIELDS.USER]}
            maxLength="3"
            placeholder="ABC"
        />
    </div>
);
