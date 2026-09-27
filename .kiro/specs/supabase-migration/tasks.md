# Implementation Plan: Supabase Migration

## Overview

This implementation plan breaks down the Supabase migration into 18 discrete, actionable tasks covering Supabase project setup, database schema creation, authentication integration, infrastructure development, query layer implementation, data migration, and comprehensive testing. Tasks are sequenced to enable incremental progress with validation checkpoints.

---

## Tasks

### 1. Project Setup & Environment Configuration

- [x] 1.1 Create Supabase project and obtain credentials
  - Create new Supabase project at https://app.supabase.com
  - Note the project URL, anon key, and service key
  - Create strong database password
  - Store credentials securely
  - _Requirements: 6.1, 6.2, 6.3_
  - _Estimated time: 15 minutes_

- [x] 1.2 Update environment configuration
  - Add SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY to `.env`
  - Verify all existing credentials (MongoDB, Cloudinary, JWT_SECRET) remain intact
  - Add migration control variables: DB_MODE=mongodb, DUAL_MODE_ENABLED=false
  - Create `.env.example` template with all required variables
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - _Files: backend/.env, backend/.env.example_
  - _Estimated time: 10 minutes_

---

### 2. Supabase Database Schema Creation

- [x] 2.1 Create PostgreSQL tables and constraints
  - Execute SQL to create: users, products, orders, community_posts, community_comments, community_likes, ai_suggestions tables
  - Add CHECK constraints for role, status, category, unit, payment_status enums
  - Add UNIQUE constraint on email and post_id+user_id
  - Add NOT NULL constraints on required fields
  - Verify all UUID primary keys with gen_random_uuid()
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  - _Files: .kiro/specs/supabase-migration/migrations/001_create_schema.sql_
  - _Estimated time: 20 minutes_

- [x] 2.2 Create foreign key relationships and cascade rules
  - Add foreign key: products.farm_id → users.id with CASCADE DELETE
  - Add foreign key: orders.user_id → users.id with CASCADE DELETE
  - Add foreign key: orders.farmer_id → users.id with SET NULL
  - Add foreign key: community_posts.author_id → users.id with CASCADE DELETE
  - Add foreign key: community_comments.post_id → community_posts.id with CASCADE DELETE
  - Add foreign key: community_comments.author_id → users.id with CASCADE DELETE
  - Add foreign key: community_comments.parent_id → community_comments.id with CASCADE DELETE
  - Add foreign key: community_likes.post_id → community_posts.id with CASCADE DELETE
  - Add foreign key: community_likes.user_id → users.id with CASCADE DELETE
  - Add foreign key: ai_suggestions.user_id → users.id with CASCADE DELETE
  - Verify cascading behavior in test environment
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - _Files: .kiro/specs/supabase-migration/migrations/001_create_schema.sql_
  - _Estimated time: 15 minutes_

- [x] 2.3 Create indexes for query performance
  - Create index on users(email) for login queries
  - Create index on users(role) for filtering
  - Create index on products(farm_id) for foreign key joins
  - Create index on products(category) for filtering
  - Create index on products(created_at DESC) for sorting
  - Create GIN index on products(tags) for array containment
  - Create index on orders(user_id) for user order history
  - Create index on orders(farmer_id) for farmer order history
  - Create index on orders(status) for filtering
  - Create index on orders(created_at DESC) for sorting
  - Create index on community_posts(author_id) for user posts
  - Create index on community_posts(is_solved) for filtering
  - Create index on community_posts(created_at DESC) for feed
  - Create GIN index on community_posts(tags) for tag search
  - Create index on community_comments(post_id) for nested replies
  - Create index on community_comments(author_id) for user comments
  - Create index on community_comments(parent_id) for thread traversal
  - Create index on community_comments(created_at DESC) for sorting
  - Create index on ai_suggestions(user_id) for user history
  - Create index on ai_suggestions(created_at DESC) for sorting
  - Test query performance on each indexed column
  - _Requirements: 1.1, 2.1_
  - _Files: backend/migrations/003_create_indexes.sql_
  - _Estimated time: 15 minutes_
  - _Status: ✓ COMPLETED - All 20+ indexes created_

