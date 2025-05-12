"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ChromeIcon } from "lucide-react"; // Assuming lucide-react is used for icons

interface GoogleSignInButtonProps {
  text: string;
  callbackUrl?: string; // Optional URL to redirect after sign in
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  text,
  callbackUrl = "/", // Default redirect to home or dashboard
}) => {
  const handleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <Button
      variant="outline"
      className="w-full bg-white text-gray-700 hover:bg-primary mt-4"
      onClick={handleSignIn}
    >
      <ChromeIcon className="mr-2 h-5 w-5" /> {/* Using ChromeIcon for Google */}
      {text}
    </Button>
  );
}; 