# Changelog

## [Unreleased]

### Added
- ✅ Next.js 15 App Router with TypeScript (strict mode)
- ✅ Supabase JS v2 client configuration
- ✅ shadcn/ui + Tailwind CSS v4 setup
- ✅ Complete graph-native database schema
  - 7 entity tables (brands, use_cases, ai_specialisms, job_roles, projects, timeline_events, learning_paths)
  - Graph edges table for relationships
  - Enums for entity types and relation types
  - Comprehensive indexes for performance
- ✅ Seed data (3 entities of each type, 20 graph edges)
- ✅ Row Level Security (RLS) policies
  - Public read access (published entities only)
  - Admin full access (role-based)
  - Special edge visibility rules (both endpoints must be published)
- ✅ TypeScript types for all database entities
- ✅ GitHub Actions workflows (CI/CD, Vercel deployment, GitHub Pages)
- ✅ Complete documentation
  - README.md
  - INSTALLATION.md
  - DEPLOYMENT.md
  - SCHEMA.md
  - supabase/README.md
  - supabase/SETUP.md

### Fixed
- ✅ Next.js 15 async params in dynamic routes
- ✅ Tailwind CSS v4 configuration (@theme block)
- ✅ PostCSS configuration for Tailwind v4
- ✅ React 19 compatibility (updated lucide-react, next-themes)

### Security
- ✅ Row Level Security enabled on all tables
- ✅ Public users can only read published content
- ✅ Admin role-based access control
- ✅ Edge visibility validation

## Next Steps
- [ ] Build graph visualization components
- [ ] Create admin dashboard UI
- [ ] Implement entity detail pages
- [ ] Add search and filtering
- [ ] Build learning path viewer
- [ ] Create timeline visualization

