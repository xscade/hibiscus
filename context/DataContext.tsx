import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tour, Inquiry } from '../types';
import { TOURS as INITIAL_TOURS } from '../constants';

// API Base URL - uses relative URL in production (Vercel), localhost in development
const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

interface DataContextType {
  tours: Tour[];
  inquiries: Inquiry[];
  loading: boolean;
  toursLoading: boolean;
  addTour: (tour: Tour) => Promise<void>;
  updateTour: (id: string, tour: Partial<Tour>) => Promise<void>;
  deleteTour: (id: string) => Promise<void>;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  markInquiryRead: (id: string) => void;
  refreshInquiries: () => Promise<void>;
  refreshTours: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tours from MongoDB
  const [tours, setTours] = useState<Tour[]>([]);
  const [toursLoading, setToursLoading] = useState(true);

  // Inquiries from MongoDB
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tours from MongoDB
  const refreshTours = useCallback(async () => {
    try {
      setToursLoading(true);
      const response = await fetch(`${API_URL}/tours`);
      if (response.ok) {
        const data = await response.json();
        setTours(data);
      } else {
        // Fallback to constants if API fails
        console.warn('Failed to fetch tours from API, using fallback');
        setTours(INITIAL_TOURS);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      // Fallback to constants if API fails
      setTours(INITIAL_TOURS);
    } finally {
      setToursLoading(false);
    }
  }, []);

  // Fetch inquiries from MongoDB
  const refreshInquiries = useCallback(async () => {
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
  }, []);

  // Fetch data on mount
  useEffect(() => {
    refreshTours();
    refreshInquiries();
  }, [refreshTours, refreshInquiries]);

  // Add tour to MongoDB
  const addTour = async (tour: Tour) => {
    try {
      const response = await fetch(`${API_URL}/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tour),
      });
      
      if (response.ok) {
        const newTour = await response.json();
        setTours((prev) => [newTour, ...prev]);
      } else {
        throw new Error('Failed to add tour');
      }
    } catch (error) {
      console.error('Failed to add tour:', error);
      throw error;
    }
  };

  // Update tour in MongoDB
  const updateTour = async (id: string, updatedFields: Partial<Tour>) => {
    try {
      // Optimistic update
      setTours((prev) => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));

      const response = await fetch(`${API_URL}/tours/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });
      
      if (!response.ok) {
        // Revert on error
        refreshTours();
        throw new Error('Failed to update tour');
      }
    } catch (error) {
      console.error('Failed to update tour:', error);
      refreshTours();
      throw error;
    }
  };

  // Delete tour from MongoDB
  const deleteTour = async (id: string) => {
    try {
      // Optimistic update
      setTours((prev) => prev.filter(t => t.id !== id));

      const response = await fetch(`${API_URL}/tours/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // Revert on error
        refreshTours();
        throw new Error('Failed to delete tour');
      }
    } catch (error) {
      console.error('Failed to delete tour:', error);
      refreshTours();
      throw error;
    }
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
    <DataContext.Provider value={{ 
      tours, 
      inquiries, 
      loading, 
      toursLoading,
      addTour, 
      updateTour, 
      deleteTour, 
      addInquiry, 
      markInquiryRead, 
      refreshInquiries,
      refreshTours 
    }}>
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