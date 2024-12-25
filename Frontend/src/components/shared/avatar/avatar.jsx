import { useSelector } from "react-redux";
const Avatar = () => {
  const avatar = useSelector((state) => state.auth.user);
  console.log(avatar);
  return <div className="size-10 rounded-full">
    {/* {avatar ? <img src={avatar} alt="" />:} */}
  </div>;
};

export default Avatar;
