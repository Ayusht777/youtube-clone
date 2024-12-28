import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { registrationFormValidation } from "@/helper/validator/formValidation";
import { uploadClient } from "@/utils/axiosInstance";
import AvatarUploader from "@/components/shared/avatar/avatarUploader";
import Button from "@/components/shared/button";
import Input from "@/components/shared/input";
const initialRegistrationData = {
  email: "",
  password: "",
  username: "",
  fullname: "",
};
const Register = () => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [registrationData, setRegistrationData] = useState(
    initialRegistrationData
  );
  const navigate = useNavigate();

  const { validateForm } = registrationFormValidation(
    registrationData,
    avatarFile
  );

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("email", registrationData.email);
    formData.append("password", registrationData.password);
    formData.append("userName", registrationData.username);
    formData.append("fullName", registrationData.fullname);
    formData.append("avatar", avatarFile);

    try {
      const response = await uploadClient.post("/users/register", formData);
      console.log(response);
      toast.success("Registration successful!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-inherit w-full flex justify-center items-center">
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleRegistrationSubmit}
        noValidate
      >
        <AvatarUploader setAvatar={setAvatarFile} className="mb-2" />

        <Input
          name="email"
          placeholder="Enter your email"
          type="email"
          value={registrationData.email}
          onChange={handleInputChange}
        />
        <Input
          name="password"
          placeholder="Create a password"
          type="password"
          value={registrationData.password}
          onChange={handleInputChange}
        />
        <Input
          name="username"
          placeholder="Choose a username"
          type="text"
          value={registrationData.username}
          onChange={handleInputChange}
        />
        <Input
          name="fullname"
          placeholder="Enter your full name"
          type="text"
          value={registrationData.fullname}
          onChange={handleInputChange}
        />
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
};

export default Register;