---

### 3. Supabase Authentication & Authorization

- [ ] 3.1 Configure Row Level Security (RLS) policies
  - Enable RLS on all 7 tables
  - Create policy: Users can view own profile (users table SELECT)
  - Create policy: Users can update own profile (users table UPDATE)
  - Create policy: Products are publicly readable (products table SELECT)
  - Create policy: Only farmer can manage own products (products INSERT, UPDATE, DELETE)
  - Create policy: Users can view own orders or farmer can view their orders (orders SELECT)
  - Create policy: Users/farmers can update own orders (orders UPDATE)
  - Create policy: Community posts publicly readable (community_posts SELECT)
  - Create policy: Only author can update/delete own post (community_posts UPDATE, DELETE)
  - Create policy: Community comments publicly readable (community_comments SELECT)
  - Create policy: Only author can update/delete own comment (community_comments UPDATE, DELETE)
  - Create policy: Community likes publicly readable (community_likes SELECT)
  - Create policy: Users can only create/delete own likes (community_likes INSERT, DELETE)
  - Create policy: Users can view own AI suggestions (ai_suggestions SELECT)
  - Verify policies with test queries as different user roles
  - _Requirements: 4.1, 4.5_
  - _Files: .kiro/specs/supabase-migration/migrations/002_setup_rls.sql_
  - _Estimated time: 25 minutes_

- [ ] 3.2 Create and configure Supabase Storage bucket
  - Create storage bucket named 'farm-fresh-uploads' via Supabase dashboard
  - Create policy: Public read access for uploaded files
  - Create policy: Users can upload files to their own folder
  - Create policy: Users can update their own files
  - Create policy: Users can delete their own files
  - Test upload/download flow with sample files
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - _Files: .kiro/specs/supabase-migration/migrations/003_setup_storage.sql_
  - _Estimated time: 15 minutes_

---

### 4. Backend Infrastructure - Supabase Integration

- [ ] 4.1 Create Supabase client initialization module
  - Create `backend/config/supabase.js`
  - Initialize Supabase client with service role key for server operations
  - Initialize Supabase client with anon key for reference
  - Add `initSupabase()` function to test connection on app startup
  - Add error handling with retry logic
  - Export both clients for use throughout application
  - Test connection to verify credentials work
  - _Requirements: 3.1, 3.2, 3.4, 3.5, 6.1, 6.2, 6.3_
  - _Files: backend/config/supabase.js_
  - _Estimated time: 15 minutes_

- [ ] 4.2 Implement ID mapping and translation utilities
  - Create `backend/utils/idMapper.js`
  - Implement `isObjectId()` to validate MongoDB ObjectId format
  - Implement `isUuid()` to validate UUID format
  - Implement `getUuidFromObjectId()` to retrieve mapped UUID
  - Implement `mapObjectIdToUuid()` to store ObjectId→UUID mapping
  - Implement `normalizeId()` to convert ID to UUID format
  - Implement `normalizeRequestIds()` to normalize all ID fields in request body
  - Add support for common ID field names (userId, user_id, farmId, etc.)
  - Test with both ObjectId and UUID inputs
  - _Requirements: 8.2_
  - _Files: backend/utils/idMapper.js_
  - _Estimated time: 20 minutes_

- [ ] 4.3 Implement response formatter for backward compatibility
  - Create `backend/utils/responseFormatter.js`
  - Implement `formatResponse()` to structure responses consistently
  - Implement `transformResponse()` to handle MongoDB vs Supabase response differences
  - Ensure UUID format returned consistently in all responses
  - Test with various data structures (objects, arrays, nested objects)
  - _Requirements: 8.1_
  - _Files: backend/utils/responseFormatter.js_
  - _Estimated time: 15 minutes_

