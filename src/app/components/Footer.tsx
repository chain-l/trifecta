"use client"

import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'react-toastify';

const Footer = () => {
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
    <footer className="bg-black border-t border-blue-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">ETH Trifecta</h3>
            <p className="text-sm text-gray-300 max-w-xs">
              Building the future of decentralized AI agents on the blockchain.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/docs"
                  onClick={showComingSoonToast}
                  className="text-sm text-gray-300 hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={showComingSoonToast}
                  className="text-sm text-gray-300 hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  onClick={showComingSoonToast}
                  className="text-sm text-gray-300 hover:text-primary transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                onClick={showComingSoonToast}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                onClick={showComingSoonToast}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                onClick={showComingSoonToast}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              Made with ❤️ by ETH Trifecta
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                onClick={showComingSoonToast}
                className="text-sm text-gray-300 hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                onClick={showComingSoonToast}
                className="text-sm text-gray-300 hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;