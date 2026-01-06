# Entity List & Detail Pattern

Reusable pattern for creating entity pages (list + detail views).

## Components

### `/components/entities/EntityCard.tsx`
Reusable card component for list views:
- Title
- Description (truncated to 150 chars)
- Category badge
- Tags (shows first 3, +count for more)
- Hover effects
- Links to detail page

### `/components/entities/EntityHeader.tsx`
Header component for detail pages:
- Large title (h1)
- Category, dates, metadata
- Tags as badges
- Responsive layout

### `/components/entities/EmptyState.tsx`
Empty state when no results found:
- Icon
- Title and description
- Customizable

### `/components/entities/FilterBadge.tsx`
Filter badge with remove functionality:
- Shows active filters
- Clickable to remove filter
- Accessible

## Page Pattern

### List Page: `/app/(public)/[entity]/page.tsx`

```tsx
import { createClient } from "@/lib/supabase/server";
import { getPublishedEntities, searchEntities } from "@/lib/supabase/queries";
import { EntityCard } from "@/components/entities/EntityCard";
import { EmptyState } from "@/components/entities/EmptyState";
import { FilterBadge } from "@/components/entities/FilterBadge";

interface EntityPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function EntityPage({ searchParams }: EntityPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch entities with filters
  let entities;
  if (params.search) {
    entities = await searchEntities(supabase, "table_name", params.search);
  } else {
    entities = await getPublishedEntities(supabase, "table_name", {
      category: params.category,
      tags: params.tag ? [params.tag] : undefined,
      published: true,
    });
  }

  // Build filter URLs
  const buildFilterUrl = (excludeKey: string) => {
    // ... build URL without excluded filter
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1>Entity Name</h1>
        <p>Description</p>
      </div>

      {/* Active Filters & Count */}
      <div className="mb-6">
        <div>{entities.length} found</div>
        {/* Active filters */}
      </div>

      {/* Results */}
      {entities.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <EntityCard
              key={entity.id}
              title={entity.title || entity.name}
              description={entity.description}
              slug={entity.slug}
              href={`/[entity]/${entity.slug}`}
              tags={entity.tags}
              category={entity.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Detail Page: `/app/(public)/[entity]/[slug]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";
import { EntityHeader } from "@/components/entities/EntityHeader";
import type { Metadata } from "next";

interface EntityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EntityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const entity = await getEntityBySlug(supabase, "table_name", slug);

  if (!entity || !entity.published) {
    return { title: "Not Found" };
  }

  return {
    title: `${entity.title || entity.name} | Beauty × AI Atlas`,
    description: entity.description,
  };
}

export default async function EntityPage({ params }: EntityPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const entity = await getEntityBySlug(supabase, "table_name", slug);

  if (!entity || !entity.published) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <EntityHeader
          title={entity.title || entity.name}
          category={entity.category}
          tags={entity.tags}
          createdAt={entity.created_at}
          updatedAt={entity.updated_at}
        />

        {/* Description */}
        {entity.description && (
          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <p>{entity.description}</p>
          </div>
        )}

        {/* Placeholder for Related Content */}
        <div className="mt-12 pt-8 border-t">
          <h2>Related Content</h2>
          {/* Related entities will appear here */}
        </div>
      </article>
    </div>
  );
}
```

## Features

### List Page
- ✅ Server Component
- ✅ Fetches published entities
- ✅ URL params: `?search=term&tag=value&category=value`
- ✅ Grid of cards
- ✅ Shows count and active filters
- ✅ Empty state if no results
- ✅ Filter badges with remove links

### Detail Page
- ✅ Server Component
- ✅ Fetches by slug
- ✅ Returns `notFound()` if missing/unpublished
- ✅ SEO metadata with `generateMetadata()`
- ✅ Title, metadata, description
- ✅ Placeholder for related content
- ✅ Prose styling for content

## Usage Example

See `/app/(public)/brands/` for a complete implementation:
- `/app/(public)/brands/page.tsx` - List page
- `/app/(public)/brands/[slug]/page.tsx` - Detail page

## Reusing for Other Entities

To create pages for other entities (use_cases, ai_specialisms, etc.):

1. Copy the brands pages
2. Replace `"brands"` with the entity table name
3. Update the title and description
4. Adjust metadata fields as needed
5. Update the href paths

The pattern is fully reusable across all entity types!

