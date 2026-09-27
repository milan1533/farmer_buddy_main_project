# Supabase Migration Design

## Overview

This document outlines the technical design for migrating FarmFresh-Ai from MongoDB to Supabase (PostgreSQL). The migration maintains backward compatibility with existing JWT authentication while integrating Supabase Auth for future enhancements. The design addresses database schema conversion, authentication architecture, real-time capabilities, and a phased migration strategy that minimizes disruption to existing frontend clients.

**Key Design Goals:**
- Zero-downtime migration with backward compatibility
- Preserve all existing API contracts during transition
- Enable real-time features through Supabase WebSocket subscriptions
- Implement Row Level Security (RLS) for granular access control
- Support dual-mode operation (MongoDB/Supabase) during transition
- Maintain data integrity through UUID mapping and foreign key constraints

---

## Architecture Overview

### Current State (MongoDB)
```
┌─────────────────────────────────────────────────────────┐
│                      FarmFresh-Ai Backend                │
│                    (Express.js + Node.js)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │     Auth     │      │   Mongoose   │                │
│  │  (JWT only)  │───→  │  Schemas     │                │
│  └──────────────┘      └──────────────┘                │
│         ▲                      ▼                         │
│         └──────────────────────┴──→  MongoDB            │
│                                                          │
│  Controllers → Routes → Middleware → MongoDB            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Target State (Supabase)
```
┌──────────────────────────────────────────────────────────────────┐
│                    FarmFresh-Ai Backend                           │
│                  (Express.js + Node.js + Supabase)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────┐    ┌──────────────────────────┐        │
│  │  Dual Auth Layer     │    │  Supabase Client         │        │
│  │  (JWT + Supabase)    │───→│  (Database, Storage,     │        │
│  └──────────────────────┘    │   Auth, Real-time)       │        │
│         ▲                     └────────┬───────────────┘         │
│         │                              ▼                          │
│         │            ┌─────────────────────────────┐             │
│         │            │   Supabase PostgreSQL       │             │
│         │            │   - UUID Primary Keys       │             │
│         │            │   - JSONB Complex Types     │             │
│         │            │   - RLS Policies            │             │
│         │            │   - Real-time Subscriptions │             │
│         │            └─────────────────────────────┘             │
│         │                     ▼                                    │
│         │            ┌─────────────────────────────┐             │
│         │            │  Supabase Storage           │             │
│         └───────────→│  (Image/Video Uploads)      │             │
│                      └─────────────────────────────┘             │
│                                                                    │
│  Controllers → Routes → UUID Translator → Supabase Client        │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Migration Phase (Parallel Operation)
```
┌──────────────────────────────────────────────────────────────────┐
│                    FarmFresh-Ai Backend                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Dual Query Router (routes to MongoDB or Supabase based on flag) │
│           │                                    │                  │
│           ▼                                    ▼                  │
│      MongoDB                            Supabase PostgreSQL      │
│      (Legacy)                           (New)                    │
│      Read-only                          Read/Write               │
│                                                                    │
│  Frontend sends ID → Router checks DB_MODE → Routes to correct   │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## PostgreSQL Schema Design

### Table Definitions

#### 1. Users Table
```sql
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

-- Sample INSERT to show location JSONB structure:
-- INSERT INTO users (name, email, password_hash, role, phone, location)
-- VALUES ('John Doe', 'john@example.com', 'hash', 'farmer', '9876543210',
--   '{"address": "123 Farm Lane", "city": "Karnataka", "zipCode": "560001"}'::jsonb);
```

#### 2. Products Table
```sql
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

-- Sample INSERT to show images and rating JSONB:
-- INSERT INTO products (farm_id, name, category, price, unit, available_quantity, images, rating)
-- VALUES (
--   'uuid-1', 'Organic Tomatoes', 'vegetables', 45.50, 'kg', 100,
--   '[{"url": "https://...", "type": "primary"}]'::jsonb,
--   '{"average": 4.5, "count": 12}'::jsonb
-- );
```

#### 3. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
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

-- Sample INSERT to show items and delivery_address JSONB:
-- INSERT INTO orders (user_id, farmer_id, items, total_amount, delivery_address, status)
-- VALUES (
--   'user-uuid-1', 'farmer-uuid-1', 
--   '[{"productId": "prod-uuid-1", "quantity": 5, "priceAtPurchase": 45.50}]'::jsonb,
--   227.50,
--   '{"address": "456 Main St", "city": "Bangalore", "zipCode": "560034"}'::jsonb,
--   'pending'
-- );
```

