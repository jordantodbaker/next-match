import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

// Accepts Clerk invitation links (the `__clerk_ticket`): the invited user
// sets their own password here, then lands on /post-login where their app
// record is provisioned from the invitation metadata.
export default function SignUpPage() {
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
      <SignUp signInUrl="/login" forceRedirectUrl="/post-login" />
    </div>
  );
}
