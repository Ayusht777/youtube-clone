import { useState } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import AvatarUploader from "../shared/avatar/avatarUploader";
import { useRegistrationFormValidation } from "../../hooks/useFormValidation";
const Register = () => {
  const [avatarFile, setavatarFile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
  });
  const { validateForm } = useRegistrationFormValidation(formData, avatarFile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      toast.success("Registration form submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };
  const handleFromDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevInputValue) => ({
      ...prevInputValue,
      [name]: value.trim().toLowerCase(),
    }));
  };
  
  // console.log(validateForm)
  return (
    <div className="bg-inherit w-full  flex justify-center items-center">
      <form action="" className="flex flex-col gap-4  w-full" onSubmit={handleSubmit}>
        <AvatarUploader setAvatar={setavatarFile} className={"mb-2"} />
        <Input
          name="email"
          placeholder="Enter your email"
          type="email"
          value={formData.email}
          onChange={handleFromDataChange}
        />
        <Input
          name="password"
          placeholder="Create a password"
          type="password"
          value={formData.password}
          onChange={handleFromDataChange}
        />
        <Input
          name="username"
          placeholder="Choose a username"
          type="text"
          value={formData.username}
          onChange={handleFromDataChange}
        />
        <Input
          name="fullname"
          placeholder="Enter your full name"
          type="text"
          value={formData.fullname}
          onChange={handleFromDataChange}
        />
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
};

export default Register;
