import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_FRONTEND_URL as string;

export const metadata: Metadata = {
   icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  metadataBase: new URL(baseUrl),

  title: {
    default: "DigiQ | Real-Time B2B Queue Management SaaS",
    template: "%s | DigiQ",
  },

  description:
    "Say goodbye to waiting rooms. DigiQ is the ultimate virtual queue management software.",

  openGraph: {
    type: "website",
    url: "/", 
    title: "DigiQ | Never wait in a physical line again",
    description:
      "Join queues remotely and track your position in real-time.",
    siteName: "DigiQ",
    images: [
    {
      url: "/logo.png", 
      width: 1200,
      height: 630,
      alt: "DigiQ | Never wait in a physical line again",
    },
  ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DigiQ | Smart Queue Management",
    description:
      "Join queues remotely and track your position in real-time.",
      images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
