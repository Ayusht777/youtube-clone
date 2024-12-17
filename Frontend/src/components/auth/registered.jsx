import { useState } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import AvatarUploader from "../shared/avatar/avatarUploader";
import { toast } from "react-hot-toast";
const Register = () => {
  const [avatarFile, setavatarFile] = useState(null);
  const [fromData, setfromData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
  });
  const handleFromDataChange = (e) => {
    console.log(e.target.name, e.target.value);
  };
  return (
    <div className="bg-inherit w-full  flex justify-center items-center">
      <form action="" className="flex flex-col gap-4  w-full">
        <AvatarUploader setAvatar={setavatarFile} className={"mb-2"} />
        <Input
          name="email"
          placeholder="Enter your email"
          type="email"
          value={fromData.email}
          onChange={handleFromDataChange}
          
        />
        <Input
          name="password"
          placeholder="Create a password"
          type="password"
          value={fromData.password}
          onChange={handleFromDataChange}
        />
        <Input
          name="username"
          placeholder="Choose a username"
          type="text"
          value={fromData.username}
          onChange={handleFromDataChange}
        />
        <Input
          name="fullname"
          placeholder="Enter your full name"
          type="text"
          value={fromData.fullname}
          onChange={handleFromDataChange}
        />
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
};

export default Register;
