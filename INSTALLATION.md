# Installation Guide

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

## Installation Commands

```bash
# Install all dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Additional Setup (Optional)

### Install shadcn/ui components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

## Project Structure

The project follows this structure:

```
/app
  /(public)          # Public routes
  /admin             # Admin routes
/components
  /ui                # shadcn/ui components
  /layout            # Layout components
  /entities          # Entity-specific components
/lib
  /supabase          # Supabase configuration
  /graph             # Graph utilities
  /utils             # Utility functions
/scripts             # Build and data scripts
/data                # Static data files
```

