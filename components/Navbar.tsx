import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Flower2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Tours', path: '/tours' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';
  // If not home, we always want the "scrolled" style (white background)
  const isScrolledOrNotHome = scrolled || !isHome;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        isScrolledOrNotHome 
          ? 'bg-white/95 backdrop-blur-md border-stone-100 shadow-sm py-3 text-stone-800' 
          : 'bg-transparent border-transparent py-6 text-white'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group z-50 relative">
          <div className={`p-1.5 rounded-full transition-colors duration-300 ${isScrolledOrNotHome ? 'bg-hibiscus-50' : 'bg-white/10'}`}>
            <Flower2 
              className={`w-6 h-6 md:w-8 md:h-8 ${isScrolledOrNotHome ? 'text-hibiscus-600' : 'text-white'} transition-transform duration-500 group-hover:rotate-45`} 
            />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl md:text-2xl font-serif font-bold leading-none tracking-tight ${isScrolledOrNotHome ? 'text-stone-900' : 'text-white'}`}>
              Hibiscus
            </span>
            <span className={`text-sm font-script tracking-wider ${isScrolledOrNotHome ? 'text-hibiscus-600' : 'text-white/90'}`}>
              Holiday
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative font-medium text-sm tracking-wide transition-colors duration-300 hover:text-hibiscus-500 ${
                location.pathname === link.path 
                  ? (isScrolledOrNotHome ? 'text-hibiscus-600 font-bold' : 'text-white font-bold')
                  : ''
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="underline" 
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isScrolledOrNotHome ? 'bg-hibiscus-600' : 'bg-white'}`} 
                />
              )}
            </Link>
          ))}
          <Link
            to="/tours"
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
              isScrolledOrNotHome
                ? 'bg-hibiscus-600 text-white hover:bg-hibiscus-700 shadow-hibiscus-600/20'
                : 'bg-white text-hibiscus-700 hover:bg-stone-50 shadow-black/10'
            }`}
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden focus:outline-none z-50 transition-colors ${isScrolledOrNotHome || isOpen ? 'text-stone-800' : 'text-white'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 bg-white z-40 pt-24 px-6 md:hidden flex flex-col items-center justify-start space-y-8 h-screen"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-2xl font-serif font-medium ${
                  location.pathname === link.path ? 'text-hibiscus-600' : 'text-stone-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/tours"
              className="w-full max-w-xs text-center bg-hibiscus-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-xl shadow-hibiscus-200 mt-4"
              onClick={() => setIsOpen(false)}
            >
              Start Planning
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;