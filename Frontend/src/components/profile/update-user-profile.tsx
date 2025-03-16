import { UserApi } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";

const UpdateUserProfile = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: UserApi.getCurrentUser,
  });

  const updateUserProfileMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string }) =>
      UserApi.updateUserProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    },
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (data?.data) {
      setFullName(data.data.fullName);
      setEmail(data.data.email);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfileMutation.mutate({ fullName, email });
  };

  return (
    <Card className="border-none rounded-none bg-transparent">
      <CardContent>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-10 bg-[#121212] border-[#303030]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-[#121212] border-[#303030]"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-4 bg-white text-black hover:bg-gray-200"
              disabled={updateUserProfileMutation.isPending}
            >
              {updateUserProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateUserProfile;
