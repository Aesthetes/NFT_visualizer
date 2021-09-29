import * as Yup from "yup";

export const searchInitialValues = { issuer: "", id: "" };

export const searchValidationschema = Yup.object({
  issuer: Yup.string().required("need issuer"),
  id: Yup.string().length(12, "Id needs to be 12 char"),
});