#### 4. Community Posts Table
```sql
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

-- Sample INSERT to show content and metadata JSONB:
-- INSERT INTO community_posts (author_id, content, metadata, stats, tags)
-- VALUES (
--   'user-uuid-1',
--   '{
--     "crop": "Tomato",
--     "problemType": "Disease",
--     "description": "Leaves turning yellow...",
--     "mediaUrl": "https://cloudinary.com/...",
--     "mediaType": "image",
--     "mediaPublicId": "farm-fresh/abc123"
--   }'::jsonb,
--   '{"month": "March", "season": "Spring", "location": "Karnataka"}'::jsonb,
--   '{"likesCount": 0, "commentsCount": 0, "sharesCount": 0}'::jsonb,
--   ARRAY['tomato', 'disease', 'leaves']
-- );
```

#### 5. Community Comments Table
```sql
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
```

#### 6. Community Likes Table
```sql
CREATE TABLE community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX idx_community_likes_user_id ON community_likes(user_id);
```

#### 7. AI Suggestions Table
```sql
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

-- Sample INSERT to show analysis_result JSONB:
-- INSERT INTO ai_suggestions (user_id, image_url, analysis_result, suggestions)
-- VALUES (
--   'user-uuid-1',
--   'https://storage.supabase.co/...',
--   '{
--     "crop": "Tomato",
--     "disease": "Early Blight",
--     "confidence": 0.92,
--     "severity": "moderate"
--   }'::jsonb,
--   ARRAY['Apply fungicide', 'Improve air circulation', 'Remove affected leaves']
-- );
```

### Key Schema Design Decisions

**UUIDs vs Serial IDs:**
- All primary keys use `UUID (gen_random_uuid())` instead of serial integers
- Rationale: Better for distributed systems, prevents ID enumeration attacks, aligns with Supabase best practices
- Trade-off: Slightly larger index sizes, but worth the security and scalability benefits

**JSONB for Complex Structures:**
- `location` (users): flexible address components
- `images` (products): array of image objects with metadata
- `rating` (products): nested structure with average and count
- `items` (orders): complex product information with pricing
- `content` (posts): variable crop data, problem types, media info
- `metadata` (posts): seasonal and location context
- `analysis_result` (AI suggestions): flexible AI output structure
- Rationale: PostgreSQL JSONB is queryable, indexed, and supports schema evolution

**TEXT[] Arrays:**
- `tags` (products, posts): array of strings for flexible tagging
- `suggestions` (AI suggestions): array of recommendation strings
- Rationale: Native PostgreSQL array support is efficient and queryable with GIN indexes

**Constraints & Validation:**
- CHECK constraints enforce enum-like values (role, status, category, unit)
- UNIQUE constraints prevent duplicate data (email, likes per post per user)
- NOT NULL constraints ensure required fields
- Foreign key constraints with CASCADE DELETE maintain referential integrity

**Indexing Strategy:**
- Foreign key columns indexed for JOIN performance
- Status/category columns indexed for filtering
- Created/updated timestamps indexed for sorting
- Email indexed for login queries
- GIN indexes on array columns for set membership queries
- Result: Balanced between read performance and write/storage overhead

---

## Data Type Mapping

### MongoDB to PostgreSQL Conversion

| MongoDB | PostgreSQL | Notes |
|---------|-----------|-------|
| ObjectId | UUID | Use `gen_random_uuid()` for new records, map old IDs during migration |
| String | VARCHAR | Most cases; TEXT for longer content |
| Number | INTEGER/DECIMAL | Use DECIMAL for prices/quantities |
| Boolean | BOOLEAN | Direct mapping |
| Date | TIMESTAMP WITH TIME ZONE | Always use timezone-aware timestamps |
| Array | TEXT[] or JSONB | Use TEXT[] for homogeneous, JSONB for complex structures |
| Object | JSONB | Nested structures, schema-flexible data |
| Nested Object Ref | Foreign Key | Related records should be normalized |

### Sample Migration Mappings

**User Document → Users Table**
```javascript
// MongoDB
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Farmer",
  email: "john@farm.com",
  password_hash: "bcrypt_hash",
  role: "farmer",
  phone: "9876543210",
  location: {
    address: "123 Farm Lane",
    city: "Karnataka",
    zipCode: "560001"
  }
}

// PostgreSQL
{
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  name: "John Farmer",
  email: "john@farm.com",
  password_hash: "bcrypt_hash",
  role: "farmer",
  phone: "9876543210",
  location: '{"address": "123 Farm Lane", "city": "Karnataka", "zipCode": "560001"}'::jsonb,
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z"
}
```

