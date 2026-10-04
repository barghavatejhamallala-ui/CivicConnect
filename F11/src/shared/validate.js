const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

export const isValidEmail = (v) => EMAIL_RE.test(String(v).trim());

/** 10-digit Indian mobile number, optional +91 prefix, spaces or dashes. */
export const isValidMobile = (v) =>
  MOBILE_RE.test(
    String(v).trim().replace(/^\+?91[\s-]?/, "").replace(/[\s-]/g, "")
  );

/** Returns an error message for one field, or "" when it is valid. */
export function validateField(field, value) {
  const v = String(value ?? "").trim();
  if (!v) return `Enter ${field.label.toLowerCase()}`;
  if (field.kind === "email" && !isValidEmail(v)) return "Enter a valid email address";
  if (field.kind === "mobile" && !isValidMobile(v)) return "Enter a valid 10-digit mobile number";
  if (field.kind === "identifier") {
    if (v.includes("@") ? !isValidEmail(v) : !isValidMobile(v)) return "Enter a valid mobile number or email";
  }
  if (field.kind === "name" && v.length < 2) return "Enter a valid name";
  return "";
}
