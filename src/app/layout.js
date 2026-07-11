import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "D Entertainment - Sound & Entertainment",
  description: "Professional DJ booking platform for weddings, parties, musical shows, and special events. Book D Entertainment for an unforgettable experience.",
  keywords: "DJ booking, entertainment, weddings, parties, events, Sri Lanka DJ",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden"
      >
        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}