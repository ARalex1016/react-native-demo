export function validateEmail(email: string) {
  const normalized = email.trim();
  if (!normalized) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validatePassword(password: string) {
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Use at least 8 characters.";
  return null;
}

export function clerkErrorMessage(error: unknown) {
  if (!error) return null;
  if (typeof error === "object") {
    if ("longMessage" in error && typeof error.longMessage === "string" && error.longMessage) {
      return error.longMessage;
    }
    if ("message" in error && typeof error.message === "string" && error.message) {
      return error.message;
    }
  }
  return "We couldn’t complete that request. Please try again.";
}
