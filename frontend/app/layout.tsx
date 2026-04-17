import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import GlobalBackground from "../components/GlobalBackground";
import PageTransitionWrapper from "../components/PageTransitionWrapper";
import LoadingScreen from "../components/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Abdullah Khan - Full Stack Developer | Portfolio",
  description:
    "Portfolio of Abdullah Khan, a software engineer building web, mobile, and desktop apps using Flutter, .NET, Next.js, React, FastAPI, Django, and DevOps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Abdullah Khan - Full Stack Developer | Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Abdullah Khan, a software engineer building web, mobile, and desktop apps using Flutter, .NET, Next.js, React, FastAPI, Django, and DevOps."
        />
      </head>
      <body className={`text-white min-h-screen ${spaceGrotesk.variable}`}>
        <LoadingScreen />
        <GlobalBackground />
        <div style={{ height: "72px" }} aria-hidden className="md:block hidden" />
        <div style={{ height: "96px" }} aria-hidden className="md:hidden block" />
        <Navbar />
        <main className="w-full overflow-x-clip relative z-10">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
        <CustomCursor />
      </body>
    </html>
  );
}
