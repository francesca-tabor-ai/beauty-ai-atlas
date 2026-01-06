# Database Schema Quick Reference

## Entity Tables

| Table | Key Fields | Relationships |
|-------|-----------|---------------|
| `brands` | name, category, founded_year, tags | Connects to projects, use_cases |
| `use_cases` | title, category, maturity_level, impact_score | Requires ai_specialisms |
| `ai_specialisms` | name, category, maturity_timeline | Required by use_cases, projects, job_roles |
| `job_roles` | title, ai_impact_level, emerging, skills_required | Requires ai_specialisms |
| `projects` | title, business_case, prd, maturity | Implements use_cases |
| `timeline_events` | year, month, event_type, significance | Influences brands, use_cases |
| `learning_paths` | title, difficulty, duration_hours, steps | Includes other entities |

## Graph Relationships (Edges)

The `edges` table connects all entities:

```sql
edges (
  from_type: entity_type_enum,
  from_id: uuid,
  to_type: entity_type_enum,
  to_id: uuid,
  relation_type: relation_type_enum,
  strength: 1-5,
  metadata: jsonb
)
```

### Relation Types

- `implements` - Entity implements/uses another
- `enables` - Entity enables another
- `transforms` - Entity transforms another
- `requires` - Entity requires another (dependency)
- `influences` - Entity influences another
- `demonstrates` - Entity demonstrates another
- `includes` - Entity includes another (composition)
- `related_to` - General relationship

## Common Queries

### Get all connections from an entity

```sql
SELECT * FROM edges 
WHERE from_type = 'brands' 
  AND from_id = (SELECT id FROM brands WHERE slug = 'loreal')
  AND published = true;
```

### Find what requires a specific AI specialism

```sql
SELECT * FROM edges 
WHERE to_type = 'ai_specialisms'
  AND to_id = (SELECT id FROM ai_specialisms WHERE slug = 'computer-vision')
  AND relation_type = 'requires';
```

### Get learning path steps in order

```sql
SELECT * FROM edges 
WHERE from_type = 'learning_paths'
  AND from_id = (SELECT id FROM learning_paths WHERE slug = 'ai-beauty-fundamentals')
ORDER BY (metadata->>'order')::int;
```

### Find related entities (bidirectional)

```sql
-- Forward
SELECT * FROM edges WHERE from_id = $1 AND from_type = $2
UNION ALL
-- Reverse
SELECT * FROM edges WHERE to_id = $1 AND to_type = $2;
```

## Indexes

All tables have indexes on:
- `slug` (unique lookups)
- `published` (filtering)
- `tags` (GIN index for array searches)

Edges table has:
- `(from_type, from_id)` - Fast forward lookups
- `(to_type, to_id)` - Fast reverse lookups
- `(from_type, from_id, to_type, to_id)` - Bidirectional queries

## Validation

The schema includes:
- ✅ Foreign key validation via triggers
- ✅ Self-reference prevention
- ✅ Unique relationship constraints
- ✅ Enum type safety
- ✅ Automatic `updated_at` triggers

## Seed Data

- 3 brands (L'Oréal, Estée Lauder, Glossier)
- 3 use cases (Virtual Try-On, Skin Diagnostics, Personalized Recommendations)
- 3 AI specialisms (Computer Vision, Generative AI, Recommendation Systems)
- 3 job roles (AI Beauty Scientist, Personalization Engineer, AR Developer)
- 3 projects (ModiFace Integration, Skin AI Diagnostic, Personalized Skincare)
- 3 timeline events (ModiFace Acquisition, GPT Beauty Content, EU AI Act)
- 3 learning paths (Fundamentals, Computer Vision, Career Path)
- 20 edges connecting them realistically

