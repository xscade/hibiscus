import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Star, Phone, Shield, Coffee, Car, Languages } from 'lucide-react';
import { useData } from '../context/DataContext';

const TourDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tours } = useData();
  const tour = tours.find(t => t.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!tour) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-stone-600 bg-cream">
        <h2 className="text-3xl font-serif font-bold mb-4">Tour Not Found</h2>
        <Link to="/tours" className="px-6 py-3 bg-hibiscus-600 text-white rounded-full hover:bg-hibiscus-700 transition-colors">
          Back to All Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <img 
          src={tour.image} 
          alt={tour.title} 
          className="w-full h-full object-cover fixed top-0 left-0 -z-10" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/20" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 pb-24 md:pb-32">
          <div className="container mx-auto">
            <Link to="/tours" className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              <ArrowLeft size={16} className="mr-2" /> Back to Tours
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-hibiscus-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide uppercase shadow-lg">
                  {tour.category}
                </span>
                {tour.featured && (
                  <span className="bg-gold-500 text-stone-900 px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide uppercase shadow-lg">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-xl">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  <Calendar size={20} className="text-gold-400" />
                  <span className="font-medium text-sm md:text-base">{tour.days} Days / {tour.days - 1} Nights</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                  <MapPin size={20} className="text-gold-400" />
                  <span className="font-medium text-sm md:text-base">{tour.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-cream relative z-10 -mt-10 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Overview */}
              <section>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-hibiscus-600 rounded-full"></span>
                  The Experience
                </h2>
                <div className="text-stone-600 leading-relaxed text-lg bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                  {tour.description}
                </div>
              </section>

              {/* Highlights */}
              {tour.highlights && tour.highlights.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-hibiscus-600 rounded-full"></span>
                    Trip Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, idx) => (
                      <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.01 }}
                        className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:border-hibiscus-200 transition-colors"
                      >
                        <div className="bg-hibiscus-50 p-2 rounded-full text-hibiscus-600 shrink-0">
                          <Star size={20} className="fill-current" />
                        </div>
                        <span className="text-stone-800 font-medium text-lg">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-10 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-hibiscus-600 rounded-full"></span>
                    Detailed Itinerary
                  </h2>
                  <div className="space-y-0 relative border-l-2 border-stone-200 ml-4 md:ml-6">
                    {tour.itinerary.map((day, index) => (
                      <motion.div 
                        key={day.day || index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative pl-12 pb-12 last:pb-0 group"
                      >
                        <div className="absolute -left-[19px] md:-left-[21px] top-0 w-10 h-10 bg-white border-4 border-stone-200 text-stone-400 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:bg-hibiscus-600 group-hover:text-white group-hover:border-hibiscus-200 transition-all duration-300 z-10 text-sm">
                          Day {day.day}
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                          <h3 className="text-xl font-bold text-stone-900 mb-3">{day.title}</h3>
                          <p className="text-stone-600 leading-relaxed">{day.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Sidebar - Sticky */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-28 space-y-8">
                
                {/* Booking Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-100 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-hibiscus-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-8 pb-8 border-b border-stone-100">
                      <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Starting From</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-bold text-stone-900">₹{tour.price.toLocaleString('en-IN')}</span>
                        <span className="text-stone-500 font-medium">/ person</span>
                      </div>
                    </div>
                    
                    <div className="space-y-5 mb-8">
                      <div className="flex items-center gap-4 text-stone-700">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <Coffee size={18} />
                        </div>
                        <span className="font-medium">Hotels & Breakfast</span>
                      </div>
                      <div className="flex items-center gap-4 text-stone-700">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                           <Car size={18} />
                        </div>
                        <span className="font-medium">Private AC Car</span>
                      </div>
                      <div className="flex items-center gap-4 text-stone-700">
                         <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                           <Languages size={18} />
                         </div>
                        <span className="font-medium">English Speaking Guide</span>
                      </div>
                    </div>

                    <Link to="/contact" className="block w-full text-center bg-hibiscus-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-hibiscus-700 transition-colors shadow-lg shadow-hibiscus-600/20 mb-3">
                      Request Quote
                    </Link>
                    <p className="text-center text-xs text-stone-400 font-medium">100% Customizable • No Payment Now</p>
                  </div>
                </div>

                {/* Assurance Card */}
                <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-hibiscus-600">
                    <Shield size={24} />
                  </div>
                  <h4 className="font-bold text-stone-900 mb-2">Book with Confidence</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">24/7 On-trip Support • Best Price Guarantee • Flexible Cancellations</p>
                </div>
                
                {/* Contact Card */}
                <div className="bg-stone-900 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-hibiscus-600/20"></div>
                   <div className="relative z-10">
                    <h3 className="font-serif font-bold text-xl mb-2">Have Questions?</h3>
                    <p className="text-stone-400 text-sm mb-6">Our travel experts are here to customize your trip.</p>
                    <a href="tel:+919876543210" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full transition-colors border border-white/10 w-full">
                      <Phone size={18} /> +91 98765 43210
                    </a>
                   </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;