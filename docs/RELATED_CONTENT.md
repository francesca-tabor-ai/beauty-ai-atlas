# Related Content Engine

The related content engine discovers and displays entities connected through the graph edges table.

## Architecture

### Core Function: `getRelatedEntities()`

**Location:** `/lib/graph/getRelated.ts`

**How it works:**

1. **Query Edges**: Fetches all published edges where the entity is either source or target
   ```sql
   SELECT * FROM edges 
   WHERE published = true 
   AND (
     (from_type = 'brands' AND from_id = '...') OR
     (to_type = 'brands' AND to_id = '...')
   )
   ```

2. **Group by Type**: Organizes edges by the "other" entity type
   - If edge goes FROM current entity → target is related
   - If edge goes TO current entity → source is related

3. **Batch Fetch**: One query per entity type (avoids N+1)
   ```sql
   SELECT id, slug, name FROM brands 
   WHERE id IN (uuid1, uuid2, uuid3) 
   AND published = true
   ```

4. **Return Grouped**: Returns structured data grouped by entity type

### Component: `RelatedContent`

**Location:** `/components/graph/RelatedContent.tsx`

**Features:**
- Server Component (fetches data server-side)
- Groups related entities by type
- Displays as clickable badges/chips
- Shows relation type on hover
- Links to detail pages
- Returns null if no related content

## Performance Optimizations

1. **Single Edge Query**: One query to get all connected edges
2. **Batch Entity Fetching**: One query per entity type (max 7 queries total)
3. **Indexed Lookups**: Uses indexed `id` and `published` columns
4. **Server-Side Rendering**: No client-side data fetching

## Usage

### In Detail Pages

```tsx
import { RelatedContent } from "@/components/graph/RelatedContent";

export default async function EntityPage({ params }) {
  const entity = await getEntity();
  
  return (
    <article>
      {/* Entity content */}
      
      <div className="mt-12 pt-8 border-t">
        <RelatedContent 
          entityType="brands" 
          entityId={entity.id} 
        />
      </div>
    </article>
  );
}
```

### Direct Function Usage

```tsx
import { getRelatedEntities } from "@/lib/graph/getRelated";
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const related = await getRelatedEntities(
  supabase,
  "brands",
  brandId
);

// Access grouped results
related.brands.forEach(brand => {
  console.log(brand.title, brand.relation);
});
```

## Return Structure

```typescript
{
  brands: [
    {
      id: "uuid",
      slug: "loreal",
      title: "L'Oréal",
      relation: "implements",
      relationStrength: 5
    }
  ],
  use_cases: [...],
  ai_specialisms: [...],
  // ... etc
}
```

## Relation Types

- `implements` - Entity implements/uses another
- `enables` - Entity enables another
- `transforms` - Entity transforms another
- `requires` - Entity requires another
- `influences` - Entity influences another
- `demonstrates` - Entity demonstrates another
- `includes` - Entity includes another
- `related_to` - General relationship

## Integration Status

- ✅ Brands detail page (`/brands/[slug]`)
- ⏳ Other entity types (use same pattern)

## Future Enhancements

- Filter by relation type
- Sort by relation strength
- Limit number of results per type
- Show relationship direction (incoming/outgoing)

