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
  metadataBase: new URL("https://bughive-seven.vercel.app"),
  title: {
    default: "Bughive – Simple Issue & Bug Tracking",
    template: "%s | Bughive",
  },
  description:
    "Bughive is a lightweight issue and bug tracker that helps teams report, assign, and resolve software issues faster.",
  applicationName: "Bughive",
  keywords: [
    "bug tracker",
    "issue tracker",
    "bug tracking software",
    "issue management",
    "project management",
    "software bugs",
    "Bughive",
  ],
  authors: [{ name: "Bughive" }],
  creator: "Bughive",
  publisher: "Bughive",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Bughive",
    title: "Bughive – Simple Issue & Bug Tracking",
    description:
      "Bughive is a lightweight issue and bug tracker that helps teams report, assign, and resolve software issues faster.",
    url: "/",
    locale: "en_US",
    // TODO: replace with a 1200x630 PNG at /public/og-image.png for best results
    // on Slack, Discord, Facebook, LinkedIn, etc.
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Bughive logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bughive – Simple Issue & Bug Tracking",
    description:
      "Bughive is a lightweight issue and bug tracker that helps teams report, assign, and resolve software issues faster.",
    images: ["/icon.svg"],
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
