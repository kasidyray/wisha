
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
        ? 'py-3 bg-white bg-opacity-80 backdrop-blur-lg shadow-sm' 
        : 'py-5 bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center"
        >
          <span className="text-2xl font-serif font-semibold tracking-tight">Wisha</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`transition-all duration-300 hover:text-champagne-500 ${
              location.pathname === '/' ? 'text-champagne-500' : 'text-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/how-it-works" 
            className={`transition-all duration-300 hover:text-champagne-500 ${
              location.pathname === '/how-it-works' ? 'text-champagne-500' : 'text-foreground'
            }`}
          >
            How It Works
          </Link>
          <Link 
            to="/pricing" 
            className={`transition-all duration-300 hover:text-champagne-500 ${
              location.pathname === '/pricing' ? 'text-champagne-500' : 'text-foreground'
            }`}
          >
            Pricing
          </Link>
          <Link 
            to="/dashboard" 
            className={`transition-all duration-300 hover:text-champagne-500 ${
              location.pathname === '/dashboard' ? 'text-champagne-500' : 'text-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link to="/create-event">
            <Button size="sm" className="ml-4">Create Event</Button>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white bg-opacity-95 backdrop-blur-md shadow-md py-4 animate-fade-in">
          <div className="container px-4 space-y-4 flex flex-col">
            <Link 
              to="/" 
              className={`py-2 transition-all duration-300 ${
                location.pathname === '/' ? 'text-champagne-500' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/how-it-works" 
              className={`py-2 transition-all duration-300 ${
                location.pathname === '/how-it-works' ? 'text-champagne-500' : 'text-foreground'
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`py-2 transition-all duration-300 ${
                location.pathname === '/pricing' ? 'text-champagne-500' : 'text-foreground'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/dashboard" 
              className={`py-2 transition-all duration-300 ${
                location.pathname === '/dashboard' ? 'text-champagne-500' : 'text-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link to="/create-event">
              <Button fullWidth>Create Event</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
