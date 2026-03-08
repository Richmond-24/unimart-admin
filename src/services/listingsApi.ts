// src/services/listingsApi.ts
import axios from 'axios';

// In Create React App, environment variables must start with REACT_APP_
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Listing {
  _id: string;
  // Seller info
  businessName?: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  location: string;
  userType: 'student' | 'vendor';
  
  // Product info
  title: string;
  description: string;
  category: string;
  brand?: string;
  condition: string;
  conditionNotes?: string;
  price: number;
  discount?: number;
  edition?: string;
  
  // Delivery & payment
  deliveryType: 'self' | 'unimart';
  paymentMethod: 'mtn' | 'telecel';
  
  // Metadata
  tags: string[];
  imageUrls: string[];
  confidence?: number;
  status: 'active' | 'sold' | 'archived';
  adminNotes?: string;
  featured?: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export const listingApi = {
  // Get all listings with optional filters
  getListings: async (params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listings`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  // Get single listing
  getListing: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },

  // Update listing status
  updateStatus: async (id: string, status: string) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/listings/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  // Update listing
  updateListing: async (id: string, data: Partial<Listing>) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/listings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Delete listing
  deleteListing: async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listings/stats/overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};