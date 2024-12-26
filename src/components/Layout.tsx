import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/7399aaa3-93f1-4a02-9a99-18671fa4da27.png" alt="Plan Aura Logo" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/auth"
              className="text-sm font-medium text-secondary hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth?mode=signup"
              className="px-4 py-2 rounded-full bg-secondary text-primary font-medium hover:bg-secondary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;