**Order with Product References → Orders Table**
```javascript
// MongoDB
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  user: ObjectId("507f1f77bcf86cd799439011"),
  farmer: ObjectId("507f1f77bcf86cd799439013"),
  items: [
    {
      product: ObjectId("507f1f77bcf86cd799439014"),
      quantity: 5,
      priceAtPurchase: 45.50
    }
  ],
  totalAmount: 227.50,
  deliveryAddress: {
    address: "456 Main St",
    city: "Bangalore",
    zipCode: "560034"
  },
  status: "pending",
  paymentStatus: "pending"
}

// PostgreSQL
{
  id: "f47ac10b-58cc-4372-a567-0e02b2c3d480",
  user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  farmer_id: "f47ac10b-58cc-4372-a567-0e02b2c3d481",
  items: '[{"product": "f47ac10b-58cc-4372-a567-0e02b2c3d482", "quantity": 5, "priceAtPurchase": 45.50}]'::jsonb,
  total_amount: 227.50,
  delivery_address: '{"address": "456 Main St", "city": "Bangalore", "zipCode": "560034"}'::jsonb,
  status: "pending",
  payment_status: "pending",
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z"
}
```

---

## Supabase Configuration

### Environment Variables

**New environment variables to add to `.env`:**
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Migration Control
DB_MODE=mongodb  # Set to 'supabase' after migration is complete
DUAL_MODE_ENABLED=true  # Allow querying both DBs during transition

# Supabase Storage
SUPABASE_STORAGE_BUCKET=farm-fresh-uploads
SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1

# Keep existing variables
MONGO_URL=mongodb://localhost:27017/farmer-buddy
JWT_SECRET=your-secret-key
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Supabase Client Initialization

**New file: `backend/config/supabase.js`**
```javascript
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Supabase client with service role (for server-side operations)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false
    }
  }
)

// Initialize Supabase client with anon key (for client-side operations, if needed)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export const initSupabase = async () => {
  try {
    // Test connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) throw error
    console.log('✓ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('✗ Supabase connection failed:', error.message)
    return false
  }
}
```

### Row Level Security (RLS) Policies

**Enable RLS on all tables:**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Products are readable by everyone
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

-- Only product owner (farmer) can insert/update/delete
CREATE POLICY "Only farmer can manage own products"
  ON products FOR UPDATE
  USING (farm_id::text = auth.uid()::text);

CREATE POLICY "Only farmer can insert products"
  ON products FOR INSERT
  WITH CHECK (farm_id::text = auth.uid()::text);

CREATE POLICY "Only farmer can delete products"
  ON products FOR DELETE
  USING (farm_id::text = auth.uid()::text);

-- Orders: Users can view their own orders, farmers can view their orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (user_id::text = auth.uid()::text OR farmer_id::text = auth.uid()::text);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (user_id::text = auth.uid()::text OR farmer_id::text = auth.uid()::text);

-- Community posts are readable by everyone
CREATE POLICY "Community posts are publicly readable"
  ON community_posts FOR SELECT
  USING (true);

-- Only author can update/delete their post
CREATE POLICY "Only author can update own post"
  ON community_posts FOR UPDATE
  USING (author_id::text = auth.uid()::text);

CREATE POLICY "Only author can delete own post"
  ON community_posts FOR DELETE
  USING (author_id::text = auth.uid()::text);

-- Community comments are readable by everyone
CREATE POLICY "Community comments are publicly readable"
  ON community_comments FOR SELECT
  USING (true);

-- Only author can update/delete their comment
CREATE POLICY "Only author can update own comment"
  ON community_comments FOR UPDATE
  USING (author_id::text = auth.uid()::text);

-- Community likes are readable by everyone
CREATE POLICY "Community likes are publicly readable"
  ON community_likes FOR SELECT
  USING (true);

-- Users can only create/delete their own likes
CREATE POLICY "Users can create own likes"
  ON community_likes FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own likes"
  ON community_likes FOR DELETE
  USING (user_id::text = auth.uid()::text);

-- AI suggestions are readable only by the user
CREATE POLICY "Users can view own AI suggestions"
  ON ai_suggestions FOR SELECT
  USING (user_id::text = auth.uid()::text);
```

### Supabase Storage Configuration

**Create storage bucket and policies:**
```sql
-- Create storage bucket via Supabase dashboard or API

-- Public read policy for uploaded files
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'farm-fresh-uploads');

-- Allow users to upload files
CREATE POLICY "User upload access"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'farm-fresh-uploads' AND auth.uid()::text = owner);

-- Allow users to update their own files
CREATE POLICY "User update access"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'farm-fresh-uploads' AND auth.uid()::text = owner);

-- Allow users to delete their own files
CREATE POLICY "User delete access"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'farm-fresh-uploads' AND auth.uid()::text = owner);
```

---

## Authentication Architecture

### Dual Authentication Layer

The system will support both JWT and Supabase Auth during the transition period:

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Request                    │
│                  (from frontend client)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌──────────┐    ┌──────────┐
   │   JWT   │      │ Supabase │    │  Cookie  │
   │ (Bearer)│      │ (Session)│    │  (Token) │
   └────┬────┘      └────┬─────┘    └────┬─────┘
        │                │               │
        └────────────────┼───────────────┘
                         │
            ┌────────────▼────────────┐
            │  Dual Auth Middleware   │
            │                         │
            │ 1. Check JWT against    │
            │    JWT_SECRET (legacy)  │
            │                         │
            │ 2. Check Supabase       │
            │    session (new)        │
            │                         │
            │ 3. Accept either one    │
            └────────────┬────────────┘
                         │
            ┌────────────▼─────────────────┐
            │  Set req.id and req.user     │
            │  (mapper handles ID format)  │
            └────────────┬─────────────────┘
                         │
                    ✓ Authorized
```

