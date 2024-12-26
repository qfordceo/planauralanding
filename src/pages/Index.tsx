import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ListingsModal from "@/components/ListingsModal";
import { features } from "@/config/features";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showListings, setShowListings] = useState(false);
  const navigate = useNavigate();

  const handleFeatureClick = (feature: typeof features[0]) => {
    if (feature.link) {
      navigate(feature.link);
    } else if (feature.title === "Premium Land Plots") {
      setShowListings(true);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/7399aaa3-93f1-4a02-9a99-18671fa4da27.png" 
              alt="Plan Aura Logo" 
              className="w-8 h-8"
            />
            <span className="font-semibold">Plan Aura</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/auth?mode=signin&type=contractor"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contractor Login
            </Link>
            <Button asChild>
              <Link to="/auth?mode=signup">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-16">
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
                onClick={() => handleFeatureClick(feature)}
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
    </div>
  );
};

export default Index;