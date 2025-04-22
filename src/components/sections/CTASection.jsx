
import React from 'react';
import { Button } from '../HeroUI';

const CTASection = () => {
  return (
    <section className="bg-hero-gradient py-12 sm:py-16">
      <div className="hero-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build your next great UI?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/90">
            Get started with HeroUI today and transform your React projects with beautiful components.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button 
              className="bg-white text-hero-primary hover:bg-white/90" 
              size="lg"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10" 
              size="lg"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
