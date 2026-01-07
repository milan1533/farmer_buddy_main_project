import express from "express";
import multer from "multer";
import path from "path";
import { addProduct, deleteProduct, getAllProducts, getMyProducts, updateProduct } from "../controller/Product.controller.js";
import isAuthenticated from "../middleware/isAutheticated.js";
import authorizeRoles from "../middleware/authorizeRole.js";

const productRoute = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "backend", "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Accept either a single 'productImage' or multiple 'images'
productRoute.post(
  "/add",
  isAuthenticated,
  authorizeRoles('admin', 'farmer'),
  upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  addProduct
);
productRoute.delete("/delete/:id", isAuthenticated, authorizeRoles('admin', 'farmer'), deleteProduct);
productRoute.put("/update/:id", isAuthenticated, authorizeRoles('admin', 'farmer'), updateProduct);
productRoute.get("/user", isAuthenticated, authorizeRoles('admin', 'farmer', 'consumer', 'restaurant'), getMyProducts);
productRoute.get("/all", getAllProducts);

export default productRoute;
