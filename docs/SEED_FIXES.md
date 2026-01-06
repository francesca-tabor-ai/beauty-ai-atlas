# Seed Data Fixes

## Changes Made

### 1. Made All INSERT Statements Idempotent

All entity INSERT statements now use `ON CONFLICT (slug) DO UPDATE` to prevent duplicate key errors when re-running the seed script.

**Tables Updated:**
- ✅ `brands` - ON CONFLICT (slug) DO UPDATE
- ✅ `use_cases` - ON CONFLICT (slug) DO UPDATE
- ✅ `ai_specialisms` - ON CONFLICT (slug) DO UPDATE
- ✅ `job_roles` - ON CONFLICT (slug) DO UPDATE
- ✅ `projects` - ON CONFLICT (slug) DO UPDATE
- ✅ `timeline_events` - ON CONFLICT (slug) DO UPDATE
- ✅ `learning_paths` - ON CONFLICT (slug) DO UPDATE
- ✅ `edges` - ON CONFLICT (from_type, from_id, to_type, to_id, relation_type) DO UPDATE

### 2. Function Signature Verification

The `both_endpoints_published()` function in `rls-policies.sql` has the correct signature:

```sql
CREATE OR REPLACE FUNCTION both_endpoints_published(
  p_from_type entity_type_enum,
  p_from_id uuid,
  p_to_type entity_type_enum,
  p_to_id uuid
)
RETURNS boolean
```

This function is used in the RLS policy for edges and is correctly defined.

## Usage

The seed script can now be safely re-run multiple times without errors:

```sql
-- Run in Supabase SQL Editor
-- This will update existing records or insert new ones
```

## Testing

To verify the fixes work:

1. Run `seed.sql` once
2. Run `seed.sql` again - should complete without errors
3. Verify data is correct (should have same records, possibly updated)

## Notes

- All ON CONFLICT clauses update the `updated_at` timestamp
- Existing records will be updated with new values if they differ
- The seed script is now fully idempotent

