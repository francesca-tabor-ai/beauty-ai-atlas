# Beauty × AI Atlas

Exploring the intersection of beauty and artificial intelligence.

## Tech Stack

- **Next.js 15** - App Router with TypeScript (strict mode)
- **Supabase JS v2** - Database and authentication
- **shadcn/ui** - UI component library
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **next-themes** - Theme management
- **Zod** - Schema validation
- **ESLint + Prettier** - Code quality

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase database:
   - Create a project at [supabase.com](https://supabase.com)
   - Run `supabase/schema.sql` in SQL Editor
   - Run `supabase/seed.sql` to add sample data
   - See `supabase/README.md` for detailed instructions

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The project uses a graph-native Supabase schema with interconnected entities:

- **Entities**: brands, use_cases, ai_specialisms, job_roles, projects, timeline_events, learning_paths
- **Graph**: edges table connects all entities with relationship types
- **See**: `SCHEMA.md` for quick reference, `supabase/README.md` for setup details

## Project Structure

```
/app
  /(public)          # Public routes
    /brands/[slug]
    /use-cases/[slug]
    /ai/[slug]
    /jobs/[slug]
    /projects/[slug]
    /timeline
    /paths/[slug]
    /map
  /admin             # Admin routes
    /brands
    /use-cases
    /edges
/components
  /ui                # shadcn/ui components
  /layout            # Layout components
  /entities          # Entity-specific components
/lib
  /supabase          # Supabase client configuration
  /graph             # Graph utilities
  /utils             # Utility functions
/scripts             # Build and data scripts
/data                # Static data files
/supabase            # Database schema and seed data
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT

