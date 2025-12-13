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
    <div className="pt-32 min-h-screen bg-cream pb-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-hibiscus-600 font-bold uppercase tracking-wider text-sm mb-2 block">We'd love to hear from you</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">Start Your Journey</h1>
          <p className="text-stone-600 max-w-xl mx-auto">Whether you have a question about our tours, pricing, or want to customize a trip, our team is ready to answer all your questions.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100">
          
          <div className="bg-stone-900 p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-hibiscus-600 rounded-full translate-x-1/3 -translate-y-1/3 blur-[100px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500 rounded-full -translate-x-1/3 translate-y-1/3 blur-[80px] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold mb-10">Contact Information</h2>
              <div className="space-y-10">
                <ContactInfoItem 
                  icon={<Phone size={24} />}
                  label="Talk to an Expert"
                  lines={['+91 98765 43210', '+91 11 2345 6789']}
                />
                <ContactInfoItem 
                  icon={<Mail size={24} />}
                  label="Email Us"
                  lines={['hello@hibiscusholiday.com', 'customercare@hibiscusholiday.com']}
                />
                <ContactInfoItem 
                  icon={<MapPin size={24} />}
                  label="Visit Us"
                  lines={['108, Hibiscus Lane, Connaught Place', 'New Delhi, India - 110001']}
                />
              </div>
            </div>

            <div className="mt-16 relative z-10 flex gap-4">
               {/* Social placeholders could go here */}
            </div>
          </div>

          <div className="p-12 lg:p-16 bg-white">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Planned Trip Location</label>
                  <input 
                    type="text" 
                    required
                    value={formData.tripLocation}
                    onChange={(e) => setFormData({...formData, tripLocation: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-hibiscus-500 focus:ring-2 focus:ring-hibiscus-100 outline-none transition-all resize-none"
                  placeholder="Tell us about your dream trip..."
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submitted}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
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
      </div>
    </div>
  );
};

const ContactInfoItem = ({ icon, label, lines }: { icon: React.ReactNode, label: string, lines: string[] }) => (
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-hibiscus-400 border border-white/5">
      {icon}
    </div>
    <div>
      <p className="text-stone-400 text-sm mb-1 uppercase tracking-wide font-medium">{label}</p>
      {lines.map((line, i) => (
        <p key={i} className="font-medium text-lg">{line}</p>
      ))}
    </div>
  </div>
);

export default Contact;