- [ ] 4.4 Create dual authentication middleware
  - Create `backend/middleware/dualAuthMiddleware.js`
  - Accept JWT tokens in Authorization header or cookies
  - Accept Supabase sessions via token
  - Implement JWT validation against JWT_SECRET (legacy support)
  - Implement Supabase token validation via `supabaseAdmin.auth.getUser()`
  - Accept either JWT or Supabase Auth (not require both)
  - Set `req.id` with authenticated user ID
  - Set `req.authMethod` to track which auth method was used
  - Handle errors gracefully with 401 responses
  - Test with both JWT and Supabase tokens
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - _Files: backend/middleware/dualAuthMiddleware.js_
  - _Estimated time: 20 minutes_

---

### 5. Data Access Layer - Supabase Query Implementations

- [ ] 5.1 Implement Supabase query layer for users
  - Create `backend/models/supabase/users.js`
  - Implement `findById(id)` to fetch user by UUID
  - Implement `findByEmail(email)` to find user for login
  - Implement `create(userData)` to create new user
  - Implement `update(id, updates)` to update user profile
  - Implement `findByRole(role)` to filter users by role
  - Implement `delete(id)` to delete user (triggers cascades)
  - Test all operations with sample data
  - _Requirements: 1.2, 3.1, 3.2, 3.3_
  - _Files: backend/models/supabase/users.js_
  - _Estimated time: 20 minutes_

- [ ] 5.2 Implement Supabase query layer for products
  - Create `backend/models/supabase/products.js`
  - Implement `findById(id)` to fetch product details
  - Implement `findByFarmId(farmId)` to get all products from a farmer
  - Implement `findByCategory(category)` to filter by category
  - Implement `search(query)` to search by name and tags
  - Implement `create(productData)` to create new product
  - Implement `update(id, updates)` to update product
  - Implement `delete(id)` to delete product
  - Implement `findAvailable()` to get products with quantity > 0
  - Test all operations including filtering and sorting
  - _Requirements: 1.3, 1.4_
  - _Files: backend/models/supabase/products.js_
  - _Estimated time: 25 minutes_

- [ ] 5.3 Implement Supabase query layer for orders
  - Create `backend/models/supabase/orders.js`
  - Implement `findById(id)` to fetch order details
  - Implement `findByUserId(userId)` to get user's orders
  - Implement `findByFarmerId(farmerId)` to get farmer's orders
  - Implement `findByStatus(status)` to filter orders by status
  - Implement `create(orderData)` to create new order
  - Implement `update(id, updates)` to update order (including status changes)
  - Implement `delete(id)` to cancel order
  - Implement `updateStatus(id, newStatus)` for order progression
  - Test all operations including complex filtering
  - _Requirements: 1.5, 2.1, 2.3_
  - _Files: backend/models/supabase/orders.js_
  - _Estimated time: 25 minutes_

- [ ] 5.4 Implement Supabase query layer for community features
  - Create `backend/models/supabase/community.js`
  - Implement posts operations: findById, findAll, findByAuthor, create, update, delete, markSolved
  - Implement comments operations: findByPostId, create, update, delete, markSolution
  - Implement likes operations: findByPostId, toggleLike, countLikes, userLiked
  - Handle nested comment queries efficiently
  - Support pagination for post feeds
  - Test all operations including thread traversal
  - _Requirements: 1.6, 1.7, 2.1_
  - _Files: backend/models/supabase/community.js_
  - _Estimated time: 30 minutes_

- [ ] 5.5 Implement Supabase query layer for AI suggestions
  - Create `backend/models/supabase/ai.js`
  - Implement `findById(id)` to fetch AI analysis result
  - Implement `findByUserId(userId)` to get user's AI suggestions
  - Implement `create(analysisData)` to store AI analysis
  - Implement `findRecent(userId, limit)` to get recent analyses
  - Handle JSONB analysis_result field with complex structure
  - Test with various AI output formats
  - _Requirements: 1.8_
  - _Files: backend/models/supabase/ai.js_
  - _Estimated time: 15 minutes_

