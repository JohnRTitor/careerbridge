import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { TextField } from "@/components/form/text-field";
import { PasswordField } from "@/components/form/password-field";
import { NumberField } from "@/components/form/number-field";
import { TextareaField } from "@/components/form/textarea-field";
import { CheckboxField } from "@/components/form/checkbox-field";
import { SwitchField } from "@/components/form/switch-field";
import { SelectField } from "@/components/form/select-field";
import { NativeSelectField } from "@/components/form/native-select-field";
import { RadioGroupField } from "@/components/form/radio-group-field";
import { SliderField } from "@/components/form/slider-field";
import { OTPField } from "@/components/form/otp-field";
import { ComboboxField } from "@/components/form/combobox-field";
import { DateField } from "@/components/form/date-field";
import { SubmitButton } from "@/components/form/submit-button";

export const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    NumberField,
    TextareaField,
    CheckboxField,
    SwitchField,
    SelectField,
    NativeSelectField,
    RadioGroupField,
    SliderField,
    OTPField,
    ComboboxField,
    DateField,
  },

  formComponents: {
    SubmitButton,
  },

  fieldContext,
  formContext,
});
