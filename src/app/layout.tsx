import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopeSlopes - Tech & Lifestyle Blog",
  description: "A tech and lifestyle blog documenting the journey of a Software and IT Engineer navigating the intersection of code, AI, and Colorado's outdoor adventures.",
  keywords: ["blog", "tech", "AI", "software engineering", "Colorado", "lifestyle"],
  authors: [{ name: "CopeSlopes" }],
  openGraph: {
    title: "CopeSlopes - Tech & Lifestyle Blog",
    description: "Documenting the journey of a Software and IT Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
