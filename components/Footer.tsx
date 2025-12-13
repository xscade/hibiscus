import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Flower2, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-20 pb-10 rounded-t-3xl mt-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <Flower2 className="w-8 h-8 text-hibiscus-500" />
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-white leading-none">
                  Hibiscus
                </span>
                <span className="text-sm font-script tracking-widest text-hibiscus-500">
                  Holiday
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400">
              Curating soulful, luxury journeys across the mystical lands of India. Discover a new shade of life with every trip.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif text-lg font-semibold mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/" text="Home" />
              <FooterLink to="/about" text="Our Story" />
              <FooterLink to="/tours" text="All Journeys" />
              <FooterLink to="/contact" text="Contact Us" />
              <FooterLink to="/privacy" text="Privacy Policy" />
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h4 className="text-white font-serif text-lg font-semibold mb-6">Trending</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink to="/tours/golden-triangle" text="Golden Triangle" />
              <FooterLink to="/tours/kerala-backwaters" text="Kerala Bliss" />
              <FooterLink to="/tours/ladakh-adventure" text="Ladakh Expedition" />
              <FooterLink to="/tours/rajasthan-royal" text="Royal Rajasthan" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-serif text-lg font-semibold mb-6">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-hibiscus-600 transition-colors">
                  <MapPin size={16} className="text-stone-400 group-hover:text-white" />
                </div>
                <span>108, Hibiscus Lane, Connaught Place, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-hibiscus-600 transition-colors">
                  <Phone size={16} className="text-stone-400 group-hover:text-white" />
                </div>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-hibiscus-600 transition-colors">
                  <Mail size={16} className="text-stone-400 group-hover:text-white" />
                </div>
                <span>hello@hibiscusholiday.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="border-t border-stone-800 pt-10 mb-8">
          <div className="bg-gradient-to-r from-hibiscus-900/50 to-stone-800 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-serif text-xl mb-2">Subscribe to our newsletter</h3>
              <p className="text-stone-400 text-sm">Get the latest travel updates and exclusive offers.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-stone-900 border border-stone-700 rounded-lg px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-hibiscus-500 w-full md:w-64"
              />
              <button className="bg-hibiscus-600 hover:bg-hibiscus-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Hibiscus Holiday Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
            <Link to="/dashboard" className="hover:text-hibiscus-500 transition-colors">Admin</Link>
            <a href="#" className="hover:text-hibiscus-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-hibiscus-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-hibiscus-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-hibiscus-600 hover:text-white transition-all duration-300">
    {icon}
  </a>
);

const FooterLink = ({ to, text }: { to: string, text: string }) => (
  <li>
    <Link to={to} className="flex items-center gap-2 text-stone-400 hover:text-hibiscus-500 transition-colors group">
      <ArrowRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      {text}
    </Link>
  </li>
);

export default Footer;