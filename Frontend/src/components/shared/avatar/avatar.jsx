import useAuthStore from "../../../store/store";

const Avatar = () => {
  const avatar = useAuthStore((state) => state.user?.avatar?.url);

  return (
    <div className="size-8 rounded-full overflow-clip">
      {avatar ? (
        <img src={avatar} alt="" />
      ) : (
        <div className="rounded-full bg-slate-200 animate-pulse w-full h-full"></div>
      )}
    </div>
  );
};

export default Avatar;
