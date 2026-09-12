export type ContactFormField =
  | "fullName"
  | "email"
  | "phone"
  | "country"
  | "interest"
  | "message"
  | "consent"
  | "form";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: Partial<Record<ContactFormField, string>>;
};
