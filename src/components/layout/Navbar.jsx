
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../HeroUI';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-restaurant-accent/10 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-restaurant-primary dark:text-restaurant-secondary">
            YourBrand
          </Link>
          <nav className="ml-10 hidden space-x-8 md:flex">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-restaurant-primary dark:hover:text-restaurant-secondary">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-restaurant-primary dark:hover:text-restaurant-secondary">
              About
            </Link>
            <Link to="/services" className="text-gray-600 dark:text-gray-300 hover:text-restaurant-primary dark:hover:text-restaurant-secondary">
              Services
            </Link>
            <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-restaurant-primary dark:hover:text-restaurant-secondary">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button className="bg-restaurant-primary hover:bg-restaurant-primary/90 text-white">
              Dashboard Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
