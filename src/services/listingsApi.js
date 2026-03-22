
// /home/richmond/Downloads/unimart-admin/app/unimart-admin/src/services/listingsApi.js

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if using authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const listingApi = {
  // Get all listings with filters
  getListings: async (params = {}) => {
    try {
      const response = await api.get('/listings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  // Get single listing
  getListing: async (id) => {
    try {
      const response = await api.get(`/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },

  // ==================== IMAGE UPLOAD ====================
  
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await api.post('/upload/product/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload multiple images
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    try {
      const response = await api.post('/upload/product/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Delete image
  deleteImage: async (filename) => {
    try {
      const response = await api.delete(`/upload/image/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Delete multiple images
  deleteImages: async (filenames) => {
    try {
      const response = await api.post('/upload/images/delete', { filenames });
      return response.data;
    } catch (error) {
      console.error('Error deleting images:', error);
      throw error;
    }
  },

  // ==================== APPROVAL WITH SECTION DATA ====================
  
  // ✅ APPROVE listing with category and section data
  approveListing: async (id, data) => {
    try {
      const response = await api.patch(`/listings/${id}/approve`, data);
      return response.data;
    } catch (error) {
      console.error('Error approving listing:', error);
      throw error;
    }
  },

  // ❌ REJECT listing
  rejectListing: async (id, reason) => {
    try {
      const response = await api.patch(`/listings/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting listing:', error);
      throw error;
    }
  },

  // Update listing
  updateListing: async (id, data) => {
    try {
      const response = await api.patch(`/listings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Update listing status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/listings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  // Delete listing
  deleteListing: async (id) => {
    try {
      const response = await api.delete(`/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  // Get dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/listings/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create listing (for new submissions)
  createListing: async (data) => {
    try {
      // If data is FormData (includes files), use multipart/form-data
      if (data instanceof FormData) {
        const response = await api.post('/listings', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Otherwise send as JSON
        const response = await api.post('/listings', data);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Get pending listings count
  getPendingCount: async () => {
    try {
      const response = await api.get('/listings?status=pending&limit=1');
      return response.data.pagination?.total || 0;
    } catch (error) {
      console.error('Error fetching pending count:', error);
      return 0;
    }
  },

  // Get active listings count
  getActiveCount: async () => {
    try {
      const response = await api.get('/listings?status=active&limit=1');
      return response.data.pagination?.total || 0;
    } catch (error) {
      console.error('Error fetching active count:', error);
      return 0;
    }
  }
};