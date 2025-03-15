import { UserApi } from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const UserProfile = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: UserApi.getCurrentUser,
  });

  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (error) {
    toast.error("Error fetching user data");
  }

  const user = data?.data;
  const avatarUrl = previewUrl || user?.avatar?.url || "";
  const fullname = user?.fullName || "Unknown User";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <Card className="border-none rounded-none shadow-none bg-transparent">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          {isLoading ? (
            <Skeleton className="size-24 rounded-full" />
          ) : (
            <div className="relative group">
              <Avatar className="size-24 border-2 border-primary/10">
                <AvatarImage src={avatarUrl} alt={fullname} />
                <AvatarFallback className="text-3xl bg-primary/5">
                  {fullname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="profile-avatar-upload"
                className="absolute bottom-0 right-0 bg-red-600 text-white rounded-full p-2 cursor-pointer shadow-md transition-transform group-hover:scale-110"
              >
                <Camera className="size-4" />
              </Label>
              <Input
                id="profile-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
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
