import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tour, Inquiry } from '../types';
import { TOURS as INITIAL_TOURS } from '../constants';

// API Base URL - uses relative URL in production (Vercel), localhost in development
const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

interface DataContextType {
  tours: Tour[];
  inquiries: Inquiry[];
  loading: boolean;
  addTour: (tour: Tour) => void;
  updateTour: (id: string, tour: Partial<Tour>) => void;
  deleteTour: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  markInquiryRead: (id: string) => void;
  refreshInquiries: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize tours from LocalStorage or constants
  const [tours, setTours] = useState<Tour[]>(() => {
    const saved = localStorage.getItem('hibiscus_tours');
    return saved ? JSON.parse(saved) : INITIAL_TOURS;
  });

  // Inquiries from MongoDB
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Save tours to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('hibiscus_tours', JSON.stringify(tours));
  }, [tours]);

  // Fetch inquiries from MongoDB on mount
  useEffect(() => {
    refreshInquiries();
  }, []);

  const refreshInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/inquiries`);
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTour = (tour: Tour) => {
    setTours((prev) => [tour, ...prev]);
  };

  const updateTour = (id: string, updatedFields: Partial<Tour>) => {
    setTours((prev) => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTour = (id: string) => {
    setTours((prev) => prev.filter(t => t.id !== id));
  };

  // Add inquiry to MongoDB
  const addInquiry = async (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    try {
      const response = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const newInquiry = await response.json();
        setInquiries((prev) => [newInquiry, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add inquiry:', error);
      throw error;
    }
  };

  // Mark inquiry as read in MongoDB
  const markInquiryRead = async (id: string) => {
    try {
      // Optimistic update
      setInquiries((prev) => prev.map(i => i.id === id ? { ...i, status: 'read' } : i));
      
      await fetch(`${API_URL}/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });
    } catch (error) {
      console.error('Failed to update inquiry:', error);
      // Revert on error
      refreshInquiries();
    }
  };

  return (
    <DataContext.Provider value={{ tours, inquiries, loading, addTour, updateTour, deleteTour, addInquiry, markInquiryRead, refreshInquiries }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};