import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/Providers";
import "./globals.css";
import { getCurrentUser } from "@/auth";

export const metadata: Metadata = {
  title: "Ace Project Services",
  description:
    "Consistent data, powerful Power BI analytics, and secure cloud access for your projects.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers user={user}>
            <main className="vertical-center">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
