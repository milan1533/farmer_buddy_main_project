// controller/Product.controller.js
// ✅ MongoDB/Mongoose removed → Supabase PostgreSQL
import supabase from '../config/supabase.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// Helper: upload image to Cloudinary or Supabase Storage
const uploadImage = async (file) => {
  if (!file) return null;
  const baseUrl = process.env.VITE_BASE_URL || 'http://localhost:5000';

  // Try Cloudinary first
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'farmer-products' });
      try { fs.unlinkSync(file.path); } catch {}
      return result.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed, using local fallback:', err?.message);
    }
  }

  // Supabase Storage fallback
  try {
    const fileBuffer = fs.readFileSync(file.path);
    const fileName = `products/${Date.now()}_${file.originalname}`;
    const { data, error } = await supabase.storage
      .from('farm-fresh-uploads')
      .upload(fileName, fileBuffer, { contentType: file.mimetype });
    
    try { fs.unlinkSync(file.path); } catch {}
    
    if (!error) {
      const { data: urlData } = supabase.storage.from('farm-fresh-uploads').getPublicUrl(fileName);
      return urlData.publicUrl;
    }
  } catch (err) {
    console.error('Supabase Storage upload failed:', err?.message);
  }

  // Local fallback
  return `${baseUrl}/uploads/${file.filename}`;
};

export const addProduct = async (req, res) => {
  const { name, description, price_per_unit, quantity, unit, category, location } = req.body;
  const farm_id = req.id || null;

  if (!name || !price_per_unit || !quantity || !unit || !category) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  let imageUrls = [];
  try {
    // Process uploaded files
    if (req.file) {
      const url = await uploadImage(req.file);
      if (url) imageUrls.push(url);
    }
    if (req.files && (req.files.productImage || req.files.images)) {
      const files = [...(req.files.productImage || []), ...(req.files.images || [])];
      for (const f of files) {
        const url = await uploadImage(f);
        if (url) imageUrls.push(url);
      }
    }

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: Number(price_per_unit),
        available_quantity: Number(quantity),
        unit,
        category: category || 'vegetables',
        images: imageUrls,
        farm_id: farm_id,
        organic: false
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: { ...newProduct, _id: newProduct.id }
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: product, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete from DB (CASCADE handles related data)
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyProducts = async (req, res) => {
  const farmerId = req.id;

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('farm_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map fields to match frontend expectations
    const mapped = products.map(p => ({
      ...p,
      _id: p.id,
      price_per_unit: p.price,          // frontend expects price_per_unit
      quantity: p.available_quantity,    // frontend expects quantity
      image: p.images && p.images.length > 0 ? p.images[0] : null,
      location: p.location || '',
    }));

    res.status(200).json({
      success: true,
      products: mapped
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_unit, quantity, unit, category, organic } = req.body;

  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price_per_unit !== undefined) updates.price = Number(price_per_unit);
    if (quantity !== undefined) updates.available_quantity = Number(quantity);
    if (unit !== undefined) updates.unit = unit;
    if (category !== undefined) updates.category = category;
    if (organic !== undefined) updates.organic = !!organic;

    const { data: updated, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({
      success: true,
      message: 'Product updated',
      product: { ...updated, _id: updated.id }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        users:farm_id (name, location)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const transformedProducts = products.map(product => ({
      _id: product.id,
      name: product.name,
      description: product.description,
      price_per_unit: product.price,
      quantity: product.available_quantity,
      unit: product.unit,
      type: product.category,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
      images: product.images || [],
      location: product.users?.location?.city || 'Unknown',
      organic: product.organic,
      rating: product.rating,
      createdAt: product.created_at,
      farm: product.users ? { name: product.users.name, location: product.users.location } : null
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