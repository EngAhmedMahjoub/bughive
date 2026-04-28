import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./NavBar";
import { Container, Theme } from "@radix-ui/themes";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./QueryClientProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Bug Hive",
    template: "%s | Bug Hive",
  },
  description:
    "Bug Hive - Collaborative issue and bug tracking platform for development teams",
  keywords: [
    "issue tracking",
    "bug tracking",
    "project management",
    "collaboration",
  ],
  authors: [{ name: "Bug Hive" }],
  creator: "Bug Hive",
  publisher: "Bug Hive",
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bug Hive",
    title: "Bug Hive - Issue Tracking",
    description:
      "Collaborative issue and bug tracking platform for development teams",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bug Hive - Issue Tracking",
    description:
      "Collaborative issue and bug tracking platform for development teams",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <QueryClientProvider>
          <AuthProvider>
            <Theme accentColor="lime" radius="small">
              <NavBar />
              <main className="p-5">
                <Container>{children}</Container>
              </main>
            </Theme>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
