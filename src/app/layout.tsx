import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { EventCardStyleProvider } from "@/components/EventCardStyleProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const teko = localFont({
  src: "../fonts/teko/Teko-Bold.ttf",
  variable: "--font-teko",
  weight: "700",
  display: "swap",
});

const siteTitle = "PickFist — Fight Prediction Rankings";
const siteDescription =
  "Who Is The World's Best Fight Predictor? Global combat-sports prediction competition.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  applicationName: "PickFist",
  icons: {
    icon: [{ url: "/icon", type: "image/png" }],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "PickFist",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
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
      className="dark"
      data-event-card-style="enhanced"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${teko.variable} antialiased bg-[#070707] text-white`}
      >
        <EventCardStyleProvider>{children}</EventCardStyleProvider>
        <Analytics />
      </body>
    </html>
  );
}
