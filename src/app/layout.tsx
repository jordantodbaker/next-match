import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/Providers";
import "./globals.css";
import { getCurrentUser } from "@/auth";

const description =
  "Consistent data, powerful Power BI analytics, and secure cloud access for your projects.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "Ace Project Services",
    template: "%s | Ace Project Services",
  },
  description,
  openGraph: {
    title: "Ace Project Services",
    description,
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Project Services",
    description,
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#0d4788" } }}>
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
