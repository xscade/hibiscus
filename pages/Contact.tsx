import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { useData } from '../context/DataContext';

const Contact: React.FC = () => {
  const { addInquiry } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', tripLocation: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send to Context
    addInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      tripLocation: formData.tripLocation,
      message: formData.message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', tripLocation: '', message: '' });
    }, 3000);
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 min-h-screen bg-cream pb-12 sm:pb-16 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-hibiscus-600 font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 block">We'd love to hear from you</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-3 sm:mb-4">Start Your Journey</h1>
          <p className="text-stone-600 max-w-xl mx-auto text-sm sm:text-base">Whether you have a question about our tours, pricing, or want to customize a trip, our team is ready to answer all your questions.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
          
          <div className="bg-stone-900 p-8 sm:p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-hibiscus-600 rounded-full translate-x-1/3 -translate-y-1/3 blur-[100px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gold-500 rounded-full -translate-x-1/3 translate-y-1/3 blur-[80px] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-8 sm:mb-10">Contact Information</h2>
              <div className="space-y-8 sm:space-y-10">
                <ContactInfoItem 
                  icon={<Phone size={20} className="sm:w-6 sm:h-6" />}
                  label="Talk to an Expert"
                  lines={['personal : +91 93706 32922', 'company : +91 80555 15234']}
                />
                <ContactInfoItem 
                  icon={<Mail size={20} className="sm:w-6 sm:h-6" />}
                  label="Email Us"
                  lines={['company : sales.hibiscusholidays@gmail.com']}
                />
                <ContactInfoItem 
                  icon={<MapPin size={20} className="sm:w-6 sm:h-6" />}
                  label="Visit Us"
                  lines={['Plot No : 34, near Uday Nagar Road, Saraswati Nagar, Janki Nagar, Nagpur, Maharashtra 440034']}
                />
              </div>
            </div>

            <div className="mt-12 sm:mt-16 relative z-10 flex gap-4">
               {/* Social placeholders could go here */}
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-16 bg-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-6 sm:mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all text-sm sm:text-base"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all text-sm sm:text-base"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all text-sm sm:text-base"
                    placeholder="+91 80555 15234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Planned Trip Location</label>
                  <input 
                    type="text" 
                    required
                    value={formData.tripLocation}
                    onChange={(e) => setFormData({...formData, tripLocation: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all text-sm sm:text-base"
                    placeholder="e.g. Rajasthan, Kerala, Himalayas"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all resize-none text-sm sm:text-base"
                  placeholder="Tell us about your dream trip..."
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submitted}
                className={`w-full font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
                  submitted 
                    ? 'bg-green-600 text-white shadow-green-600/30' 
                    : 'bg-hibiscus-600 text-white hover:bg-hibiscus-700 hover:shadow-hibiscus-600/30'
                }`}
              >
                {submitted ? (
                  <>Message Sent <Check size={18} /></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Google Maps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 max-w-6xl mx-auto"
        >
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-hibiscus-600 font-bold uppercase tracking-wider text-xs sm:text-sm mb-2 block">Find Us</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Our Location</h2>
          </div>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-stone-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3722.2459995158656!2d79.11162567138672!3d21.10275650024414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4bf54130ceea1%3A0x7f842ae38029d854!2sHibiscus%20Holidays!5e0!3m2!1sen!2sin!4v1766215830350!5m2!1sen!2sin" 
              width="100%" 
              height="400"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="Hibiscus Holidays Location"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ContactInfoItem = ({ icon, label, lines }: { icon: React.ReactNode, label: string, lines: string[] }) => (
  <div className="flex items-start gap-4 sm:gap-5">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-hibiscus-400 border border-white/5">
      {icon}
    </div>
    <div>
      <p className="text-stone-400 text-xs sm:text-sm mb-1 uppercase tracking-wide font-medium">{label}</p>
      {lines.map((line, i) => (
        <p key={i} className="font-medium text-sm sm:text-base md:text-lg break-words">{line}</p>
      ))}
    </div>
  </div>
);

export default Contact;