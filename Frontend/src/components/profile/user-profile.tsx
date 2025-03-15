import { UserApi } from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
const UserProfile = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: UserApi.getCurrentUser,
  });

  if (error) {
    toast.error("Error fetching user data");
  }

  const user = data?.data;
  const avatarUrl = user?.avatar?.url || "";
  const fullname = user?.fullName || "Unknown User";

  const username = user?.userName || "No username";

  return (
    <Card className="border-none rounded-none">
      <CardContent className=" flex flex-col md:flex-row items-center md:items-start gap-4">
        <Avatar className="size-24">
          <AvatarImage src={avatarUrl} alt={fullname} />
          <AvatarFallback className="text-2xl bg-card">
            {fullname.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold">{fullname}</h2>
          <Badge variant={"secondary"} className={cn("rounded-full px-2")}>
            {username}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
