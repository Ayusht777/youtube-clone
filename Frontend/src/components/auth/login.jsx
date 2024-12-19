import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginFormValidation } from "../../helper/validator/formValidation";
import Button from "../shared/Button";
import Input from "../shared/Input";
import { apiClient } from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth/auth.slice";
import { tokenStorage } from "../../utils/tokenStorage";
const initialLoginData = {
  email: "",
  password: "",
};
const Login = () => {
  const [loginData, setLoginData] = useState(initialLoginData);
  const dispatch = useDispatch();

  const { validateForm } = loginFormValidation(loginData);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await apiClient.post("/users/login", loginData);
      const userData = response?.data?.data;
      tokenStorage.setTokens(userData.accessToken, userData.refreshToken);
      dispatch(loginUser(userData));
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-inherit w-full flex justify-center items-center">
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleLoginSubmit}
        noValidate
      >
        <Input
          name="email"
          placeholder="Enter your email"
          type="email"
          value={loginData.email}
          onChange={handleInputChange}
        />
        <Input
          name="password"
          placeholder="Create a password"
          type="password"
          value={loginData.password}
          onChange={handleInputChange}
        />

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
