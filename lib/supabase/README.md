# Supabase Client Utilities

Production-ready Supabase client utilities for Next.js 15 App Router.

## Files

- `server.ts` - Server Components and Server Actions clients
- `client.ts` - Client Components client
- `queries.ts` - Reusable query builders
- `types.ts` - TypeScript type definitions
- `index.ts` - Barrel export

## Usage

### Server Components

```tsx
// app/brands/[slug]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const brand = await getEntityBySlug(supabase, "brands", slug);

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return <div>{brand.name}</div>;
}
```

### Client Components

```tsx
// components/BrandList.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { getPublishedEntities } from "@/lib/supabase/queries";
import { useEffect, useState } from "react";

export function BrandList() {
  const [brands, setBrands] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    getPublishedEntities(supabase, "brands", { limit: 10 })
      .then(setBrands)
      .catch(console.error);
  }, []);

  return (
    <ul>
      {brands.map((brand) => (
        <li key={brand.id}>{brand.name}</li>
      ))}
    </ul>
  );
}
```

### Server Actions (Admin)

```tsx
// app/actions/brands.ts
"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteBrand(id: string) {
  const admin = createAdminClient();
  
  const { error } = await admin
    .from("brands")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete brand: ${error.message}`);
  }

  revalidatePath("/admin/brands");
}
```

### Query Builders

#### Get Entity by Slug

```ts
import { createClient } from "@/lib/supabase/server";
import { getEntityBySlug } from "@/lib/supabase/queries";

const supabase = await createClient();
const brand = await getEntityBySlug(supabase, "brands", "loreal");
```

#### Get Published Entities

```ts
import { getPublishedEntities } from "@/lib/supabase/queries";

const brands = await getPublishedEntities(supabase, "brands", {
  category: "Luxury",
  tags: ["ai-innovation"],
  limit: 10,
  orderBy: "created_at",
  orderDirection: "desc",
});
```

#### Search Entities

```ts
import { searchEntities } from "@/lib/supabase/queries";

const results = await searchEntities(
  supabase,
  "brands",
  "L'Oréal",
  ["name", "description"]
);
```

#### Get Entity Edges

```ts
import { getEntityEdges } from "@/lib/supabase/queries";

// Get all connections from a brand
const edges = await getEntityEdges(
  supabase,
  "brands",
  brandId,
  "from" // or "to" or "both"
);
```

#### Get Related Entities

```ts
import { getRelatedEntities } from "@/lib/supabase/queries";

// Get all entities related to a brand via "implements" relationship
const related = await getRelatedEntities(
  supabase,
  "brands",
  brandId,
  "implements"
);
```

## Environment Variables

Required in `.env.local`:

```env
# Public (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Private (server-only, never expose)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ **Important**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and should only be used in Server Actions, never in Client Components.

## Type Generation

To generate real TypeScript types from your Supabase schema:

```bash
# Using Supabase CLI
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts

# Or if using local development
npx supabase gen types typescript --local > lib/supabase/types.ts
```

Then update `lib/supabase/types.ts` to use the generated `Database` type.

## Error Handling

All query functions include error handling and will:
- Log errors to console in development
- Throw descriptive error messages
- Return empty arrays/null for not found cases

## Security

- **Server Components**: Use `createClient()` - respects RLS policies
- **Client Components**: Use `createClient()` from `client.ts` - respects RLS policies
- **Server Actions (Admin)**: Use `createAdminClient()` - bypasses RLS, use with caution

All public queries automatically filter by `published = true` to respect RLS policies.