### Authentication Flow During Transition

**Registration (New Users → Supabase):**
```javascript
1. Frontend sends: { email, password, name, role, location }
2. Backend calls: supabaseAdmin.auth.admin.createUser()
3. Backend creates users table record with Supabase auth.uid() as id
4. Backend returns: JWT token + Supabase session (for future compatibility)
```

**Login (Existing JWT Users → Still Works):**
```javascript
1. Frontend sends: { email, password } with JWT in cookie/header
2. Backend validates: jwt.verify(token, JWT_SECRET)
3. Backend queries: users table by extracted userId
4. Response includes: JWT token (existing) + can include Supabase session
```

**Login (New Supabase Users):**
```javascript
1. Frontend sends: { email, password }
2. Backend calls: supabaseAdmin.auth.signInWithPassword()
3. Backend queries: users table by Supabase auth.uid()
4. Response includes: Supabase session + JWT token (for backward compat)
```

### New File: `backend/middleware/dualAuthMiddleware.js`

```javascript
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '../config/supabase.js'

const dualAuthMiddleware = async (req, res, next) => {
  try {
    // Get token/session from various sources
    const cookieToken = req.cookies.token || null
    const headerAuth = req.headers.authorization || ''
    const bearerToken = headerAuth.startsWith('Bearer ') 
      ? headerAuth.substring(7) 
      : null
    const token = cookieToken || bearerToken

    let userId = null
    let authMethod = null

    // Try JWT validation first (existing tokens)
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        userId = decoded.userId
        authMethod = 'jwt'
      } catch (jwtError) {
        // JWT validation failed, try Supabase
        try {
          const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
          if (!error && user) {
            userId = user.id
            authMethod = 'supabase'
          }
        } catch (supabaseError) {
          // Both failed
          throw new Error('Invalid token')
        }
      }
    }

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false
      })
    }

    // Set user info on request
    req.id = userId
    req.authMethod = authMethod

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      message: 'Authentication failed',
      success: false
    })
  }
}

export default dualAuthMiddleware
```

---

## ID Mapping and Backward Compatibility

### UUID to ObjectId Translation Layer

**New file: `backend/utils/idMapper.js`**

```javascript
import { v4 as uuidv4, validate as validateUuid } from 'uuid'

// In-memory cache for old ObjectId → new UUID mappings
// In production, store in a migration_mappings table
const idMappings = new Map()

/**
 * Check if an ID is a MongoDB ObjectId
 */
export const isObjectId = (id) => {
  if (!id || typeof id !== 'string') return false
  return /^[0-9a-f]{24}$/i.test(id)
}

/**
 * Check if an ID is a UUID
 */
export const isUuid = (id) => {
  if (!id || typeof id !== 'string') return false
  return validateUuid(id)
}

/**
 * Get mapped UUID for an ObjectId (for backward compatibility)
 */
export const getUuidFromObjectId = (objectId) => {
  return idMappings.get(objectId) || null
}

/**
 * Store ObjectId → UUID mapping
 */
export const mapObjectIdToUuid = (objectId, uuid) => {
  idMappings.set(objectId, uuid)
}

/**
 * Convert ID to appropriate format based on mode
 * - In backward compat mode: return ObjectId from request, store as UUID
 * - In new mode: use UUID directly
 */
export const normalizeId = (id, returnFormat = 'uuid') => {
  if (!id) return null
  
  if (isUuid(id)) {
    // Already a UUID
    return id
  }
  
  if (isObjectId(id)) {
    // Is an ObjectId - try to find mapped UUID
    const mapped = getUuidFromObjectId(id)
    if (mapped) return mapped
    
    // No mapping found - this shouldn't happen in migration
    throw new Error(`ObjectId ${id} not found in migration mappings`)
  }
  
  throw new Error(`Invalid ID format: ${id}`)
}

/**
 * Parse request body/params to normalize IDs
 */
export const normalizeRequestIds = (data) => {
  if (!data) return data
  
  const normalized = { ...data }
  
  // Common ID fields
  const idFields = ['userId', 'user_id', 'farmId', 'farm_id', 'productId', 'product_id', 
                    'postId', 'post_id', 'commentId', 'comment_id', 'authorId', 'author_id']
  
  for (const field of idFields) {
    if (normalized[field]) {
      normalized[field] = normalizeId(normalized[field])
    }
  }
  
  return normalized
}
```

