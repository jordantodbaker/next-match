import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center vertical-center">
      <SignIn signUpUrl={undefined} forceRedirectUrl="/post-login" />
    </div>
  );
}
