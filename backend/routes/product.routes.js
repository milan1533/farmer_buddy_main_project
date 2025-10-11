import express from "express";
import multer from "multer";
import path from "path";
import { addProduct, deleteProduct, getAllProducts, getMyProducts } from "../controller/Product.controller.js";
import isAuthenticated from "../middleware/isAutheticated.js";

const productRoute = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

productRoute.post("/add", isAuthenticated, upload.single('productImage'), addProduct);
productRoute.delete("/delete/:id", isAuthenticated, deleteProduct);
productRoute.get("/user", isAuthenticated, getMyProducts);
productRoute.get("/all", getAllProducts);

export default productRoute;
