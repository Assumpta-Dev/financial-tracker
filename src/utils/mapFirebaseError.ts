// Maps Firebase errors to user-friendly messages for toasts
export default function mapFirebaseError(error: any): string {
  if (!error) return "An unknown error occurred";

  // Try to get a canonical error code
  let code: string | null = null;
  if (typeof error.code === "string") code = error.code;
  else if (typeof error.message === "string") {
    const m = error.message.match(/auth\/[a-zA-Z0-9-]+/);
    if (m) code = m[0];
  }

  switch (code) {
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/user-not-found":
      return "Account not found. Please create an account first.";
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again.";
    case "auth/email-already-in-use":
      return "That email is already registered. Try signing in instead.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    default:
      // Fall back to the provided message if available
      if (typeof error.message === "string" && error.message.trim().length > 0)
        return error.message.replace(/^Firebase: /, "");
      return "An error occurred. Please try again.";
  }
}
