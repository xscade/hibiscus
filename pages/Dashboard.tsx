import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  X, 
  Save, 
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Search,
  Lock,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Tour } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tours, inquiries, deleteTour, updateTour, addTour, markInquiryRead } = useData();
  const { isAuthenticated, login, logout, loading: authLoading } = useAuth();
  
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleClose = () => {
    navigate('/');
  };

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'overview' | 'tours' | 'inquiries'>('inquiries');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null);

  // New Tour Template
  const emptyTour: Tour = {
    id: '',
    title: '',
    location: '',
    days: 5,
    price: 0,
    image: '',
    description: '',
    category: 'Culture',
    featured: false,
    highlights: [],
    itinerary: []
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingTour({ ...emptyTour, id: `tour-${Date.now()}` });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingTour || !editingTour.id) return;
    
    // Check if it's an update or create
    const exists = tours.find(t => t.id === editingTour.id);
    if (exists) {
      updateTour(editingTour.id, editingTour);
    } else {
      addTour(editingTour as Tour);
    }
    setIsEditing(false);
    setEditingTour(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      deleteTour(id);
    }
  };

  // ------------------------------------------------------------------
  // Render Login Screen if not authenticated
  // ------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center relative overflow-hidden">
        {/* Back Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
        >
          <ArrowLeft size={18} /> Back to Website
        </button>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1920&auto=format&fit=crop" 
            alt="Login Background" 
            className="w-full h-full object-cover opacity-40 blur-sm"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md relative z-10 mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-hibiscus-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-hibiscus-600/30">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Access</h1>
            <p className="text-stone-300 text-sm">Please enter your credentials to view the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-stone-900/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-hibiscus-500 transition-all"
                autoFocus
                disabled={loginLoading}
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-stone-900/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-hibiscus-500 transition-all"
                disabled={loginLoading}
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs text-center font-bold">{error}</p>
            )}
            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full bg-hibiscus-600 hover:bg-hibiscus-700 disabled:bg-hibiscus-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-hibiscus-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loginLoading ? 'Logging in...' : <>Enter Dashboard <ArrowRight size={18} /></>}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-xs text-stone-500 uppercase tracking-widest">Hibiscus Holiday</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Render Dashboard
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-stone-200 fixed h-screen hidden md:flex flex-col z-40 top-0 left-0">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold text-hibiscus-600 mb-1">Admin Panel</h2>
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Hibiscus Holiday</p>
        </div>
        <nav className="px-4 py-4 space-y-1 flex-grow overflow-y-auto">
          <SidebarItem 
            active={activeTab === 'inquiries'} 
            onClick={() => setActiveTab('inquiries')}
            icon={<MessageSquare size={18} />} 
            label="Inquiries" 
            badge={inquiries.filter(i => i.status === 'new').length}
          />
          <SidebarItem 
            active={activeTab === 'tours'} 
            onClick={() => setActiveTab('tours')}
            icon={<Map size={18} />} 
            label="Manage Tours" 
          />
        </nav>
        <div className="p-4 border-t border-stone-100 space-y-2">
          <button 
            onClick={handleClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-stone-100 hover:text-stone-700 rounded-xl transition-colors font-medium text-sm"
          >
            <Home size={18} /> Back to Website
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6 md:p-10 pb-20">
        
        {/* Mobile Header & Tabs */}
        <div className="md:hidden mb-6">
          <div className="flex justify-between items-center mb-4">
             <h1 className="text-2xl font-serif font-bold text-stone-900">Dashboard</h1>
             <div className="flex gap-2">
               <button onClick={handleClose} className="p-2 bg-stone-200 rounded-full text-stone-600 hover:bg-stone-300 transition-colors">
                 <Home size={18} />
               </button>
               <button onClick={logout} className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors">
                 <LogOut size={18} />
               </button>
             </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'inquiries' ? 'bg-hibiscus-600 text-white' : 'bg-white text-stone-600'}`}
            >
              Inquiries
            </button>
            <button 
               onClick={() => setActiveTab('tours')}
               className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold ${activeTab === 'tours' ? 'bg-hibiscus-600 text-white' : 'bg-white text-stone-600'}`}
            >
              Manage Tours
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'inquiries' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="hidden md:block text-3xl font-serif font-bold text-stone-900 mb-6">Inquiries ({inquiries.length})</h1>
              
              {inquiries.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-stone-100">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                    <MessageSquare size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">No inquiries yet</h3>
                  <p className="text-stone-500">Form submissions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div 
                      key={inquiry.id} 
                      className={`bg-white p-6 rounded-2xl border transition-all ${
                        inquiry.status === 'new' 
                          ? 'border-hibiscus-200 shadow-md shadow-hibiscus-100/50' 
                          : 'border-stone-100 shadow-sm opacity-80'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                        <div className="flex items-start gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white ${inquiry.status === 'new' ? 'bg-hibiscus-500' : 'bg-stone-300'}`}>
                             {inquiry.name.charAt(0)}
                           </div>
                           <div>
                             <h3 className="font-bold text-stone-900 text-lg">{inquiry.name}</h3>
                             <p className="text-stone-500 text-sm">{inquiry.email}</p>
                             {inquiry.phone && (
                               <p className="text-stone-500 text-sm flex items-center gap-1 mt-1">
                                 <span className="text-hibiscus-500">📞</span> {inquiry.phone}
                               </p>
                             )}
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                            {new Date(inquiry.date).toLocaleDateString()}
                          </span>
                          {inquiry.status === 'new' && (
                            <button 
                              onClick={() => markInquiryRead(inquiry.id)}
                              className="text-xs bg-hibiscus-50 text-hibiscus-600 px-3 py-1 rounded-full font-bold hover:bg-hibiscus-100 transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                      {inquiry.tripLocation && (
                        <div className="mb-3 flex items-center gap-2">
                          <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Map size={12} /> Trip Location: {inquiry.tripLocation}
                          </span>
                        </div>
                      )}
                      <div className="bg-stone-50 p-4 rounded-xl text-stone-700 leading-relaxed border border-stone-100">
                        {inquiry.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'tours' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <div className="flex justify-between items-center mb-8">
                 <h1 className="hidden md:block text-3xl font-serif font-bold text-stone-900">Manage Tours</h1>
                 <button 
                   onClick={handleCreate}
                   className="bg-hibiscus-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-hibiscus-700 transition-colors shadow-lg shadow-hibiscus-600/30 ml-auto md:ml-0"
                 >
                   <Plus size={18} /> Add Tour
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {tours.map((tour) => (
                   <div key={tour.id} className="bg-white group rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl hover:border-hibiscus-100 transition-all duration-300">
                     <div className="relative h-48">
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(tour)}
                            className="p-2 bg-white rounded-full shadow-lg text-stone-600 hover:text-hibiscus-600 hover:scale-110 transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(tour.id)}
                            className="p-2 bg-white rounded-full shadow-lg text-stone-600 hover:text-red-600 hover:scale-110 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                          ₹{tour.price.toLocaleString()}
                        </div>
                     </div>
                     <div className="p-4">
                       <h3 className="font-bold text-stone-900 mb-1 line-clamp-1">{tour.title}</h3>
                       <p className="text-stone-500 text-xs mb-3 flex items-center gap-1">
                         <Map size={12} /> {tour.location}
                       </p>
                       <div className="flex gap-2">
                         <span className="px-2 py-1 bg-stone-100 text-stone-500 text-xs rounded-md font-medium">{tour.category}</span>
                         {tour.featured && (
                           <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-md font-bold">Featured</span>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </motion.div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isEditing && editingTour && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-stone-100 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {tours.find(t => t.id === editingTour.id) ? 'Edit Tour' : 'Create New Tour'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Tour Title">
                    <input 
                      type="text" 
                      value={editingTour.title} 
                      onChange={e => setEditingTour({...editingTour, title: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    />
                  </InputGroup>
                  <InputGroup label="Location">
                    <input 
                      type="text" 
                      value={editingTour.location} 
                      onChange={e => setEditingTour({...editingTour, location: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    />
                  </InputGroup>
                  <InputGroup label="Price (₹)">
                    <input 
                      type="number" 
                      value={editingTour.price} 
                      onChange={e => setEditingTour({...editingTour, price: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    />
                  </InputGroup>
                  <InputGroup label="Duration (Days)">
                    <input 
                      type="number" 
                      value={editingTour.days} 
                      onChange={e => setEditingTour({...editingTour, days: Number(e.target.value)})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    />
                  </InputGroup>
                  <InputGroup label="Category">
                    <select 
                       value={editingTour.category}
                       onChange={e => setEditingTour({...editingTour, category: e.target.value as any})}
                       className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    >
                      <option value="Culture">Culture</option>
                      <option value="Nature">Nature</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Spiritual">Spiritual</option>
                      <option value="Relaxation">Relaxation</option>
                    </select>
                  </InputGroup>
                  <InputGroup label="Image URL">
                    <input 
                      type="text" 
                      value={editingTour.image} 
                      onChange={e => setEditingTour({...editingTour, image: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                      placeholder="https://..."
                    />
                  </InputGroup>
                </div>

                <InputGroup label="Description">
                  <textarea 
                    value={editingTour.description} 
                    onChange={e => setEditingTour({...editingTour, description: e.target.value})}
                    rows={4}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500 resize-none"
                  />
                </InputGroup>

                <div className="flex items-center gap-3">
                   <input 
                     type="checkbox" 
                     id="featured"
                     checked={editingTour.featured}
                     onChange={e => setEditingTour({...editingTour, featured: e.target.checked})}
                     className="w-5 h-5 accent-hibiscus-600"
                   />
                   <label htmlFor="featured" className="font-bold text-stone-700">Mark as Featured Tour</label>
                </div>

                {/* Simplified view for Itinerary & Highlights for demo purposes */}
                <div className="bg-orange-50 p-4 rounded-xl text-orange-800 text-sm">
                  <p><strong>Note:</strong> Highlights and Itinerary editing is simplified for this demo. Advanced list editing can be added.</p>
                </div>

              </div>

              <div className="bg-stone-50 p-6 flex justify-end gap-4 rounded-b-3xl">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-hibiscus-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-hibiscus-700 transition-colors shadow-lg shadow-hibiscus-600/20"
                >
                  Save Tour
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label, badge }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${
      active ? 'bg-hibiscus-50 text-hibiscus-700 font-bold' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-hibiscus-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

const InputGroup = ({ label, children }: any) => (
  <div>
    <label className="block text-sm font-bold text-stone-700 mb-2">{label}</label>
    {children}
  </div>
);

export default Dashboard;