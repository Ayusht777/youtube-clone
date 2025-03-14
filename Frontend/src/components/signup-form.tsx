import { UserApi } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [userName, setUserName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      return await UserApi.register(formData);
    },
    onSuccess: () => {
      toast.success("User registered successfully!");
      navigate("/login");
    },
    onError: (error: ApiError) => {
      console.log(error)
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(); // Trigger the mutation
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-4",
        className
      )}
      {...props}
    >
      <Card className="bg-background text-foreground w-full max-w-md p-6 shadow-lg rounded-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-semibold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter your username"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="avatar">Avatar</Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer file:mt-1"
                  onChange={(e) => {
                    if (e.target.files) {
                      setAvatar(e.target.files[0]);
                    }
                  }}
                />
                {avatar && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                    onClick={() => setAvatar(null)}
                  >
                    <XCircle size={20} />
                  </button>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full py-2 text-lg">
              Create account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Do you have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
