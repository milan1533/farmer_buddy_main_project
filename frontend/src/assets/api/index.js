import api from './api';
import { authService } from './authService';
import { productService } from './productService';
import { orderService } from './api';  // Import from api.js where it's correct
import { scannerService } from './api';

export {
  api,
  authService,
  productService,
  orderService,
  scannerService
};