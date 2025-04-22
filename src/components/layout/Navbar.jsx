
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../HeroUI';

const Navbar = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            YourBrand
          </Link>
          <nav className="ml-10 hidden space-x-8 md:flex">
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link to="/services" className="text-gray-500 hover:text-gray-900">
              Services
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-900">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          <Link to="/login">
            <Button>Dashboard Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
