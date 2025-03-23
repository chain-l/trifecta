import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RootProvider from "./providers/RootProvider";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OGxBT Trifecta",
  description: "OGxBT - Trifecta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <RootProvider>
            <Navbar />
            <ToastContainer />
            {children}
            <Footer />
          </RootProvider>
      </body>
    </html>
  );
}