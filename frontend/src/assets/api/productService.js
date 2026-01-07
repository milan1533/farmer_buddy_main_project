import api from './api';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/product/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get user products
  getUserProducts: async () => {
    try {
      const response = await api.get('/product/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user products' };
    }
  },

  // Add a new product
  addProduct: async (productData) => {
    try {
      const response = await api.post('/product/add', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add product' };
    }
  },

  // Delete a product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/product/delete/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // Update a product
  updateProduct: async (productId, updates) => {
    try {
      const response = await api.put(`/product/update/${productId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },
};