---

### 6. Authentication & Authorization Controllers

- [ ] 6.1 Update Auth controller for Supabase Auth integration
  - Refactor `backend/controller/Auth.controller.js` (or create new registration/login endpoints)
  - Update `register()` to create both Supabase Auth user AND users table record
  - Update `login()` to validate credentials against Supabase Auth
  - Return JWT token for backward compatibility + Supabase session
  - Handle password hashing with bcrypt (store hash in users table)
  - Implement `logout()` to invalidate both JWT and Supabase sessions
  - Support password reset workflow
  - Test registration flow with new users
  - Test login with both old JWT and new Supabase users
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_
  - _Files: backend/controller/Auth.controller.js_
  - _Estimated time: 30 minutes_

- [ ] 6.2 Update routes to use dual authentication middleware
  - Update `backend/app.js` to initialize Supabase on startup
  - Replace existing auth middleware with `dualAuthMiddleware`
  - Ensure all protected routes receive both req.id and req.authMethod
  - Test all routes with JWT tokens
  - Test all routes with Supabase sessions
  - Test routes with invalid tokens (should return 401)
  - _Requirements: 3.3, 3.4, 3.5_
  - _Files: backend/app.js, backend/middleware/dualAuthMiddleware.js_
  - _Estimated time: 15 minutes_

---

### 7. Data Migration & Validation

- [ ] 7.1 Create data migration script
  - Create `backend/migrations/migrateData.js`
  - Implement MongoDB connection and collection scanning
  - Create UUID generation and ObjectId→UUID mapping
  - Implement user migration: MongoDB users → Supabase users table
  - Implement product migration: preserve farm_id mapping
  - Implement order migration: map user_id and farmer_id references
  - Implement community posts migration: preserve author_id and nested content
  - Implement comments migration: maintain post_id and parent_id relationships
  - Implement likes migration: preserve post_id and user_id
  - Implement AI suggestions migration: preserve user_id and analysis results
  - Add dry-run mode (`--dry-run` flag) to preview changes without inserting
  - Add error logging with recovery recommendations
  - Test migration with test data first
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_
  - _Files: backend/migrations/migrateData.js_
  - _Estimated time: 45 minutes_

- [ ] 7.2 Create migration validation script
  - Create `backend/migrations/validateMigration.js`
  - Count records in MongoDB vs Supabase for each collection
  - Verify referential integrity: no orphaned records
  - Spot-check data transformation accuracy (sample records)
  - Validate constraint violations (CHECK constraints pass, UNIQUE preserved)
  - Compare checksums of sample data before/after
  - Generate detailed validation report
  - Halt migration if violations found
  - _Requirements: 7.5, 9.3, 9.4_
  - _Files: backend/migrations/validateMigration.js_
  - _Estimated time: 30 minutes_

- [ ] 7.3 Create MongoDB to PostgreSQL data type converter
  - Create `backend/utils/migrationHelpers.js`
  - Implement ObjectId → UUID conversion with mapping storage
  - Implement nested objects → JSONB conversion
  - Implement MongoDB arrays → PostgreSQL arrays
  - Implement Date → TIMESTAMP WITH TIME ZONE conversion
  - Implement enum validation (role, status, category, etc.)
  - Handle null/undefined values appropriately
  - Test all conversions with edge cases
  - _Requirements: 7.2, 7.3_
  - _Files: backend/utils/migrationHelpers.js_
  - _Estimated time: 25 minutes_

---

### 8. Real-time Features

