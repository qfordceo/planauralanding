import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            PlanAura
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/auth"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth?mode=signup"
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
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