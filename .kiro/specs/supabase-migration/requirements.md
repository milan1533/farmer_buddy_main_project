# MongoDB to Supabase Migration Requirements

## Introduction

FarmFresh-Ai is a Node.js/Express backend application built with MongoDB and Mongoose that needs to migrate to Supabase (PostgreSQL) while maintaining backward compatibility with existing JWT authentication and integrating Supabase Auth for enhanced security. The migration includes database schema conversion, authentication layer updates, file storage integration, and real-time feature enablement.

## Glossary

- **Supabase**: Open-source Firebase alternative providing PostgreSQL database, authentication, storage, and real-time capabilities
- **PostgreSQL**: SQL database that will replace MongoDB
- **JWT Token**: JSON Web Token used for session management and user authentication
- **Supabase Auth**: Built-in authentication service with email/password, OAuth, and session management
- **Supabase Storage**: File storage service that complements Cloudinary
- **Supabase Client**: TypeScript client library for connecting to Supabase services
- **Real-time Subscriptions**: Supabase feature enabling live data updates via WebSocket
- **Row Level Security (RLS)**: Postgres security feature enabling data access control per user
- **Mongoose**: MongoDB object modeling tool (being replaced)
- **Schema Migration**: Process of converting MongoDB collections/schemas to PostgreSQL tables

## Requirements

### Requirement 1: Database Schema Migration

**User Story:** As a backend engineer, I want to convert all MongoDB Mongoose schemas to Supabase PostgreSQL tables, so that the application can use a relational database with better scalability and real-time capabilities.

#### Acceptance Criteria

1. WHEN the migration is complete, THE Supabase_Database SHALL contain all tables equivalent to existing MongoDB collections with proper relationships and constraints
2. THE users table SHALL store user authentication and profile data with fields: id (UUID), name, email, password_hash, role, phone, location (JSONB), created_at, updated_at
3. THE products table SHALL store product information with fields: id (UUID), farm_id (foreign key to users), name, category (enum), description, price, unit (enum), available_quantity, images (JSONB array), organic (boolean), harvest_date, rating (JSONB), tags (array), is_subscription_available, created_at, updated_at
4. THE orders table SHALL store order records with fields: id (UUID), user_id (foreign key), farmer_id (foreign key), items (JSONB array with product details), total_amount, delivery_address (JSONB), delivery_date, status (enum), payment_status (enum), created_at, updated_at
5. THE community_posts table SHALL store community forum posts with fields: id (UUID), author_id (foreign key to users), content (JSONB containing crop, problemType, description, mediaUrl, mediaType), metadata (JSONB), stats (JSONB with likes/comments/shares), is_solved, tags (array), ai_summary, created_at, updated_at
6. THE community_comments table SHALL store comments on posts with fields: id (UUID), post_id (foreign key), author_id (foreign key), text, is_solution (boolean), likes_count, parent_id (self-referencing for nested replies), created_at, updated_at
7. THE community_likes table SHALL store like records with fields: id (UUID), post_id (foreign key), user_id (foreign key), created_at
8. THE ai_suggestions table SHALL store AI analysis results with fields: id (UUID), user_id (foreign key), image_url, analysis_result (JSONB), suggestions (text array), created_at

### Requirement 2: Database Relationships and Constraints

**User Story:** As a database architect, I want to establish proper foreign key relationships and constraints in Supabase, so that data integrity is maintained and queries are efficient.

#### Acceptance Criteria

1. WHEN a user is deleted, THE System SHALL cascade delete all associated products, orders, and community posts
2. THE products table SHALL have a foreign key constraint linking farm_id to users table
3. THE orders table SHALL have foreign key constraints linking user_id and farmer_id to users table
4. THE community_posts table SHALL have a foreign key constraint linking author_id to users table
5. THE community_comments table SHALL have foreign key constraints linking post_id, author_id, and parent_id appropriately
6. THE community_likes table SHALL have foreign key constraints linking post_id and user_id with unique constraints to prevent duplicate likes
7. ALL foreign keys SHALL enforce referential integrity and prevent orphaned records

### Requirement 3: Supabase Authentication Integration

**User Story:** As a security engineer, I want to integrate Supabase Auth while maintaining backward compatibility with existing JWT tokens, so that the application has enterprise-grade authentication without breaking existing clients.

#### Acceptance Criteria

1. WHEN a user registers through the API, THE System SHALL create both a Supabase Auth user and a corresponding users table record
2. WHEN a user logs in, THE System SHALL validate credentials against Supabase Auth and return both a Supabase session and a custom JWT token
3. WHEN a user provides a JWT token in the Authorization header, THE System SHALL validate it against the JWT_SECRET (backward compatibility)
4. WHEN a user provides a Supabase session, THE System SHALL validate it through Supabase client
5. THE authentication middleware SHALL accept both JWT tokens and Supabase sessions during the transition period
6. WHEN a user logs out, THE System SHALL invalidate both Supabase session and any custom JWT tokens

### Requirement 4: Supabase Storage Configuration

