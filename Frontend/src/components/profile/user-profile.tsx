import { UserApi } from "@/api/api";
import { useQuery } from "@tanstack/react-query";

const UserProfile = () => {
  const { data } = useQuery({
    queryKey: ["current-user"],
    queryFn: UserApi.getCurrentUser,
  });
  console.log(data);
  return <div></div>;
};

export default UserProfile;
