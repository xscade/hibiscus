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
  Home,
  Eye,
  EyeOff,
  Star,
  ListOrdered,
  Minus,
  Coffee
} from 'lucide-react';
import { Tour, PackageType } from '../types';
import { PACKAGE_TYPES } from '../constants';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tours, inquiries, deleteTour, updateTour, addTour, markInquiryRead, refreshTours } = useData();
  const { isAuthenticated, login, logout, loading: authLoading } = useAuth();
  
  // API Base URL - uses relative URL in production (Vercel), localhost in development
  const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
  
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleClose = () => {
    navigate('/');
  };

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'overview' | 'tours' | 'inquiries'>('inquiries');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null);
  const [saving, setSaving] = useState(false);

  // Highlight & Itinerary Input State
  const [newHighlight, setNewHighlight] = useState('');
  const [newItineraryDay, setNewItineraryDay] = useState({ title: '', description: '' });
  const [newInclusion, setNewInclusion] = useState('');
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    packageType: 'domestic',
    featured: false,
    showInPopup: false,
    highlights: [],
    itinerary: [],
    inclusions: []
  };

  // Handle Show in Popup toggle - ensures only one tour has this enabled
  const handleShowInPopupChange = async (tourId: string, checked: boolean) => {
    if (checked) {
      // First, disable showInPopup for all other tours
      for (const tour of tours) {
        if (tour.showInPopup && tour.id !== tourId) {
          await updateTour(tour.id, { ...tour, showInPopup: false });
        }
      }
    }
    // Then update the selected tour
    if (editingTour) {
      setEditingTour({ ...editingTour, showInPopup: checked });
    }
  };

  // Add highlight
  const handleAddHighlight = () => {
    if (!newHighlight.trim() || !editingTour) return;
    const currentHighlights = editingTour.highlights || [];
    setEditingTour({
      ...editingTour,
      highlights: [...currentHighlights, newHighlight.trim()]
    });
    setNewHighlight('');
  };

  // Remove highlight
  const handleRemoveHighlight = (index: number) => {
    if (!editingTour) return;
    const currentHighlights = editingTour.highlights || [];
    setEditingTour({
      ...editingTour,
      highlights: currentHighlights.filter((_, i) => i !== index)
    });
  };

  // Add itinerary day
  const handleAddItineraryDay = () => {
    if (!newItineraryDay.title.trim() || !editingTour) return;
    const currentItinerary = editingTour.itinerary || [];
    const newDay = {
      day: currentItinerary.length + 1,
      title: newItineraryDay.title.trim(),
      description: newItineraryDay.description.trim()
    };
    setEditingTour({
      ...editingTour,
      itinerary: [...currentItinerary, newDay]
    });
    setNewItineraryDay({ title: '', description: '' });
  };

  // Remove itinerary day
  const handleRemoveItineraryDay = (index: number) => {
    if (!editingTour) return;
    const currentItinerary = editingTour.itinerary || [];
    // Re-number days after removal
    const updatedItinerary = currentItinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setEditingTour({
      ...editingTour,
      itinerary: updatedItinerary
    });
  };

  // Add inclusion
  const handleAddInclusion = () => {
    if (!newInclusion.trim() || !editingTour) return;
    const currentInclusions = editingTour.inclusions || [];
    setEditingTour({
      ...editingTour,
      inclusions: [...currentInclusions, newInclusion.trim()]
    });
    setNewInclusion('');
  };

  // Remove inclusion
  const handleRemoveInclusion = (index: number) => {
    if (!editingTour) return;
    const currentInclusions = editingTour.inclusions || [];
    setEditingTour({
      ...editingTour,
      inclusions: currentInclusions.filter((_, i) => i !== index)
    });
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
    setImagePreview(tour.image || null);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingTour({ ...emptyTour, id: `tour-${Date.now()}` });
    setImagePreview(null);
    setIsEditing(true);
  };
  
  // Handle image file upload - Production ready
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB. Please choose a smaller image.');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server - Convert to base64 for production compatibility
    setUploadingImage(true);
    try {
      // Convert file to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64Image,
          filename: file.name,
          mimetype: file.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }
      
      if (data.imagePath) {
        // Update the tour image path
        if (editingTour) {
          setEditingTour({ ...editingTour, image: data.imagePath });
        }
        // Keep preview as base64 for immediate display during edit
        // When saved, the tour.image will have the API path (/api/images/{id})
        setImagePreview(base64Image);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error.message || 'Failed to upload image. Please try again.';
      alert(errorMessage);
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!editingTour || !editingTour.id) return;
    
    setSaving(true);
    try {
      // Check if it's an update or create
      const exists = tours.find(t => t.id === editingTour.id);
      if (exists) {
        await updateTour(editingTour.id, editingTour);
      } else {
        await addTour(editingTour as Tour);
      }
      // Refresh tours to ensure latest data including images
      await refreshTours();
      setIsEditing(false);
      setEditingTour(null);
      setImagePreview(null);
      setNewHighlight('');
      setNewItineraryDay({ title: '', description: '' });
      setNewInclusion('');
    } catch (error) {
      console.error('Failed to save tour:', error);
      alert('Failed to save tour. Please try again.');
    } finally {
      setSaving(false);
    }
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
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop" 
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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-stone-900/50 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-hibiscus-500 transition-all"
                disabled={loginLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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
                     <div className="relative h-48 bg-stone-200">
                        <img 
                          src={tour.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop'} 
                          alt={tour.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
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
                       <div className="flex gap-2 flex-wrap">
                         <span className="px-2 py-1 bg-stone-100 text-stone-500 text-xs rounded-md font-medium">{tour.category}</span>
                         <span className="px-2 py-1 bg-hibiscus-50 text-hibiscus-600 text-xs rounded-md font-medium">
                           {PACKAGE_TYPES.find(p => p.id === tour.packageType)?.name || tour.packageType}
                         </span>
                         {tour.featured && (
                           <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-md font-bold">Featured</span>
                         )}
                         {tour.showInPopup && (
                           <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-bold flex items-center gap-1">🔥 Popup</span>
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
                  <InputGroup label="Tour Type">
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
                  <InputGroup label="Package Category">
                    <select 
                       value={editingTour.packageType}
                       onChange={e => setEditingTour({...editingTour, packageType: e.target.value as PackageType})}
                       className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    >
                      {PACKAGE_TYPES.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.icon} {pkg.name}</option>
                      ))}
                    </select>
                  </InputGroup>
                  <InputGroup label="Tour Image">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                            id="image-upload"
                          />
                          <div className={`w-full bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl px-4 py-6 text-center transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'hover:border-hibiscus-500 hover:bg-hibiscus-50 cursor-pointer'}`}>
                            {uploadingImage ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hibiscus-600"></div>
                                <p className="text-sm text-stone-600 font-medium">Uploading...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <ImageIcon size={32} className="text-stone-400" />
                                <p className="text-sm font-medium text-stone-700">
                                  Click to upload image
                                </p>
                                <p className="text-xs text-stone-500">PNG, JPG, GIF, WEBP up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                      
                      {(imagePreview || editingTour.image) && (
                        <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                          <img 
                            src={imagePreview || editingTour.image || ''} 
                            alt="Preview" 
                            className="w-full h-64 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop';
                              target.classList.add('opacity-50');
                            }}
                          />
                          <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
                            <p className="text-xs text-stone-500">Image Preview</p>
                            {editingTour.image && (
                              <span className="text-xs text-stone-400 font-mono">{editingTour.image}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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

                <div className="flex flex-col md:flex-row gap-6">
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
                  <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-3 rounded-xl border border-orange-200">
                     <input 
                       type="checkbox" 
                       id="showInPopup"
                       checked={editingTour.showInPopup || false}
                       onChange={e => handleShowInPopupChange(editingTour.id || '', e.target.checked)}
                       className="w-5 h-5 accent-orange-500"
                     />
                     <label htmlFor="showInPopup" className="font-bold text-orange-700 flex items-center gap-2">
                       🔥 Show in Trending Popup
                       <span className="text-xs text-orange-500 font-normal">(Only one tour can be selected)</span>
                     </label>
                  </div>
                </div>

                {/* Highlights Section */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={18} className="text-hibiscus-600" />
                    <h3 className="font-bold text-stone-800">Highlights</h3>
                  </div>
                  
                  {/* Current Highlights */}
                  <div className="space-y-2 mb-4">
                    {(editingTour.highlights || []).length === 0 ? (
                      <p className="text-stone-400 text-sm italic">No highlights added yet</p>
                    ) : (
                      (editingTour.highlights || []).map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-stone-100">
                          <span className="flex-1 text-stone-700">{highlight}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add New Highlight */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                      placeholder="Enter a highlight..."
                      className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-4 py-2 bg-hibiscus-600 text-white rounded-lg text-sm font-bold hover:bg-hibiscus-700 transition-colors flex items-center gap-1"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>

                {/* Itinerary Section */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                  <div className="flex items-center gap-2 mb-4">
                    <ListOrdered size={18} className="text-hibiscus-600" />
                    <h3 className="font-bold text-stone-800">Itinerary (Day by Day)</h3>
                  </div>
                  
                  {/* Current Itinerary Days */}
                  <div className="space-y-3 mb-4">
                    {(editingTour.itinerary || []).length === 0 ? (
                      <p className="text-stone-400 text-sm italic">No itinerary days added yet</p>
                    ) : (
                      (editingTour.itinerary || []).map((day, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-stone-100">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-hibiscus-100 text-hibiscus-700 text-xs font-bold px-2 py-1 rounded">
                                  Day {day.day}
                                </span>
                                <h4 className="font-bold text-stone-800">{day.title}</h4>
                              </div>
                              <p className="text-stone-600 text-sm">{day.description}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItineraryDay(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add New Itinerary Day */}
                  <div className="bg-white p-4 rounded-lg border border-dashed border-stone-300">
                    <p className="text-xs text-stone-500 font-bold mb-2">ADD DAY {(editingTour.itinerary || []).length + 1}</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newItineraryDay.title}
                        onChange={(e) => setNewItineraryDay({...newItineraryDay, title: e.target.value})}
                        placeholder="Day title (e.g., Arrival in Delhi)"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                      />
                      <textarea
                        value={newItineraryDay.description}
                        onChange={(e) => setNewItineraryDay({...newItineraryDay, description: e.target.value})}
                        placeholder="Day description..."
                        rows={2}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hibiscus-500 resize-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddItineraryDay}
                        disabled={!newItineraryDay.title.trim()}
                        className="w-full px-4 py-2 bg-hibiscus-600 text-white rounded-lg text-sm font-bold hover:bg-hibiscus-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus size={16} /> Add Day to Itinerary
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inclusions Section */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Coffee size={18} className="text-hibiscus-600" />
                    <h3 className="font-bold text-stone-800">Package Inclusions</h3>
                  </div>
                  
                  {/* Current Inclusions */}
                  <div className="space-y-2 mb-4">
                    {(editingTour.inclusions || []).length === 0 ? (
                      <p className="text-stone-400 text-sm italic">No inclusions added yet</p>
                    ) : (
                      (editingTour.inclusions || []).map((inclusion, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white p-3 rounded-lg border border-stone-100">
                          <span className="flex-1 text-stone-700">{inclusion}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInclusion(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add New Inclusion */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclusion())}
                      placeholder="Enter inclusion (e.g., Hotels & Breakfast, Private AC Car, English Speaking Guide)"
                      className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hibiscus-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="px-4 py-2 bg-hibiscus-600 text-white rounded-lg text-sm font-bold hover:bg-hibiscus-700 transition-colors flex items-center gap-1"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>

              </div>

              <div className="bg-stone-50 p-6 flex justify-end gap-4 rounded-b-3xl">
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setImagePreview(null);
                    setNewHighlight('');
                    setNewItineraryDay({ title: '', description: '' });
                    setNewInclusion('');
                  }}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-hibiscus-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-hibiscus-700 disabled:bg-hibiscus-400 transition-colors shadow-lg shadow-hibiscus-600/20 flex items-center gap-2"
                >
                  {saving ? 'Saving...' : 'Save Tour'}
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