import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// Attach Authorization header from localStorage as a fallback to cookies
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && !(config.headers && (config.headers.Authorization || config.headers.authorization))) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  } catch (e) {
    // no-op
  }
  return config;
});

export const productService = {
  getAllProducts: () => api.get('/product/all').then(res => res.data),
  getUserProducts: () => api.get('/product/user').then(res => res.data),
  addProduct: (formData) => api.post('/product/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),
  deleteProduct: (id) => api.delete(`/product/delete/${id}`).then(res => res.data),
  updateProduct: (id, data) => api.put(`/product/update/${id}`, data).then(res => res.data),
};

export const orderService = {
  createOrder: (orderData) => api.post('/order', orderData).then(res => res.data),
  getMyOrders: () => api.get('/order/myorders').then(res => res.data).then(data => ({ data: data.orders })),
  getAllOrders: () => api.get('/order').then(res => res.data),
  getOrderById: (orderId) => api.get(`/order/${orderId}`).then(res => res.data),
  updateOrderStatus: (orderId, status) => api.put(`/order/${orderId}/status`, { status }).then(res => res.data),
};

export const scannerService = {
  analyzeCropDisease: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/api/analyze-crop-disease', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  
  getScanHistory: (limit = 20, offset = 0) => {
    return api.get('/api/scan-history', { params: { limit, offset } })
      .then(res => res.data);
  },
  
  getScanResult: (analysisId) => {
    return api.get(`/api/scan-history/${analysisId}`)
      .then(res => res.data);
  }
};

export default api;


