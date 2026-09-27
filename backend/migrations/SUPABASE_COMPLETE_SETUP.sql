-- ==============================================================================
-- FarmFresh-AI: COMPLETE SUPABASE DATABASE SETUP
-- ==============================================================================
-- Instructions:
--   1. Open https://app.supabase.com → Your project
--   2. Left sidebar → "SQL Editor"
--   3. Click "New Query"
--   4. Paste this ENTIRE file
--   5. Click "Run" (green button)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- TABLE 1: USERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'buyer',
  phone VARCHAR(20),
  location JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT role_check CHECK (role IN ('farmer', 'buyer', 'admin'))
);

-- ==============================================================================
-- TABLE 2: PRODUCTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'other',
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT 'kg',
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

-- ==============================================================================
-- TABLE 3: ORDERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  delivery_address JSONB NOT NULL DEFAULT '{}',
  delivery_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  CONSTRAINT total_amount_check CHECK (total_amount >= 0)
);

-- ==============================================================================
-- TABLE 4: COMMUNITY_POSTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}',
  stats JSONB DEFAULT '{"likesCount": 0, "commentsCount": 0, "sharesCount": 0}',
  is_solved BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  ai_summary TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- TABLE 5: COMMUNITY_COMMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS community_comments (
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

-- ==============================================================================
-- TABLE 6: COMMUNITY_LIKES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- ==============================================================================
-- TABLE 7: AI_SUGGESTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  analysis_result JSONB NOT NULL DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_products_farm_id ON products(farm_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_solved ON community_posts(is_solved);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author_id ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_id);

CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON community_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_at ON ai_suggestions(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Full access policies (backend uses service_role key which bypasses RLS)
-- Drop old policies first to avoid conflicts, then recreate
DO $$ BEGIN
  DROP POLICY IF EXISTS "allow_all_users" ON users;
  DROP POLICY IF EXISTS "allow_all_products" ON products;
  DROP POLICY IF EXISTS "allow_all_orders" ON orders;
  DROP POLICY IF EXISTS "allow_all_community_posts" ON community_posts;
  DROP POLICY IF EXISTS "allow_all_community_comments" ON community_comments;
  DROP POLICY IF EXISTS "allow_all_community_likes" ON community_likes;
  DROP POLICY IF EXISTS "allow_all_ai_suggestions" ON ai_suggestions;
END $$;

CREATE POLICY "allow_all_users" ON users FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_products" ON products FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_orders" ON orders FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_community_posts" ON community_posts FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_community_comments" ON community_comments FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_community_likes" ON community_likes FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_ai_suggestions" ON ai_suggestions FOR ALL TO public USING (true) WITH CHECK (true);

-- ==============================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_community_comments_updated_at ON community_comments;
CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- VERIFICATION: Show all created tables
-- ==============================================================================
SELECT 
  table_name AS "Table",
  (SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_name = t.table_name AND table_schema = 'public') AS "Columns"
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected output: 7 tables
-- users, products, orders, community_posts, community_comments, community_likes, ai_suggestions
-- ==============================================================================
-- SETUP COMPLETE! All tables, indexes, RLS, and triggers created successfully.
-- ==============================================================================
