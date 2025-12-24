import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PACKAGE_TYPES } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showToursDropdown, setShowToursDropdown] = useState(false);
  const [showMobileToursMenu, setShowMobileToursMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    setShowToursDropdown(false);
    setShowMobileToursMenu(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowToursDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';
  const isScrolledOrNotHome = scrolled || !isHome;
  const isToursPage = location.pathname === '/tours' || location.pathname.startsWith('/tours/');

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
        <Link to="/" className="flex items-center z-50 relative group">
          <img 
            src="https://storage.googleapis.com/clientmedia/hibiscusholiday/Untitled%20design%20(6).png" 
            alt="Hibiscus Holidays" 
            className="h-10 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.slice(0, 1).map((link) => (
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

          {/* Tours Dropdown */}
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => setShowToursDropdown(true)}
            onMouseLeave={() => setShowToursDropdown(false)}
          >
            <Link
              to="/tours"
              className={`relative font-medium text-sm tracking-wide transition-colors duration-300 hover:text-hibiscus-500 flex items-center gap-1 ${
                isToursPage
                  ? (isScrolledOrNotHome ? 'text-hibiscus-600 font-bold' : 'text-white font-bold')
                  : ''
              }`}
            >
              All Tours
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${showToursDropdown ? 'rotate-180' : ''}`} 
              />
              {isToursPage && (
                <motion.div 
                  layoutId="underline" 
                  className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isScrolledOrNotHome ? 'bg-hibiscus-600' : 'bg-white'}`} 
                />
              )}
            </Link>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showToursDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden min-w-[220px]">
                    <div className="py-2">
                      {/* Category Links */}
                      {PACKAGE_TYPES.map((pkg) => (
                        <Link
                          key={pkg.id}
                          to={`/tours#${pkg.id}`}
                          className="block px-5 py-2.5 text-stone-600 hover:bg-hibiscus-50 hover:text-hibiscus-600 transition-colors text-sm"
                        >
                          {pkg.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.slice(1).map((link) => (
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
            className="fixed inset-0 top-0 bg-white z-40 pt-24 px-6 md:hidden flex flex-col items-center justify-start h-screen overflow-y-auto pb-10"
          >
            <Link
              to="/"
              className={`text-2xl font-serif font-medium mb-8 ${
                location.pathname === '/' ? 'text-hibiscus-600' : 'text-stone-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Tours Dropdown */}
            <div className="w-full max-w-xs mb-8">
              <button
                onClick={() => setShowMobileToursMenu(!showMobileToursMenu)}
                className={`text-2xl font-serif font-medium flex items-center justify-center gap-2 w-full mb-3 ${
                  isToursPage ? 'text-hibiscus-600' : 'text-stone-600'
                }`}
              >
                All Tours
                <ChevronDown 
                  size={20} 
                  className={`transition-transform duration-200 ${showMobileToursMenu ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {showMobileToursMenu && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-stone-50 rounded-2xl overflow-hidden"
                  >
                    <Link
                      to="/tours"
                      className="block px-4 py-3 text-stone-700 hover:bg-hibiscus-50 hover:text-hibiscus-600 transition-colors font-medium text-sm border-b border-stone-100"
                      onClick={() => setIsOpen(false)}
                    >
                      View All Packages
                    </Link>
                    {PACKAGE_TYPES.map((pkg) => (
                      <Link
                        key={pkg.id}
                        to={`/tours#${pkg.id}`}
                        className="block px-4 py-3 text-stone-600 hover:bg-hibiscus-50 hover:text-hibiscus-600 transition-colors text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        {pkg.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/about"
              className={`text-2xl font-serif font-medium mb-8 ${
                location.pathname === '/about' ? 'text-hibiscus-600' : 'text-stone-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`text-2xl font-serif font-medium mb-8 ${
                location.pathname === '/contact' ? 'text-hibiscus-600' : 'text-stone-600'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

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