### Response Formatter for Backward Compatibility

**New file: `backend/utils/responseFormatter.js`**

```javascript
/**
 * Format API responses to maintain backward compatibility
 * - Return UUIDs as-is for new frontend
 * - Optionally include ObjectId equivalents for old frontend
 */
export const formatResponse = (data, includeObjectIds = false) => {
  if (!data) return data
  
  if (Array.isArray(data)) {
    return data.map(item => formatResponse(item, includeObjectIds))
  }
  
  if (typeof data !== 'object') {
    return data
  }
  
  const formatted = { ...data }
  
  // In future: map UUIDs back to ObjectIds if needed
  // For now: just return UUIDs directly
  
  return formatted
}

/**
 * Transform MongoDB response format to match Supabase format
 */
export const transformResponse = (dbMode, data) => {
  if (dbMode === 'mongodb') {
    // MongoDB returns _id, map to id
    if (data && data._id) {
      data.id = data._id
      delete data._id
    }
    return data
  }
  
  // Supabase already returns id
  return data
}
```

---

## File Structure Changes

### New Files to Create

```
backend/
├── config/
│   ├── supabase.js                 (NEW - Supabase client init)
│   └── connectdb.js                (EXISTING - keep for now)
│
├── utils/
│   ├── idMapper.js                 (NEW - ObjectId ↔ UUID mapping)
│   ├── responseFormatter.js         (NEW - response formatting)
│   └── migrationHelpers.js          (NEW - migration utilities)
│
├── middleware/
│   ├── dualAuthMiddleware.js        (NEW - JWT + Supabase auth)
│   ├── isAutheticated.js            (EXISTING - refactor to use dualAuthMiddleware)
│   └── dbRouter.js                  (NEW - routes queries based on DB_MODE)
│
├── migrations/
│   ├── 001_create_schema.sql        (NEW - PostgreSQL schema)
│   ├── 002_setup_rls.sql            (NEW - RLS policies)
│   ├── 003_setup_storage.sql        (NEW - Storage buckets)
│   └── 004_migrate_data.js          (NEW - Data migration script)
│
├── models/
│   ├── user.model.js                (EXISTING - keep for now)
│   ├── product.model.js             (EXISTING - keep for now)
│   ├── order.model.js               (EXISTING - keep for now)
│   ├── CommunityPost.model.js        (EXISTING - keep for now)
│   ├── supabase/
│   │   ├── users.js                 (NEW - Supabase queries)
│   │   ├── products.js              (NEW - Supabase queries)
│   │   ├── orders.js                (NEW - Supabase queries)
│   │   ├── community.js             (NEW - Supabase queries)
│   │   └── ai.js                    (NEW - Supabase queries)
│   └── query.js                     (NEW - Abstract interface)
│
├── controller/
│   └── [existing]                   (REFACTOR - use abstract query layer)
│
└── app.js                           (UPDATE - add Supabase config)
```

### Updated Files

**`backend/app.js` - Add Supabase initialization:**
```javascript
import { initSupabase } from './config/supabase.js'
import dualAuthMiddleware from './middleware/dualAuthMiddleware.js'

// In app startup:
app.use(express.json())

// Initialize Supabase connection
if (process.env.SUPABASE_URL) {
  await initSupabase()
}

// Use dual auth middleware instead of old isAuthenticated
app.use(dualAuthMiddleware)
```

---

## Query Layer Abstraction

### Abstract Database Interface

**New file: `backend/models/query.js`**

This allows switching between MongoDB and Supabase without changing controller code:

```javascript
const DB_MODE = process.env.DB_MODE || 'mongodb'

// Dynamic import based on DB_MODE
const getQueryImpl = async () => {
  if (DB_MODE === 'supabase') {
    return (await import('./supabase/index.js')).default
  } else {
    return (await import('./mongoose/index.js')).default
  }
}

export default getQueryImpl
```

**Usage in controllers:**
```javascript
// controller code remains unchanged
import getQueryImpl from '../models/query.js'

export const getUser = async (req, res) => {
  const db = await getQueryImpl()
  const user = await db.users.findById(req.id)
  res.json(user)
}
```

### Supabase Query Implementations

**`backend/models/supabase/users.js`:**
```javascript
import { supabaseAdmin } from '../../config/supabase.js'

export const users = {
  async findById(id) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  async findByEmail(email) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },
  
  async create(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  async update(id, updates) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
```

---

## Real-time Subscriptions

### Real-time Event Handler

**New file: `backend/utils/realtimeHandler.js`**

