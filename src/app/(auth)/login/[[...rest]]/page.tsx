import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-primary-50 p-6">
      <Image
        src="/logo.png"
        alt="Ace Project Services"
        width={1301}
        height={496}
        priority
        className="h-16 w-auto"
      />
      <SignIn signUpUrl={undefined} forceRedirectUrl="/post-login" />
    </div>
  );
}
