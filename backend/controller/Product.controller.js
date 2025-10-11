// controllers/productController.js
import mongoose from 'mongoose';
import { Product } from "../models/product.model.js";
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
export const addProduct = async (req, res) => {
  const {
    name,
    description,
    price_per_unit,
    quantity,
    unit,
    category,
    image,
    location
  } = req.body;



  const farm = req.id;



  if (!name || !price_per_unit || !quantity || !unit || !category || !farm) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }
  let imageUrl = null;
  try {
    
    // console.log("ok")
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'farmer-products'
      });
      console.log("result", result)
      imageUrl = result.secure_url;

      // Remove temp file
      fs.unlinkSync(req.file.path);
    }

    const newProduct = new Product({
      name,
      description,
      price: price_per_unit, // Map to the correct field
      availableQuantity: quantity, // Map to the correct field
      unit,
      category: category || 'vegetables', // Default to vegetables if not provided
      images: imageUrl ? [imageUrl] : [],
      farm,
      location
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: savedProduct
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if product exists
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyProducts = async (req, res) => {
  const farmerId = req.id; // 

  try {
    const products = await Product.find({ farm: farmerId });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // If DB is not connected, return mock data to avoid 500 during development
    if (mongoose.connection.readyState !== 1) {
      console.warn("MongoDB not connected (readyState:", mongoose.connection.readyState, ") - returning mock products");
      const mock = [
        {
          _id: 'mock-1',
          name: 'Organic Tomatoes',
          description: 'Fresh and juicy',
          price_per_unit: 120,
          quantity: 10,
          unit: 'kg',
          type: 'vegetables',
          image: null,
          location: 'Unknown',
          organic: true,
          rating: { average: 4.5, count: 12 },
          createdAt: new Date().toISOString()
        }
      ];
      return res.status(200).json({ success: true, count: mock.length, data: mock });
    }

    const products = await Product.find().populate('farm', 'name location'); // Add farmer info

    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      price_per_unit: product.price, // Map back to frontend field
      quantity: product.availableQuantity, // Map back to frontend field
      unit: product.unit,
      type: product.category, // Map category to type for frontend
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      location: product.farm?.location?.city || 'Unknown',
      organic: product.organic,
      rating: product.rating,
      createdAt: product.createdAt
    }));

    res.status(200).json({
      success: true,
      count: transformedProducts.length,
      data: transformedProducts,
    });
  } catch (error) {
    console.error("Error fetching all products:", error?.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};