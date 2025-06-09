import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavigationWrapper from "@/components/navigation-wrapper";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sachindra | Full Stack & Web3 Developer",
  description:
    "Portfolio of Sachindra, a passionate Full Stack Web Developer and Web3 Smart Contract Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} bg-black text-gray-200`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <NavigationWrapper>{children}</NavigationWrapper>
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
