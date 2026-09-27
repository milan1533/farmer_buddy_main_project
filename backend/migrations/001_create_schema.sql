-- ==============================================================================
-- Supabase Migration: Database Schema Creation
-- ==============================================================================
-- This migration creates the complete PostgreSQL schema for FarmFresh-Ai
-- It includes all 7 main tables with:
-- - UUID primary keys
-- - CHECK constraints for enums
-- - UNIQUE constraints for required uniqueness
-- - NOT NULL constraints for required fields
-- - JSONB fields for complex/flexible data structures
-- ==============================================================================

-- ==============================================================================
-- 1. USERS TABLE
-- ==============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'buyer',
  phone VARCHAR(20),
  location JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT role_check CHECK (role IN ('farmer', 'buyer', 'admin')),
  CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==============================================================================
-- 2. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  available_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  images JSONB DEFAULT '[]',
  organic BOOLEAN DEFAULT FALSE,
  harvest_date TIMESTAMP WITH TIME ZONE,
  rating JSONB DEFAULT '{"average": 0, "count": 0}',
  tags TEXT[] DEFAULT '{}',
  is_subscription_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT category_check CHECK (category IN ('vegetables', 'fruits', 'dairy', 'meat', 'poultry', 'grains', 'herbs', 'other')),
  CONSTRAINT unit_check CHECK (unit IN ('kg', 'lb', 'piece', 'dozen', 'bunch', 'liter', 'gallon', 'box')),
  CONSTRAINT price_check CHECK (price >= 0),
  CONSTRAINT quantity_check CHECK (available_quantity >= 0)
);

CREATE INDEX idx_products_farm_id ON products(farm_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- ==============================================================================
-- 3. ORDERS TABLE
-- ==============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  delivery_address JSONB NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  CONSTRAINT total_amount_check CHECK (total_amount >= 0)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ==============================================================================
-- 4. COMMUNITY_POSTS TABLE
-- ==============================================================================
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  metadata JSONB NOT NULL,
  stats JSONB DEFAULT '{"likesCount": 0, "commentsCount": 0, "sharesCount": 0}',
  is_solved BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  ai_summary TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT content_has_crop CHECK (content ? 'crop'),
  CONSTRAINT content_has_problem_type CHECK (content ? 'problemType'),
  CONSTRAINT content_has_description CHECK (content ? 'description')
);

CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_is_solved ON community_posts(is_solved);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_tags ON community_posts USING GIN(tags);

-- ==============================================================================
-- 5. COMMUNITY_COMMENTS TABLE
-- ==============================================================================
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0),
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_community_comments_author_id ON community_comments(author_id);
CREATE INDEX idx_community_comments_parent_id ON community_comments(parent_id);
CREATE INDEX idx_community_comments_created_at ON community_comments(created_at DESC);

-- ==============================================================================
-- 6. COMMUNITY_LIKES TABLE
-- ==============================================================================
CREATE TABLE community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX idx_community_likes_user_id ON community_likes(user_id);

-- ==============================================================================
-- 7. AI_SUGGESTIONS TABLE
-- ==============================================================================
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  analysis_result JSONB NOT NULL,
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX idx_ai_suggestions_created_at ON ai_suggestions(created_at DESC);

-- ==============================================================================
-- Schema creation complete!
-- All tables, constraints, and indexes have been created.
-- ==============================================================================