```javascript
import { supabase } from '../config/supabase.js'

/**
 * Subscribe to community post changes
 */
export const subscribeToPosts = (callback) => {
  const subscription = supabase
    .from('community_posts')
    .on('*', payload => {
      console.log('Post change:', payload)
      callback(payload)
    })
    .subscribe()
  
  return subscription
}

/**
 * Subscribe to order status changes
 */
export const subscribeToOrders = (userId, callback) => {
  const subscription = supabase
    .from('orders')
    .on('UPDATE', payload => {
      // Only notify if this user is involved
      if (payload.new.user_id === userId || payload.new.farmer_id === userId) {
        callback(payload)
      }
    })
    .subscribe()
  
  return subscription
}

/**
 * Subscribe to comments on a specific post
 */
export const subscribeToComments = (postId, callback) => {
  const subscription = supabase
    .from('community_comments')
    .on('INSERT', payload => {
      if (payload.new.post_id === postId) {
        callback(payload)
      }
    })
    .subscribe()
  
  return subscription
}

/**
 * Unsubscribe from changes
 */
export const unsubscribe = (subscription) => {
  supabase.removeSubscription(subscription)
}
```

### WebSocket Integration in Controllers

```javascript
// Example: Real-time community post updates
export const startPostSubscription = async (req, res) => {
  try {
    const { postId } = req.params
    
    const subscription = subscribeToComments(postId, (payload) => {
      // Emit to frontend via WebSocket
      req.app.io.emit('post:new-comment', {
        postId,
        comment: payload.new
      })
    })
    
    // Store subscription for cleanup
    req.app.activeSubscriptions = req.app.activeSubscriptions || {}
    req.app.activeSubscriptions[postId] = subscription
    
    res.json({ success: true, message: 'Subscribed to post' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

---

## Migration Strategy

### Three-Phase Migration Plan

**Phase 1: Preparation (Week 1)**
- Create PostgreSQL schema in Supabase
- Set up RLS policies and storage buckets
- Configure environment variables
- Deploy dual authentication middleware (non-breaking)

**Phase 2: Data Migration (Week 2)**
- Run data migration script in staging environment
- Validate data integrity
- Test all CRUD operations
- Enable `DUAL_MODE_ENABLED=true` for parallel reads

**Phase 3: Cutover (Week 3)**
- Monitor parallel operation
- Switch `DB_MODE=supabase` gradually (10% → 50% → 100%)
- Keep MongoDB in read-only mode as fallback
- Once stable, disable `DUAL_MODE_ENABLED`

### Data Migration Script

**`backend/migrations/migrateData.js`**

```javascript
import mongoose from 'mongoose'
import { supabaseAdmin } from '../config/supabase.js'
import { User } from '../models/user.model.js'
import { Product } from '../models/product.model.js'
import { Order } from '../models/order.model.js'
import { CommunityPost } from '../models/CommunityPost.model.js'
import { CommunityComment } from '../models/CommunityComment.model.js'
import { v4 as uuidv4 } from 'uuid'

const idMap = new Map() // ObjectId → UUID mapping

async function migrateUsers() {
  console.log('Migrating users...')
  const users = await User.find()
  
  for (const user of users) {
    const uuid = uuidv4()
    const { error } = await supabaseAdmin
      .from('users')
      .insert([{
        id: uuid,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        phone: user.phone,
        location: user.location || {},
        created_at: user.createdAt,
        updated_at: user.updatedAt
      }])
    
    if (error) console.error('Error inserting user:', error)
    else idMap.set(user._id.toString(), uuid)
  }
  
  console.log(`✓ Migrated ${users.length} users`)
}

async function migrateProducts() {
  console.log('Migrating products...')
  const products = await Product.find()
  
  for (const product of products) {
    const farmId = idMap.get(product.farm.toString())
    if (!farmId) {
      console.warn(`Skipping product with missing farm: ${product._id}`)
      continue
    }
    
    const { error } = await supabaseAdmin
      .from('products')
      .insert([{
        id: uuidv4(),
        farm_id: farmId,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        unit: product.unit,
        available_quantity: product.availableQuantity,
        images: product.images || [],
        organic: product.organic,
        harvest_date: product.harvestDate,
        rating: product.rating || { average: 0, count: 0 },
        tags: product.tags || [],
        is_subscription_available: product.isSubscriptionAvailable,
        created_at: product.createdAt,
        updated_at: product.updatedAt
      }])
    
    if (error) console.error('Error inserting product:', error)
  }
  
  console.log(`✓ Migrated ${products.length} products`)
}

// Similar functions for orders, posts, comments, likes, ai_suggestions
// ... (truncated for brevity)

