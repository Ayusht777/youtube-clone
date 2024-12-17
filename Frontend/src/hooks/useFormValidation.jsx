import toast from "react-hot-toast";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const useRegistrationFormValidation = (formData, avatarFile) => {
  const validateForm = () => {
    switch (true) {
      case !avatarFile:
        toast.error("Profile picture is required");
        return false;

      case !formData.email.trim():
        toast.error("Email is required");
        return false;
      case !emailRegex.test(formData.email):
        toast.error("Please enter a valid email address");
        return false;

      case !formData.password.trim():
        toast.error("Password is required");
        return false;

      case formData.password.length < 8:
        toast.error("Password must be at least 8 characters long");
        return false;

      case !formData.username.trim():
        toast.error("Username is required");
        return false;

      case formData.username.length < 3:
        toast.error("Username must be at least 3 characters long");
        return false;

      case !formData.fullName.trim():
        toast.error("Full name is required");
        return false;

      case formData.fullName.length < 2:
        toast.error("Please enter a valid full name");
        return false;

      default:
        return true;
    }
  };

  return { validateForm };
};
