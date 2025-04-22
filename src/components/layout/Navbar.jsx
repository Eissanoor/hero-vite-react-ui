
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../HeroUI';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            YourBrand
          </Link>
          <nav className="ml-10 hidden space-x-8 md:flex">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Services
            </Link>
            <Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button>Dashboard Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
