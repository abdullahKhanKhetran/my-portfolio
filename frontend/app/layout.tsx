import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";
import Navbar from "../components/Navbar";
import GlobalBackground from "../components/GlobalBackground";
import PageTransitionWrapper from "../components/PageTransitionWrapper";
import LoadingScreen from "../components/LoadingScreen";

export const metadata: Metadata = {
  title: "Abdullah Khan - Full Stack Developer | Portfolio",
  description:
    "Portfolio of Abdullah Khan, a software engineer building web, mobile, and desktop apps using Flutter, .NET, Next.js, React, FastAPI, Django, and DevOps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Abdullah Khan - Full Stack Developer | Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Abdullah Khan, a software engineer building web, mobile, and desktop apps using Flutter, .NET, Next.js, React, FastAPI, Django, and DevOps."
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}})()`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <LoadingScreen />
        <GlobalBackground />
        <Navbar />
        <main className="relative z-10 w-full overflow-x-clip">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
        <CustomCursor />
      </body>
    </html>
  );
}
