import { SignUp } from "@clerk/nextjs";
import React from "react";

// Accepts Clerk invitation links (the `__clerk_ticket`): the invited user
// sets their own password here, then lands on /post-login where their app
// record is provisioned from the invitation metadata.
export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center vertical-center">
      <SignUp signInUrl="/login" forceRedirectUrl="/post-login" />
    </div>
  );
}
