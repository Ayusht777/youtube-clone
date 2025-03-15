import { UserApi } from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
    <>
      <Card className="border-none rounded-none shadow-none bg-transparent">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          {isLoading ? (
            <Skeleton className="size-32 rounded-full" />
          ) : (
            <Avatar className="size-32 border-2 border-primary/10">
              <AvatarImage src={avatarUrl} alt={fullname} />
              <AvatarFallback className="text-3xl bg-primary/5">
                {fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="text-center">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 mx-auto" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click the camera icon to change your profile picture
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Separator className="mb-6" />
    </>
  );
};

export default UserProfile;
