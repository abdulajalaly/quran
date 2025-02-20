import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import VideoPlayer from "./../components/VideoPlayer";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Discover the Quran this Ramadan 2025",
  description:
    "A journey of reward with every verse. Ultimate guidance to humanity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VideoPlayer />
        {children}
        <Footer />
      </body>
    </html>
  );
}
