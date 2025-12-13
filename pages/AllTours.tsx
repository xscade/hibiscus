import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import TourCard from '../components/TourCard';

const AllTours: React.FC = () => {
  const { tours } = useData();

  return (
    <div className="pt-32 min-h-screen bg-cream pb-24">
      <div className="container mx-auto px-6">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block mb-4"
          >
            <span className="text-hibiscus-600 font-bold uppercase tracking-widest text-sm bg-hibiscus-50 px-4 py-2 rounded-full">
              Explore India
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-6"
          >
            Our Curated Journeys
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-600 text-lg leading-relaxed"
          >
            Whether you seek spiritual peace, adrenaline-pumping adventure, or royal luxury, we have a package designed just for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TourCard tour={tour} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTours;