import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight, AtSign } from 'lucide-react';
import { PACKAGE_TYPES } from '../constants';

// Custom X (Twitter) Logo
const XLogo = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Footer component with updated contact info

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-hibiscus-50 to-white text-stone-700 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 rounded-t-2xl sm:rounded-t-3xl mt-8 sm:mt-10 border-t border-hibiscus-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-6">
            <Link to="/" className="flex items-center group">
              <img 
                src="https://storage.googleapis.com/clientmedia/hibiscusholiday/Untitled%20design%20(6).png" 
                alt="Hibiscus Holidays" 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-500">
            Domestic & International Tour Packages | Wild Life & Adventure |Hotel | Flight | Visa & Passport | Car Rental | Cruises
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <SocialIcon icon={<Facebook size={16} className="sm:w-[18px] sm:h-[18px]" />} href="https://www.facebook.com/hibiscusholidays" />
              <SocialIcon icon={<Instagram size={16} className="sm:w-[18px] sm:h-[18px]" />} href="https://www.instagram.com/hibiscusholidays" />
              <SocialIcon icon={<XLogo size={16} className="sm:w-[18px] sm:h-[18px]" />} href="https://x.com/HibiscusHoliday" />
              <SocialIcon icon={<AtSign size={16} className="sm:w-[18px] sm:h-[18px]" />} href="https://www.threads.com/@hibiscusholidays" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-stone-900 font-serif text-base sm:text-lg font-semibold mb-4 sm:mb-6">Explore</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/about" text="Our Story" />
              <FooterLink to="/tours" text="All Journeys" />
              <FooterLink to="/contact" text="Contact Us" />
              <FooterLink to="/privacy" text="Privacy Policy" />
              <FooterLink to="/terms" text="Terms & Conditions" />
            </ul>
          </div>

          {/* Package Categories */}
          <div>
            <h4 className="text-stone-900 font-serif text-base sm:text-lg font-semibold mb-4 sm:mb-6">Our Packages</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {PACKAGE_TYPES.map((pkg) => (
                <li key={pkg.id}>
                  <Link 
                    to={`/tours#${pkg.id}`} 
                    className="flex items-center gap-2 text-stone-500 hover:text-hibiscus-600 transition-colors group"
                  >
                    <ArrowRight size={10} className="sm:w-3 sm:h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {pkg.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-stone-900 font-serif text-base sm:text-lg font-semibold mb-4 sm:mb-6">Get in Touch</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-2 sm:gap-3 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-hibiscus-100 flex items-center justify-center shrink-0 group-hover:bg-hibiscus-600 transition-colors">
                  <MapPin size={14} className="sm:w-4 sm:h-4 text-hibiscus-600 group-hover:text-white" />
                </div>
                <span className="break-words">Plot No : 34, near Uday Nagar Road, Saraswati Nagar, Janki Nagar, Nagpur, Maharashtra 440034</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-hibiscus-100 flex items-center justify-center shrink-0 group-hover:bg-hibiscus-600 transition-colors">
                  <Phone size={14} className="sm:w-4 sm:h-4 text-hibiscus-600 group-hover:text-white" />
                </div>
                <span>+91 80555 15234</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-hibiscus-100 flex items-center justify-center shrink-0 group-hover:bg-hibiscus-600 transition-colors">
                  <Mail size={14} className="sm:w-4 sm:h-4 text-hibiscus-600 group-hover:text-white" />
                </div>
                <span className="break-all">sales.hibiscusholidays@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-hibiscus-100 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 gap-3 sm:gap-4">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Hibiscus Holiday Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6 items-center">
            <Link to="/terms" className="hover:text-hibiscus-600 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-hibiscus-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-hibiscus-100 flex items-center justify-center text-hibiscus-600 hover:bg-hibiscus-600 hover:text-white transition-all duration-300">
    {icon}
  </a>
);

const FooterLink = ({ to, text }: { to: string, text: string }) => (
  <li>
    <Link to={to} className="flex items-center gap-2 text-stone-500 hover:text-hibiscus-600 transition-colors group">
      <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      {text}
    </Link>
  </li>
);

export default Footer;