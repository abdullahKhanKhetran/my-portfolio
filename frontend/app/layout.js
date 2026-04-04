import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "../components/CustomCursor.jsx";
import Navbar from "../components/Navbar.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Abdullah Khan - Full Stack Developer | Portfolio",
  description: "Portfolio of Abdullah Khan, a software engineer building web, mobile, and desktop apps using Flutter, .NET, Next.js, React, FastAPI, Django, and DevOps.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Abdullah Khan - Full Stack Developer | Portfolio</title>
        <meta name="description" content="Portfolio of Abdullah Khan, a software engineer building web, mobile, and desktop apps using Flutter, .NET, Next.js, React, FastAPI, Django, and DevOps." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased cursor-none`}
      >
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