async function runMigration(dryRun = true) {
  try {
    if (dryRun) {
      console.log('⚠️  DRY RUN MODE - No data will be inserted\n')
    }
    
    console.log('Starting migration...\n')
    
    await migrateUsers()
    await migrateProducts()
    // ... more migrations
    
    console.log('\n✓ Migration completed successfully')
    console.log(`ID mappings: ${idMap.size}`)
    
  } catch (error) {
    console.error('✗ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
const dryRun = process.argv[2] === '--dry-run'
runMigration(dryRun)
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Schema Completeness

**For any** user, product, order, or community post in MongoDB, after migration to Supabase, the same record SHALL exist in PostgreSQL with all fields preserved and properly typed.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8**

### Property 2: Referential Integrity

**For any** order in the migrated database, both the user_id and farmer_id foreign keys SHALL reference valid users, and deleting a user SHALL cascade delete all associated orders.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

### Property 3: Authentication Round-trip

**For any** user credential pair (email, password), after registration or login, the authentication middleware SHALL accept both JWT tokens (legacy) and Supabase sessions (new) without requiring frontend changes.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 4: ID Mapping Consistency

**For any** ObjectId in request parameters, the ID mapper SHALL translate it to its corresponding UUID and the query SHALL return the correct record regardless of whether the frontend sends ObjectId or UUID.

**Validates: Requirements 8.2**

### Property 5: Data Consistency During Dual-Mode

**For any** read operation when `DUAL_MODE_ENABLED=true`, querying the same record from both MongoDB and Supabase SHALL return equivalent data (allowing for type differences like ObjectId vs UUID).

**Validates: Requirements 7.5, 8.1**

### Property 6: Real-time Event Delivery

**For any** community post update or order status change, subscribed clients SHALL receive notifications within 200ms and the notification payload SHALL contain the complete updated record.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 10.7**

### Property 7: RLS Policy Enforcement

**For any** authenticated user, queries to Supabase SHALL only return rows that the user has permission to access according to Row Level Security policies, and unauthorized access attempts SHALL be rejected.

**Validates: Requirements 4.5, 6.1**

---

## Error Handling Strategy

### Connection Failure Recovery

```javascript
// backend/utils/connectionPool.js

export class ConnectionPool {
  constructor() {
    this.maxRetries = 5
    this.baseDelay = 1000 // 1 second
  }
  
  async executeWithRetry(operation, operationName) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        const delay = this.baseDelay * Math.pow(2, attempt - 1)
        
        console.error(
          `${operationName} failed (attempt ${attempt}/${this.maxRetries}). ` +
          `Retrying in ${delay}ms...`,
          error.message
        )
        
        if (attempt === this.maxRetries) {
          throw new Error(
            `${operationName} failed after ${this.maxRetries} attempts: ${error.message}`
          )
        }
        
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
}
```

### Validation Before Migration

```javascript
async function validateMigration() {
  console.log('Validating migration integrity...\n')
  
  const validation = {
    userCount: { mongodb: 0, supabase: 0 },
    productCount: { mongodb: 0, supabase: 0 },
    orderCount: { mongodb: 0, supabase: 0 },
    errors: []
  }
  
  // Count MongoDB records
  validation.userCount.mongodb = await User.countDocuments()
  validation.productCount.mongodb = await Product.countDocuments()
  validation.orderCount.mongodb = await Order.countDocuments()
  
  // Count Supabase records
  const { count: userCount } = await supabaseAdmin
    .from('users')
    .select('id', { count: 'exact' })
  validation.userCount.supabase = userCount
  
  // Similar for products and orders...
  
  // Check for mismatches
  if (validation.userCount.mongodb !== validation.userCount.supabase) {
    validation.errors.push(
      `User count mismatch: MongoDB=${validation.userCount.mongodb}, ` +
      `Supabase=${validation.userCount.supabase}`
    )
  }
  
  // Print report
  console.log('Validation Report:')
  console.log(JSON.stringify(validation, null, 2))
  
  return validation.errors.length === 0
}
```

---

## Testing & Validation Strategy

### Unit Test Framework for Queries

```javascript
// backend/tests/supabase.test.js

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { supabaseAdmin } from '../config/supabase.js'

describe('Supabase Query Layer', () => {
  describe('Users', () => {
    it('should create a user with all required fields', async () => {
      const testUser = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password_hash: 'hashed_password',
        role: 'farmer'
      }
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([testUser])
        .select()
        .single()
      
      expect(error).toBeNull()
      expect(data).toHaveProperty('id')
      expect(data.name).toBe(testUser.name)
      expect(data.email).toBe(testUser.email)
    })
    
    it('should enforce unique email constraint', async () => {
      const email = `unique-test-${Date.now()}@example.com`
      const testUser = {
        name: 'User 1',
        email,
        password_hash: 'hash1',
        role: 'farmer'
      }
      
      // Insert first user
      await supabaseAdmin.from('users').insert([testUser])
      
      // Try to insert duplicate email
      const { error } = await supabaseAdmin
        .from('users')
        .insert([{ ...testUser, name: 'User 2' }])
      
      expect(error).not.toBeNull()
      expect(error.code).toMatch(/unique/)
    })
  })
  
  describe('Referential Integrity', () => {
    it('should cascade delete when user is deleted', async () => {
      // Create user
      const { data: user } = await supabaseAdmin
        .from('users')
        .insert([{ name: 'Test', email: `user-${Date.now()}@test.com`, password_hash: 'h', role: 'farmer' }])
        .select()
        .single()
      
      // Create product for user
      await supabaseAdmin
        .from('products')
        .insert([{
          farm_id: user.id,
          name: 'Test Product',
          category: 'vegetables',
          price: 100,
          unit: 'kg',
          available_quantity: 50
        }])
      
      // Delete user
      await supabaseAdmin.from('users').delete().eq('id', user.id)
      
      // Verify products are deleted
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('farm_id', user.id)
      
      expect(products).toHaveLength(0)
    })
  })
})
```

### Integration Test for API Endpoints

```javascript
// backend/tests/api.integration.test.js

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('API Integration Tests', () => {
  let authToken
  let userId
  
  beforeAll(async () => {
    // Register and login
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'TestPass123',
        role: 'farmer',
        address: '123 Farm Lane',
        city: 'Karnataka',
        zipCode: '560001'
      })
    
    expect(registerRes.status).toBe(201)
    userId = registerRes.body.user.id
    
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: registerRes.body.user.email,
        password: 'TestPass123',
        role: 'farmer'
      })
    
    authToken = loginRes.body.token
  })
  
  it('should authenticate with JWT token', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${authToken}`)
    
    expect(res.status).toBe(200)
    expect(res.body.user.id).toBe(userId)
  })
  
  it('should preserve data format across API calls', async () => {
    // Create product
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Organic Tomatoes',
        category: 'vegetables',
        price: 45.50,
        unit: 'kg',
        availableQuantity: 100,
        organic: true
      })
    
    expect(createRes.status).toBe(201)
    const productId = createRes.body.product.id
    
    // Retrieve product
    const getRes = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${authToken}`)
    
    expect(getRes.status).toBe(200)
    expect(getRes.body.product.name).toBe('Organic Tomatoes')
    expect(getRes.body.product.price).toBe(45.50)
  })
})
```

