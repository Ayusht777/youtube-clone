import { UserApi } from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

// Placeholder video data (to mimic the YouTube video grid)
const placeholderVideos = [
  { id: 1, title: "Video 1", views: "1.2K", date: "2 days ago" },
  { id: 2, title: "Video 2", views: "5.6K", date: "1 week ago" },
  { id: 3, title: "Video 3", views: "3.8K", date: "3 days ago" },
  { id: 4, title: "Video 4", views: "9.1K", date: "1 month ago" },
];

const UserProfile = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: UserApi.getCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-6xl space-y-4">
          <Skeleton className="h-32 w-full rounded-lg bg-card" />
          <Skeleton className="h-96 w-full rounded-lg bg-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl bg-card border-border">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Could not load user data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = data?.data;
  const avatarUrl = user?.avatar?.url || "";
  const fullname = user?.fullName || "Unknown User";
  const email = user?.email || "No email provided";
  const username = user?.userName || "No username";

  return (
    <Card className="border-none rounded-none">
      <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={avatarUrl} alt={fullname} />
          <AvatarFallback className="text-2xl bg-card">
            {fullname.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-xl font-semibold">{fullname}</h2>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