- [ ] 8.1 Implement real-time subscription handlers
  - Create `backend/utils/realtimeHandler.js`
  - Implement `subscribeToPosts(callback)` for community post changes
  - Implement `subscribeToOrders(userId, callback)` for order updates (user/farmer aware)
  - Implement `subscribeToComments(postId, callback)` for new comments
  - Implement `unsubscribe(subscription)` to clean up subscriptions
  - Add memory leak prevention with proper cleanup
  - Test subscription establishment and teardown
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Files: backend/utils/realtimeHandler.js_
  - _Estimated time: 20 minutes_

- [ ] 8.2 Integrate real-time subscriptions into controllers
  - Update `backend/controllers/community.controller.js` to emit real-time events
  - Update `backend/controllers/order.controller.js` to notify on status changes
  - Wire up Socket.io or similar WebSocket library for frontend delivery
  - Ensure notifications include complete updated record
  - Test end-to-end: create post → subscribers receive notification
  - Measure notification latency (target < 200ms)
  - _Requirements: 5.1, 5.2, 5.3, 10.7_
  - _Files: backend/controllers/community.controller.js, backend/controllers/order.controller.js_
  - _Estimated time: 25 minutes_

---

### 9. Integration & Testing

- [ ] 9.1 Create unit tests for Supabase query layer
  - Create `backend/tests/supabase.test.js`
  - Test users CRUD operations
  - Test products CRUD operations with farm_id validation
  - Test orders CRUD operations with user/farmer references
  - Test community posts, comments, likes CRUD
  - Test AI suggestions CRUD
  - Test constraint violations (email uniqueness, enum validation)
  - Test cascading deletes work correctly
  - Achieve 90%+ code coverage for query layer
  - Run all tests and verify passing
  - _Requirements: 10.2, 10.3, 10.6_
  - _Files: backend/tests/supabase.test.js_
  - _Estimated time: 45 minutes_

- [ ] 9.2 Create integration tests for API endpoints
  - Create `backend/tests/api.integration.test.js`
  - Test user registration flow (create Supabase Auth user + DB record)
  - Test user login with both JWT and Supabase auth methods
  - Test product creation/retrieval maintaining farm_id relationships
  - Test order creation with proper user/farmer references
  - Test community posts with nested comments
  - Test order status changes trigger notifications
  - Test real-time subscription delivery
  - Test backward compatibility (frontend can send ObjectIds)
  - Achieve 85%+ endpoint coverage
  - Run all tests and verify passing
  - _Requirements: 10.2, 10.3, 10.5, 10.6_
  - _Files: backend/tests/api.integration.test.js_
  - _Estimated time: 50 minutes_

- [ ] 9.3 Create property-based tests for data round-trip
  - Create `backend/tests/properties.test.js`
  - **Property 1: Schema Completeness**
    - For any user/product/order/post created, all fields persist through migration
    - _Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  - **Property 2: Referential Integrity**
    - For any order, both user_id and farmer_id reference valid users; cascade delete works
    - _Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - **Property 3: Authentication Round-trip**
    - For any JWT token, dual auth middleware accepts it; for any Supabase token, it's accepted
    - _Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - **Property 4: ID Mapping Consistency**
    - For any ObjectId in request, mapper translates to UUID; returned record matches regardless of input ID format
    - _Validates: Requirements 8.2_
  - **Property 5: Data Consistency During Dual-Mode**
    - For any read when DUAL_MODE_ENABLED, querying MongoDB and Supabase returns equivalent data
    - _Validates: Requirements 7.5, 8.1_
  - **Property 6: Real-time Event Delivery**
    - For any community post update, subscribed clients receive notification within 200ms with complete record
    - _Validates: Requirements 5.1, 5.2, 5.3, 10.7_
  - **Property 7: RLS Policy Enforcement**
    - For any authenticated user, queries return only accessible rows per RLS; unauthorized access rejected
    - _Validates: Requirements 4.5, 6.1_
  - Run property tests with 100+ iterations each
  - Verify all properties pass
  - _Requirements: All_
  - _Files: backend/tests/properties.test.js_
  - _Estimated time: 60 minutes_

