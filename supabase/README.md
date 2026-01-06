# Supabase Schema for Beauty × AI Atlas

This directory contains the database schema and seed data for the Beauty × AI Atlas knowledge platform.

## Files

- `schema.sql` - Complete database schema with tables, enums, indexes, and triggers
- `seed.sql` - Sample data (3 entities of each type, 20 graph edges)
- `rls-policies.sql` - Row Level Security policies (public read, admin full access)
- `test-schema.sql` - Validation queries for schema
- `test-rls.sql` - Test queries for RLS policies

## Setup Instructions

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run `schema.sql` first (creates tables, enums, indexes)
4. Then run `seed.sql` to populate with sample data
5. Finally run `rls-policies.sql` to enable Row Level Security
6. (Optional) Run `test-schema.sql` and `test-rls.sql` to validate

### Option 2: Supabase CLI

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or run SQL files directly
supabase db execute -f supabase/schema.sql
supabase db execute -f supabase/seed.sql
supabase db execute -f supabase/rls-policies.sql
```

### Option 3: Direct SQL Execution

1. Copy the contents of `schema.sql`
2. Paste into Supabase SQL Editor
3. Execute
4. Repeat for `seed.sql`

## Schema Overview

### Entities

1. **brands** - Beauty brands and companies
2. **use_cases** - AI use cases in beauty industry
3. **ai_specialisms** - AI technology specializations
4. **job_roles** - Job roles in beauty AI
5. **projects** - Real-world AI projects
6. **timeline_events** - Historical events and milestones
7. **learning_paths** - Educational pathways

### Graph Relationships

The **edges** table connects all entities in a graph structure:

- **from_type** / **from_id** - Source entity
- **to_type** / **to_id** - Target entity
- **relation_type** - Type of relationship (implements, enables, transforms, etc.)
- **strength** - Relationship weight (1-5)
- **metadata** - Additional context

### Relationship Types

- `implements` - Entity implements/uses another
- `enables` - Entity enables another
- `transforms` - Entity transforms another
- `requires` - Entity requires another
- `influences` - Entity influences another
- `demonstrates` - Entity demonstrates another
- `includes` - Entity includes another
- `related_to` - General relationship

## Querying the Graph

### Find all connections from a brand

```sql
SELECT 
  e.relation_type,
  e.to_type,
  e.to_id,
  e.strength
FROM edges e
WHERE e.from_type = 'brands' 
  AND e.from_id = (SELECT id FROM brands WHERE slug = 'loreal')
  AND e.published = true;
```

### Find all entities that require computer vision

```sql
SELECT 
  e.from_type,
  e.from_id,
  e.relation_type
FROM edges e
WHERE e.to_type = 'ai_specialisms'
  AND e.to_id = (SELECT id FROM ai_specialisms WHERE slug = 'computer-vision')
  AND e.relation_type = 'requires'
  AND e.published = true;
```

### Get full graph for a learning path

```sql
SELECT 
  e.relation_type,
  e.to_type,
  e.to_id,
  e.strength,
  e.metadata
FROM edges e
WHERE e.from_type = 'learning_paths'
  AND e.from_id = (SELECT id FROM learning_paths WHERE slug = 'ai-beauty-fundamentals')
  AND e.published = true
ORDER BY (e.metadata->>'order')::int;
```

## Indexes

The schema includes optimized indexes for:

- **Slug lookups** - Fast entity retrieval by slug
- **Published filtering** - Quick access to published content
- **Tag searches** - GIN indexes for array searches
- **Graph queries** - Bidirectional edge lookups
- **Category/type filtering** - Common filter patterns

## Row Level Security (RLS)

The database uses RLS to control access:

- **Public users**: Can only SELECT published entities (`published = true`)
- **Admin users**: Full CRUD access (identified by `auth.jwt()->>'role' = 'admin'`)
- **Edges**: Only visible if both connected entities are published

### Setting Up Admin Users

To grant admin access to a user:

1. **Via Supabase Dashboard**:
   - Go to Authentication > Users
   - Select the user
   - Edit `raw_app_meta_data`: `{"role": "admin"}`

2. **Via SQL**:
   ```sql
   UPDATE auth.users 
   SET raw_app_meta_data = jsonb_build_object('role', 'admin')
   WHERE email = 'admin@example.com';
   ```

3. **Via Supabase Admin API**:
   Use the admin API to update user metadata with `role: 'admin'`

### Testing RLS

Run `test-rls.sql` to verify:
- RLS is enabled on all tables
- Policies are correctly configured
- Public users can only see published content
- Edge visibility works correctly

## Next Steps

1. Run the schema, seed data, and RLS policies
2. Verify data in Supabase dashboard
3. Test RLS with `test-rls.sql`
4. Set up admin users
5. Test graph queries
6. Integrate with Next.js app using Supabase client
7. Build graph visualization components

