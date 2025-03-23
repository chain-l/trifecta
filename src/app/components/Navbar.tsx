"use client";

import Link from "next/link";
import { ConnectWallet } from "./ConnectWallet/ConnectWallet";
import { Waves } from "lucide-react";
import { toast } from "react-toastify";

export function Navbar() {
  const showComingSoonToast = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    toast.info("Coming Soon!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-80 backdrop-blur-md border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Waves className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-cyan bg-clip-text text-white">
            OGxBT
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              href="/features"
              onClick={showComingSoonToast}
              className="text-gray-300 hover:text-primary transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="/faqs"
              onClick={showComingSoonToast}
              className="text-gray-300 hover:text-primary transition-colors font-medium"
            >
              FAQs
            </Link>
            <div className="pl-6 border-l border-blue-100">
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}