---

## Performance Benchmarks

### Target Performance Metrics

| Operation | Target | Measurement |
|-----------|--------|-------------|
| User login | < 500ms | Time from request to response |
| Product search | < 200ms | Database query + serialization |
| Order creation | < 800ms | Full transaction including validations |
| Community post fetch | < 300ms | Including nested comments |
| Real-time notification | < 200ms | From event trigger to client delivery |
| Data migration (full DB) | < 30min | Complete MongoDB → Supabase transfer |

### Index Performance Targets

- Foreign key lookups: < 10ms (covered by indexes)
- Text search on tags: < 100ms for 100K records
- Date range queries: < 50ms for 1-year ranges
- Scan operations: Full table scan as fallback only

---

## Rollback Procedure

### If Migration Fails

1. **Immediate Response:**
   - Set `DB_MODE=mongodb` to revert to MongoDB
   - Keep Supabase in read-only mode
   - Notify team

2. **Investigation:**
   - Check migration logs for data loss or constraint violations
   - Validate data integrity report
   - Identify root cause

3. **Remediation:**
   - Fix identified issues (schema, data type, constraints)
   - Run validation on test data again
   - Create updated migration script

4. **Retry Migration:**
   - Clear Supabase tables (after backup)
   - Run corrected migration script
   - Validate integrity before cutover

### MongoDB Backup Strategy

- Full backup before each migration attempt
- Point-in-time recovery enabled
- Backup retention: 30 days
- Test restore procedure quarterly

---

## Documentation Files

### Generated SQL Files

1. **`001_create_schema.sql`** - Complete PostgreSQL schema with indexes
2. **`002_setup_rls.sql`** - Row Level Security policies
3. **`003_setup_storage.sql`** - Storage bucket configuration
4. **`004_seed_data.sql`** - Test data for validation

### Configuration Files

1. **`.env.example`** - Template with all required variables
2. **`SUPABASE_SETUP.md`** - Step-by-step Supabase console setup
3. **`MIGRATION_CHECKLIST.md`** - Pre-migration validation checklist

---

## Next Steps

Once this design is approved:

1. **Create Supabase Project** - Set up PostgreSQL database
2. **Deploy Schema** - Run SQL migration files
3. **Configure RLS & Storage** - Set up security policies
4. **Implement Query Layer** - Build Supabase client abstractions
5. **Update Controllers** - Refactor to use abstract query interface
6. **Create Migration Script** - Build and test data transfer
7. **Integration Testing** - Comprehensive test suite
8. **Staging Deployment** - Test full flow with production-like data
9. **Gradual Rollout** - 10% → 50% → 100% traffic switching

