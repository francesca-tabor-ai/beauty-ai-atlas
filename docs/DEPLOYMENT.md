# Deployment Guide

## GitHub Setup

### 1. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Beauty × AI Atlas"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `beauty-ai-atlas`
3. **Do not** initialize with README, .gitignore, or license (we already have these)

### 3. Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/beauty-ai-atlas.git
git branch -M main
git push -u origin main
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the easiest and most optimized platform for Next.js applications.

#### Setup Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `beauty-ai-atlas` repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Or use GitHub Actions** (already configured):
   - Add these secrets to your GitHub repository:
     - `VERCEL_TOKEN` - Get from [Vercel Settings > Tokens](https://vercel.com/account/tokens)
     - `VERCEL_ORG_ID` - Found in Vercel project settings
     - `VERCEL_PROJECT_ID` - Found in Vercel project settings
   - Push to `main` branch to trigger deployment

### Option 2: GitHub Pages

For static export (requires Next.js static export configuration):

1. **Update next.config.ts**:
   ```typescript
   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select source: "GitHub Actions"
   - The workflow will automatically deploy on push to `main`

3. **Add Secrets** (in GitHub repository Settings > Secrets):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option 3: Other Platforms

#### Netlify:
```bash
npm install -g netlify-cli
netlify deploy
```

#### Railway:
- Connect GitHub repository
- Add environment variables
- Deploy automatically

## Environment Variables

Make sure to set these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## CI/CD

The project includes GitHub Actions workflows:

- **`.github/workflows/ci.yml`** - Runs linting and builds on every push/PR
- **`.github/workflows/deploy-vercel.yml`** - Deploys to Vercel on push to main
- **`.github/workflows/deploy-pages.yml`** - Deploys to GitHub Pages on push to main

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version (20+)
- Check for TypeScript errors: `npm run lint`

### Deployment Issues
- Ensure secrets are properly configured
- Check build logs in GitHub Actions
- Verify Next.js version compatibility

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key from Settings > API

### 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Run `supabase/schema.sql` first (creates tables, enums, indexes)
3. Then run `supabase/seed.sql` (adds sample data)
4. Optionally run `scripts/test-schema.sql` to validate

### 3. Verify Data

Check that you have:
- 3 brands, 3 use cases, 3 AI specialisms, 3 job roles, 3 projects, 3 timeline events, 3 learning paths
- 20 edges connecting entities
- All published = true

### 4. Set Up Row Level Security (Optional)

For production, configure RLS policies in Supabase:

```sql
-- Example: Allow public read access to published entities
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON brands FOR SELECT USING (published = true);

-- Repeat for other tables...
```

## Next Steps

1. ✅ Set up your Supabase project and run schema
2. ✅ Configure environment variables
3. ✅ Push to GitHub
4. ✅ Deploy to your chosen platform
5. ✅ Test the deployed application
6. ✅ Build graph visualization components using the edge data

