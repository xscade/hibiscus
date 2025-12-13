import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Target, Heart, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-32 min-h-screen bg-cream pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-hibiscus-100 text-hibiscus-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Flower2 size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6"
          >
            We Are Hibiscus Holiday
          </motion.h1>
          <p className="text-xl text-stone-600 leading-relaxed font-light">
            Crafting journeys that celebrate the vibrant colors, rich heritage, and timeless spirit of India.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1621516709873-10776b7b0487?q=80&w=1200&auto=format&fit=crop" 
              alt="Indian Woman Traditional" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold-400/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-hibiscus-500/20 rounded-full blur-2xl -z-10"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Our Story</h2>
              <div className="w-20 h-1 bg-hibiscus-500 mb-6"></div>
              <p className="text-stone-600 text-lg leading-relaxed mb-4">
                Born from a love for India's endless diversity, Hibiscus Holiday began with a simple mission: to show the world the real India—beyond the guidebooks.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Like the Hibiscus flower that blooms with vibrancy in tropical climates, we believe every holiday should be a blossoming of new experiences. We are a team of explorers, historians, and luxury connoisseurs dedicated to making your Indian voyage unforgettable.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-stone-200/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-stone-900">The Hibiscus Promise</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard 
              icon={<Users size={32} />}
              title="Guest First"
              desc="In India, we say 'Atithi Devo Bhava'—the guest is God. Your comfort is our religion."
            />
            <ValueCard 
              icon={<Target size={32} />}
              title="Authenticity"
              desc="We steer clear of tourist traps, taking you to the heart of local culture and hidden gems."
            />
            <ValueCard 
              icon={<Heart size={32} />}
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
    <div className="w-20 h-20 bg-hibiscus-50 text-hibiscus-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-hibiscus-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-hibiscus-600/30 transform group-hover:-translate-y-2">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-stone-900 mb-3">{title}</h3>
    <p className="text-stone-600 leading-relaxed">{desc}</p>
  </div>
);

export default About;