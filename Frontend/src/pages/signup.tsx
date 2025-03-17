import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <SignupForm className="w-full max-w-md" />
    </div>
  );
}
