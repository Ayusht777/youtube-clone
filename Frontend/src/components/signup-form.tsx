import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerUser } from "@/api/userApi";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
    fullName: "",
    avatar: null as File | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.avatar) {
      toast.error("Please select an avatar");
      return;
    }
    signupMutation.mutate({
      email: formData.email,
      password: formData.password,
      userName: formData.userName,
      fullName: formData.fullName,
      avatar: formData.avatar,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, avatar: e.target.files[0] });
    }
  };

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creating Account..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}