**User Story:** As a backend engineer, I want to configure Supabase Storage for file uploads, so that the application can store files alongside the database with proper access control.

#### Acceptance Criteria

1. THE Supabase Storage bucket named 'farm-fresh-uploads' SHALL be created with appropriate public/private access rules
2. THE System SHALL accept image and video uploads to Supabase Storage as an alternative to Cloudinary
3. THE file upload endpoint SHALL maintain support for Cloudinary while adding Supabase Storage capability
4. WHEN a file is uploaded to Supabase Storage, THE System SHALL generate and store the public URL in the database
5. THE System SHALL implement Row Level Security (RLS) policies so users can only access their own files

### Requirement 5: Real-time Subscriptions

**User Story:** As a product manager, I want to enable real-time features using Supabase, so that users see live updates for community posts, orders, and products without polling.

#### Acceptance Criteria

1. WHEN a community post is created or updated, THE System SHALL broadcast changes to all subscribed clients in real-time
2. WHEN an order status changes, THE System SHALL notify the relevant user and farmer in real-time
3. WHEN a new comment is added to a community post, THE System SHALL notify post author and other subscribers in real-time
4. THE real-time subscriptions SHALL use Supabase's WebSocket connection through the Supabase client
5. WHEN a user disconnects, THE System SHALL gracefully close subscriptions without memory leaks

### Requirement 6: Environment Configuration

**User Story:** As a DevOps engineer, I want to configure all Supabase credentials in environment variables, so that the application can connect to Supabase and maintain security.

#### Acceptance Criteria

1. THE backend/.env file SHALL include SUPABASE_URL pointing to the Supabase project URL
2. THE backend/.env file SHALL include SUPABASE_ANON_KEY for client-side Supabase authentication
3. THE backend/.env file SHALL include SUPABASE_SERVICE_KEY for server-side database operations with elevated privileges
4. THE backend/.env file SHALL maintain existing Cloudinary, JWT, and API keys
5. WHEN the application starts, THE System SHALL validate that all required Supabase environment variables are present

### Requirement 7: Data Migration Script

**User Story:** As a backend engineer, I want a data migration script that transfers existing MongoDB data to Supabase, so that historical data is preserved during the migration.

#### Acceptance Criteria

1. THE migration script SHALL connect to MongoDB and extract all collections (users, products, orders, community posts, comments, likes, AI suggestions)
2. THE migration script SHALL transform MongoDB documents (ObjectIds, nested objects) into Supabase-compatible PostgreSQL records (UUIDs, JSONB)
3. THE migration script SHALL handle data type conversions (MongoDB arrays to PostgreSQL arrays, nested objects to JSONB)
4. THE migration script SHALL maintain referential integrity by mapping MongoDB ObjectIds to Supabase UUIDs
5. WHEN the migration completes, THE System SHALL validate that all records were transferred correctly
6. THE migration script SHALL support dry-run mode to preview changes before execution

### Requirement 8: Backward Compatibility

**User Story:** As a frontend engineer, I want the API to maintain backward compatibility during migration, so that the frontend can continue functioning without changes during the transition period.

#### Acceptance Criteria

1. ALL existing API endpoints SHALL continue working with the same request/response format after migration
2. WHEN the frontend sends user IDs (MongoDB ObjectIds), THE System SHALL translate them to Supabase UUIDs transparently
3. THE authentication flow SHALL work with existing JWT tokens stored in local storage
4. ALL existing validation rules and business logic SHALL be preserved
5. WHEN test data references MongoDB ObjectIds in responses, THE System SHALL continue to return the same format for backward compatibility

### Requirement 9: Error Handling and Rollback

**User Story:** As a release manager, I want error handling and rollback procedures for the migration, so that the system can recover from migration failures without data loss.

#### Acceptance Criteria

1. WHEN a database connection fails, THE System SHALL log the error and attempt reconnection with exponential backoff
2. WHEN a Supabase API call fails, THE System SHALL return descriptive error messages without exposing sensitive information
3. IF the migration script encounters orphaned records or constraint violations, THE System SHALL halt and report the issue with recommendations
4. THE migration process SHALL create database backups before making schema changes
5. IF migration fails, operators SHALL be able to rollback to MongoDB without data loss

### Requirement 10: Testing and Validation

**User Story:** As a QA engineer, I want comprehensive test coverage for the migration, so that data integrity and functionality are verified before deployment.

#### Acceptance Criteria

1. THE migration SHALL be tested with a copy of production data before executing on live database
2. ALL CRUD operations (Create, Read, Update, Delete) SHALL work correctly with Supabase
3. ALL relationships (foreign keys, cascading deletes) SHALL be validated
4. WHEN comparing pre- and post-migration data, THE System SHALL verify that no records were lost or corrupted
5. THE authentication flow SHALL be tested with both JWT tokens and Supabase sessions
6. ALL existing automated tests SHALL pass with Supabase backend
7. WHEN real-time subscriptions are triggered, THE System SHALL deliver updates within 200ms

