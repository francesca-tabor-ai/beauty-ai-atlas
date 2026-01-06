# Quick Setup Guide

## Complete Database Setup (3 Steps)

### Step 1: Create Schema
Run `schema.sql` in Supabase SQL Editor
- Creates all tables, enums, indexes, and triggers
- Sets up the graph structure

### Step 2: Add Seed Data
Run `seed.sql` in Supabase SQL Editor
- Adds 3 entities of each type (21 total)
- Adds 20 realistic graph edges
- All data is published = true

### Step 3: Enable Security
Run `rls-policies.sql` in Supabase SQL Editor
- Enables Row Level Security on all tables
- Sets up public read (published only) and admin full access
- Configures edge visibility rules

## Verification

### Test Schema
```sql
-- Run test-schema.sql
-- Should show: 3 entities per type, 20 edges, no orphaned edges
```

### Test RLS
```sql
-- Run test-rls.sql
-- Should show: 8 tables with RLS enabled, 16 policies, 2 helper functions
```

## Admin Setup

After RLS is enabled, set up your first admin user:

```sql
-- Replace with your email
UPDATE auth.users 
SET raw_app_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'your-email@example.com';
```

## Troubleshooting

### "Permission denied" errors
- Make sure RLS policies are applied
- Check that entities are published = true
- Verify admin role is set correctly

### Edges not visible
- Both connected entities must be published
- Edge itself must be published
- Run `both_endpoints_published()` function to check

### Admin access not working
- Verify JWT contains role: 'admin' in raw_app_meta_data
- Check that user is authenticated
- Test with `SELECT is_admin();`

