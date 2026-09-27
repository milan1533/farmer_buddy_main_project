# Supabase Migration Implementation Guide

## Quick Reference

This guide helps developers execute the Supabase migration tasks efficiently.

---

## Task Execution Order

### Wave 0: Project Setup (15-25 min)
1. **1.1**: Create Supabase project
2. **1.2**: Update .env with credentials

### Wave 1: Database Schema (50 min)
3. **2.1**: Create tables and constraints
4. **2.2**: Add foreign keys with cascades
5. **2.3**: Create performance indexes

### Wave 2: Security (40 min)
6. **3.1**: Configure Row Level Security (RLS)
7. **3.2**: Create Storage bucket

### Wave 3: Backend Infrastructure (60 min)
8. **4.1**: Supabase client initialization
9. **4.2**: ID mapper utilities
10. **4.3**: Response formatter utilities
11. **4.4**: Dual authentication middleware

### Wave 4: Data Access Layer (115 min)
12. **5.1**: Users query layer
13. **5.2**: Products query layer
14. **5.3**: Orders query layer
15. **5.4**: Community features query layer
16. **5.5**: AI suggestions query layer

### Wave 5: Authentication (45 min)
17. **6.1**: Auth controller refactoring
18. **6.2**: Update routes for dual auth

### Wave 6: Data Migration (100 min)
19. **7.1**: Migration script
20. **7.2**: Validation script
21. **7.3**: Data type converter utilities

### Wave 7: Real-time Features (45 min)
22. **8.1**: Real-time subscription handlers
23. **8.2**: Controller integration

### Wave 8: Testing (180 min)
24. **9.1**: Unit tests (45 min)
25. **9.2**: Integration tests (50 min)
26. **9.3**: Property-based tests (60 min)
27. **9.4**: Migration testing (30 min)
28. **9.5**: Backward compatibility (25 min)

### Wave 9: Deployment (50 min)
29. **10.1**: Backup & recovery procedure
30. **10.2**: Migration checklist
31. **10.3**: Final checkpoint

---

## Key Implementation Patterns

### 1. Supabase Query Layer Pattern

All query layer files follow this structure:

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
  
  async create(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
```

### 2. Middleware Pattern

```javascript
const dualAuthMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from header/cookie
    const token = getToken(req)
    
    // 2. Try JWT first
    let userId = tryJwtValidation(token)
    
    // 3. Fall back to Supabase
    if (!userId) {
      userId = await trySupabaseValidation(token)
    }
    
    // 4. Set on request
    req.id = userId
    
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' })
  }
}
```

### 3. ID Mapping Pattern

```javascript
// When receiving request with ObjectId
const userId = normalizeId(req.body.userId) // ObjectId or UUID → UUID

// When returning response
const formatted = formatResponse(data) // UUID stays as UUID
```

---

## Environment Variables

### Required for Supabase Connection

```env
# Supabase credentials (from https://app.supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Migration control
DB_MODE=mongodb                    # Switch to 'supabase' after migration
DUAL_MODE_ENABLED=false            # Enable after initial migration
```

### Keep Existing Variables

```env
MONGO_URL=mongodb://localhost:27017/farmer-buddy
JWT_SECRET=your-secret-key
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

---

## Common Tasks

### Running Unit Tests

```bash
# All tests
npm test

# Specific test file
npm test -- backend/tests/supabase.test.js

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Running Migration Script

```bash
# Dry run (preview changes)
npm run migrate -- --dry-run

# Actual migration
npm run migrate

# With validation
npm run migrate && npm run validate
```

### Verifying Supabase Connection

```javascript
import { initSupabase } from './config/supabase.js'

