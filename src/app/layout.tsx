import { ThemeProvider } from "@/components/ThemeProvider";
import { VolumeProvider } from "@/components/VolumeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "BlockTone — Minecraft Color Guessing Game",
  description:
    "A daily browser game. Restore distorted Minecraft textures using Hue, Saturation, and Brightness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-body theme-transition`}>
        <ThemeProvider>
          <VolumeProvider>{children}</VolumeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