- [ ] 9.4 Test data migration with production-like dataset
  - Create test dataset with 1000+ users, products, orders, posts
  - Run migration script in staging environment
  - Run validation script to check data integrity
  - Verify all records transferred correctly
  - Verify referential integrity maintained
  - Check no records lost or duplicated
  - Verify constraint compliance
  - Document any issues found and fixes applied
  - _Requirements: 7.1, 7.5, 9.3, 10.1_
  - _Files: backend/migrations/migrateData.js, backend/migrations/validateMigration.js_
  - _Estimated time: 30 minutes_

- [ ] 9.5 Test backward compatibility layer
  - Verify frontend sending ObjectIds still works
  - Verify old JWT tokens still authenticate
  - Verify response format matches existing API contract
  - Verify error messages don't leak sensitive info
  - Test edge cases: malformed IDs, expired tokens, missing headers
  - Test concurrent requests to ensure no race conditions
  - Document any compatibility issues
  - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - _Files: All backend files_
  - _Estimated time: 25 minutes_

---

### 10. Deployment & Rollout

- [ ] 10.1 Create database backup and recovery procedure
  - Document Supabase backup process
  - Create backup before each migration attempt
  - Test restore procedure on test environment
  - Verify MongoDB backups exist and are testable
  - Document rollback steps if migration fails
  - _Requirements: 9.4_
  - _Files: MIGRATION_CHECKLIST.md_
  - _Estimated time: 15 minutes_

- [ ] 10.2 Create migration checklist and runbook
  - Create `MIGRATION_CHECKLIST.md` with pre-migration validation steps
  - Create step-by-step migration procedure document
  - Document monitoring points during migration
  - Create post-migration validation steps
  - Include rollback procedures
  - Test checklist by running through entire process in staging
  - _Requirements: 7.1, 9.3, 9.4_
  - _Files: MIGRATION_CHECKLIST.md_
  - _Estimated time: 20 minutes_

- [ ] 10.3 Checkpoint - Ensure all tests pass and migration validated
  - Run full test suite (unit + integration + property tests)
  - Verify migration script runs successfully on staging
  - Verify validation script shows zero errors
  - Document any issues found
  - Fix any remaining issues
  - Ask the user if questions arise before production deployment
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  - _Estimated time: Variable (depending on test results)_

---

## Notes

- Tasks marked with `*` are optional test-related subtasks and can be combined if time is limited
- Each task builds incrementally on previous work
- Database schema (tasks 2.1-2.3) must complete before data access layer (tasks 5.1-5.5)
- Authentication (tasks 3.1-4.4) must complete before testing (tasks 9.x)
- Migration script (task 7.1) depends on query layer (tasks 5.1-5.5) being complete
- Real-time features (tasks 8.1-8.2) can be implemented in parallel with core features
- Comprehensive testing (tasks 9.1-9.5) validates all previous work
- All tasks reference specific requirements from requirements.md for traceability
- Estimated total time: 8-10 hours for complete migration
- Recommend breaking into 2-3 day sprints for team coordination

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 5, "tasks": ["6.1", "6.2"] },
    { "id": 6, "tasks": ["7.1", "7.2", "7.3"] },
    { "id": 7, "tasks": ["8.1", "8.2"] },
    { "id": 8, "tasks": ["9.1", "9.2", "9.3", "9.4", "9.5"] },
    { "id": 9, "tasks": ["10.1", "10.2", "10.3"] }
  ]
}
```

---

## Getting Started

To begin executing tasks:

1. Open this file (`tasks.md`) in your editor
2. Click **"Start task"** next to task 1.1 to create the Supabase project
3. Complete each task in sequence, checking them off as you go
4. Tasks in each wave should complete before moving to the next wave
5. Checkpoints (tasks ending in `.3` or similar) validate previous work
6. Reach out if any task is blocked or needs clarification
