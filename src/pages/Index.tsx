import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ListingsModal from "@/components/ListingsModal";
import { FloorPlanScraper } from "@/components/FloorPlanScraper";

const Index = () => {
  const [showListings, setShowListings] = useState(false);
  const [showFloorPlans, setShowFloorPlans] = useState(false);

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <img 
              src="/lovable-uploads/7399aaa3-93f1-4a02-9a99-18671fa4da27.png" 
              alt="Plan Aura Logo" 
              className="w-48 mx-auto mb-8"
            />
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Coming Soon
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Plan Aura <span className="text-primary">is under construction</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We're building something amazing. Join our waitlist to be the first to
              know when we launch and get exclusive early access.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Join Waitlist
              </Link>
              <a
                href="mailto:sales@planaura.com"
                className="w-full sm:w-auto px-8 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl cursor-pointer"
                onClick={() => {
                  if (feature.title === "Premium Land Plots") {
                    setShowListings(true);
                  } else if (feature.title === "Floor Plans") {
                    setShowFloorPlans(true);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ListingsModal open={showListings} onOpenChange={setShowListings} />
      
      {showFloorPlans && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Floor Plans</h2>
              <button 
                onClick={() => setShowFloorPlans(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <FloorPlanScraper />
          </div>
        </div>
      )}
    </div>
  );
};

const features = [
  {
    title: "Premium Land Plots",
    description:
      "Get early access to exclusive land listings and secure your ideal location.",
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Floor Plans",
    description:
      "Browse and customize floor plans to find the perfect layout for your dream home.",
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    title: "Seamless Experience",
    description:
      "From land selection to final build, enjoy a streamlined journey to your new home.",
    icon: (
      <svg
        className="w-6 h-6 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default Index;