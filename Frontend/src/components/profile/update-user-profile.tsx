import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";

const UpdateUserProfile = () => {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success toast
    }, 1500);
  };

  return (
    <Card className="border-none rounded-none  bg-transparent">
      <CardContent>
        <form onSubmit={handleSubmit} className=" max-w-xl mx-auto">
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
