
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white pt-12 pb-8">
      <div className="hero-container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and description */}
          <div className="col-span-1">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-hero-primary">
                <span className="text-lg font-bold text-white">H</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">HeroUI</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Beautiful UI components built with Tailwind CSS
              for modern React applications.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Components
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Examples
                </a>
              </li>
            </ul>
          </div>
          
          {/* Help & Support */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Help & Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Community
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-hero-primary">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} HeroUI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
