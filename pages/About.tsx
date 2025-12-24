import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Target, Heart, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-cream pb-12 sm:pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-hibiscus-100 text-hibiscus-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <Flower2 size={24} className="sm:w-8 sm:h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4 sm:mb-6"
          >
            We Are Hibiscus Holiday
          </motion.h1>
          <p className="text-base sm:text-lg md:text-xl text-stone-600 leading-relaxed font-light px-2">
            Crafting journeys that celebrate the vibrant colors, rich heritage, and timeless spirit of India.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center mb-16 sm:mb-20 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop" 
              alt="Travel Adventure" 
              className="rounded-2xl sm:rounded-3xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-32 h-32 sm:w-48 sm:h-48 bg-gold-400/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-32 h-32 sm:w-48 sm:h-48 bg-hibiscus-500/20 rounded-full blur-2xl -z-10"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-3 sm:mb-4">Our Story</h2>
              <div className="w-16 sm:w-20 h-1 bg-hibiscus-500 mb-4 sm:mb-6"></div>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-4">
                Born from a love for India's endless diversity, Hibiscus Holiday began with a simple mission: to show the world the real India—beyond the guidebooks.
              </p>
              <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
                Like the Hibiscus flower that blooms with vibrancy in tropical climates, we believe every holiday should be a blossoming of new experiences. We are a team of explorers, historians, and luxury connoisseurs dedicated to making your Indian voyage unforgettable.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 shadow-xl shadow-stone-200/50">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">The Hibiscus Promise</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            <ValueCard 
              icon={<Users size={28} className="sm:w-8 sm:h-8" />}
              title="Guest First"
              desc="In India, we say 'Atithi Devo Bhava'—the guest is God. Your comfort is our religion."
            />
            <ValueCard 
              icon={<Target size={28} className="sm:w-8 sm:h-8" />}
              title="Authenticity"
              desc="We steer clear of tourist traps, taking you to the heart of local culture and hidden gems."
            />
            <ValueCard 
              icon={<Heart size={28} className="sm:w-8 sm:h-8" />}
              title="Sustainable Luxury"
              desc="We partner with eco-conscious hotels to ensure our footprint is as light as a flower petal."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="text-center group">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-hibiscus-50 text-hibiscus-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-hibiscus-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-hibiscus-600/30 transform group-hover:-translate-y-2">
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-2 sm:mb-3">{title}</h3>
    <p className="text-stone-600 leading-relaxed text-sm sm:text-base">{desc}</p>
  </div>
);

export default About;