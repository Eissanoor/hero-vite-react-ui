
import React from 'react';
import { Button } from '../HeroUI';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="hero-container">
        <div className="grid items-center py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
          {/* Hero content */}
          <div className="max-w-xl animate-fade-in">
            <div>
              <span className="hero-badge mb-4 inline-flex items-center">
                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                New Components Released
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Beautiful UI with</span>
              <span className="hero-text-gradient block">HeroUI Components</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              A collection of beautifully designed React components built with Tailwind CSS.
              Speed up your development process and create stunning user interfaces with ease.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="default" size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg" icon={ArrowRightIcon} iconPosition="right">
                View Components
              </Button>
            </div>
          </div>

          {/* Hero image/illustration */}
          <div className="mt-12 hidden animate-fade-in lg:mt-0 lg:block">
            <div className="relative">
              <div className="aspect-w-5 aspect-h-3 overflow-hidden rounded-lg bg-gradient-to-br from-hero-primary to-hero-secondary p-1">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white p-4">
                  {/* Placeholder for hero image - using a component preview mockup */}
                  <div className="grid w-full gap-4 p-4">
                    <div className="h-16 rounded-md bg-hero-primary/10 p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-hero-primary"></div>
                        <div className="h-4 w-24 rounded bg-hero-primary/30"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 rounded-lg bg-hero-primary/5 p-3">
                          <div className="h-3 w-12 rounded bg-hero-primary/20"></div>
                          <div className="mt-2 h-8 w-full rounded bg-hero-primary/10"></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="h-10 rounded-md bg-hero-primary"></div>
                      <div className="h-10 rounded-md border-2 border-hero-primary bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -left-8 -top-8 h-16 w-16 rounded-full bg-hero-accent/30 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-hero-primary/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
