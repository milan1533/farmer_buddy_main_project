-- ==============================================================================
-- Supabase Migration: Foreign Key Relationships and Cascade Rules
-- ==============================================================================
-- This migration adds all foreign key constraints with appropriate cascade rules.
-- It ensures referential integrity across all related tables.
-- ==============================================================================

-- Note: The foreign keys are already defined in 001_create_schema.sql through
-- the CREATE TABLE statements. However, this file documents the complete list
-- of foreign key constraints for reference and can be used for verification.

-- ==============================================================================
-- FOREIGN KEYS - Already defined in schema, listed here for verification
-- ==============================================================================

-- ==============================================================================
-- 1. PRODUCTS TABLE FOREIGN KEYS
-- ==============================================================================

-- Foreign key: products.farm_id → users.id (CASCADE DELETE)
-- When a user (farmer) is deleted, all their products are deleted
ALTER TABLE products
ADD CONSTRAINT fk_products_farm_id 
FOREIGN KEY (farm_id) REFERENCES users(id) ON DELETE CASCADE;

-- ==============================================================================
-- 2. ORDERS TABLE FOREIGN KEYS
-- ==============================================================================

-- Foreign key: orders.user_id → users.id (CASCADE DELETE)
-- When a buyer user is deleted, all their orders are deleted
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Foreign key: orders.farmer_id → users.id (SET NULL)
-- When a farmer is deleted, the farmer reference becomes NULL
-- This allows order history to be preserved without referencing deleted users
ALTER TABLE orders
ADD CONSTRAINT fk_orders_farmer_id 
FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE SET NULL;

-- ==============================================================================
-- 3. COMMUNITY_POSTS TABLE FOREIGN KEYS
-- ==============================================================================

-- Foreign key: community_posts.author_id → users.id (CASCADE DELETE)
-- When a user is deleted, all their community posts are deleted
ALTER TABLE community_posts
ADD CONSTRAINT fk_community_posts_author_id 
FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;

-- ==============================================================================
-- 4. COMMUNITY_COMMENTS TABLE FOREIGN KEYS
-- ==============================================================================

-- Foreign key: community_comments.post_id → community_posts.id (CASCADE DELETE)
-- When a post is deleted, all comments on that post are deleted
ALTER TABLE community_comments
ADD CONSTRAINT fk_community_comments_post_id 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

-- Foreign key: community_comments.author_id → users.id (CASCADE DELETE)
-- When a user is deleted, all their comments are deleted
ALTER TABLE community_comments
ADD CONSTRAINT fk_community_comments_author_id 
FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;

-- Foreign key: community_comments.parent_id → community_comments.id (CASCADE DELETE)
-- Self-referencing foreign key for nested comments/replies
-- When a parent comment is deleted, all child replies are deleted
ALTER TABLE community_comments
ADD CONSTRAINT fk_community_comments_parent_id 
FOREIGN KEY (parent_id) REFERENCES community_comments(id) ON DELETE CASCADE;

-- ==============================================================================
-- 5. COMMUNITY_LIKES TABLE FOREIGN KEYS
-- ==============================================================================

-- Foreign key: community_likes.post_id → community_posts.id (CASCADE DELETE)
-- When a post is deleted, all likes on that post are deleted
ALTER TABLE community_likes
ADD CONSTRAINT fk_community_likes_post_id 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

-- Foreign key: community_likes.user_id → users.id (CASCADE DELETE)
-- When a user is deleted, all their likes are deleted
ALTER TABLE community_likes
ADD CONSTRAINT fk_community_likes_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ==============================================================================
-- 6. AI_SUGGESTIONS TABLE FOREIGN KEYS
-- ==============================================================================

-- Foreign key: ai_suggestions.user_id → users.id (CASCADE DELETE)
-- When a user is deleted, all their AI suggestions are deleted
ALTER TABLE ai_suggestions
ADD CONSTRAINT fk_ai_suggestions_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ==============================================================================
-- CASCADE DELETE BEHAVIOR SUMMARY
-- ==============================================================================
-- 
-- When a USER is deleted:
--   - All PRODUCTS owned by that user → DELETED
--   - All ORDERS by that user → DELETED
--   - All ORDERS for that farmer → farmer_id SET TO NULL
--   - All COMMUNITY_POSTS by that user → DELETED
--   - All COMMUNITY_COMMENTS by that user → DELETED
--   - All COMMUNITY_LIKES by that user → DELETED
--   - All AI_SUGGESTIONS by that user → DELETED
--
-- When a PRODUCT is deleted:
--   - No cascade effect (products is the child)
--
-- When an ORDER is deleted:
--   - No cascade effect (orders is the child)
--
-- When a COMMUNITY_POST is deleted:
--   - All COMMUNITY_COMMENTS on that post → DELETED
--   - All COMMUNITY_LIKES on that post → DELETED
--
-- When a COMMUNITY_COMMENT is deleted:
--   - All COMMUNITY_COMMENTS that reply to it → DELETED
--
-- ==============================================================================
-- Foreign key constraints are now complete!
-- All 10 foreign key relationships have been established.
-- ==============================================================================