// In your app startup
const connected = await initSupabase()
if (connected) {
  console.log('✓ Supabase connected')
} else {
  console.log('✗ Supabase connection failed')
}
```

---

## Debugging Guide

### Issue: "Supabase connection failed"

**Cause**: Invalid credentials
**Solution**: 
1. Verify SUPABASE_URL is correct format
2. Verify SUPABASE_SERVICE_KEY is not truncated
3. Test credentials in Supabase SQL editor first

### Issue: "Foreign key constraint violation"

**Cause**: Orphaned records or incorrect mapping
**Solution**:
1. Run validation script to identify orphaned records
2. Check ID mapping is working correctly
3. Verify all parent records exist before inserting children

### Issue: "RLS policy denies access"

**Cause**: User ID doesn't match policy
**Solution**:
1. Verify `auth.uid()` is being used correctly in policies
2. Verify user IDs are UUIDs (not ObjectIds)
3. Check policy conditions match actual data

### Issue: "Real-time subscription not firing"

**Cause**: Subscription not established or data not changing
**Solution**:
1. Verify subscription is created before change
2. Check Supabase dashboard for real-time activity
3. Verify Socket.io is connected on frontend

---

## Testing Checklist

Before deploying to production:

- [ ] All unit tests pass (npm test)
- [ ] All integration tests pass
- [ ] Property-based tests pass (100+ iterations)
- [ ] Migration script runs successfully on staging
- [ ] Validation script shows zero errors
- [ ] Backward compatibility tests pass
- [ ] Real-time features tested end-to-end
- [ ] Load testing on expected query volume
- [ ] RLS policies tested with different user roles
- [ ] Backup/restore procedure tested

---

## Performance Targets

| Operation | Target | How to Measure |
|-----------|--------|---|
| User login | < 500ms | `time curl -X POST /api/auth/login` |
| Product search | < 200ms | Query latency in Supabase dashboard |
| Order creation | < 800ms | Include validation + DB insert |
| Post fetch (with comments) | < 300ms | N+1 query test |
| Real-time notification | < 200ms | WebSocket event timestamp comparison |
| Full data migration | < 30min | Migration script execution time |

---

## Rollback Procedure

If something goes wrong:

1. **Stop the migration immediately**
   ```bash
   DB_MODE=mongodb
   DUAL_MODE_ENABLED=false
   ```

2. **Revert to MongoDB**
   - Restart backend with MongoDB connection
   - No code changes needed (dual mode already supports this)

3. **Investigate the issue**
   - Check migration logs
   - Run validation script to identify problems
   - Fix root cause

4. **Create fix**
   - Update migration script
   - Test on staging again
   - Fix any data inconsistencies

5. **Retry migration**
   - Clear Supabase tables (backed up first)
   - Run corrected migration script
   - Validate thoroughly before cutover

---

## File Checklist

By end of all tasks, you should have created:

**New Files:**
- [ ] backend/config/supabase.js
- [ ] backend/utils/idMapper.js
- [ ] backend/utils/responseFormatter.js
- [ ] backend/utils/migrationHelpers.js
- [ ] backend/utils/realtimeHandler.js
- [ ] backend/middleware/dualAuthMiddleware.js
- [ ] backend/models/supabase/users.js
- [ ] backend/models/supabase/products.js
- [ ] backend/models/supabase/orders.js
- [ ] backend/models/supabase/community.js
- [ ] backend/models/supabase/ai.js
- [ ] backend/migrations/migrateData.js
- [ ] backend/migrations/validateMigration.js
- [ ] backend/migrations/001_create_schema.sql
- [ ] backend/migrations/002_setup_rls.sql
- [ ] backend/migrations/003_setup_storage.sql
- [ ] backend/tests/supabase.test.js
- [ ] backend/tests/api.integration.test.js
- [ ] backend/tests/properties.test.js
- [ ] MIGRATION_CHECKLIST.md

**Modified Files:**
- [ ] backend/.env (add Supabase credentials)
- [ ] backend/app.js (initialize Supabase)
- [ ] backend/controller/Auth.controller.js (Supabase Auth integration)

---

## Getting Help

- Review the design.md for architectural decisions
- Check requirements.md for acceptance criteria
- Look at code comments for implementation details
- Run tests to verify correctness
- Check Supabase dashboard logs for database issues

