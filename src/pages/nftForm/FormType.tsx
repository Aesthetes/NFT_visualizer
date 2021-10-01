import * as Yup from "yup";

export const searchInitialValues = { issuer: "", id: "" };

export const searchValidationschema = Yup.object({
  issuer: Yup.string()
    .required("need issuer")
    .matches(/^([r])([1-9A-HJ-NP-Za-km-z]{24,34})$/),
  id: Yup.string().length(11, "Id needs to be 12 char"),
});
