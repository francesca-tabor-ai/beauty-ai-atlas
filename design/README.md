# Design System

This directory contains the complete design system for Beauty × AI Atlas.

## Files

- **`tokens.json`** - Design tokens in JSON format (for design tools, style dictionaries)
- **`tokens.css`** - CSS custom properties (CSS variables) for direct use in stylesheets
- **`../docs/BRAND_GUIDELINES.md`** - Complete brand guidelines document

## Usage

### CSS Variables

Import the tokens CSS file in your main stylesheet:

```css
@import "../design/tokens.css";
```

Then use the variables in your CSS:

```css
.headline {
  font-family: var(--font-headline);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-black);
}

.button-primary {
  background-color: var(--color-rose);
  color: var(--color-white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--font-size-button);
  font-weight: var(--font-weight-semibold);
}
```

### Tailwind Integration

The design tokens can be integrated into Tailwind CSS configuration. See `tailwind.config.ts` for integration.

### JSON Tokens

The `tokens.json` file can be used with:
- Design tools (Figma, Sketch)
- Style dictionary generators
- Design token transformers
- Documentation generators

## Font Loading

The brand fonts are loaded in `app/layout.tsx`:
- **Playfair Display** - Headlines
- **Inter** - Body text

Both fonts are loaded via Next.js Google Fonts optimization.

## Color Accessibility

All color combinations in the design system meet WCAG AA standards:
- Text on light backgrounds: Black (#000000) or Charcoal (#1A1A1A)
- Text on dark backgrounds: White (#FFFFFF)
- Accent colors: Use for CTAs and highlights, not for body text

## Spacing System

The spacing system uses an 8pt base:
- `--space-1` = 4px
- `--space-2` = 8px
- `--space-4` = 16px
- `--space-6` = 24px
- etc.

Use spacing tokens consistently throughout the application.

## Typography Scale

The typography system includes:
- **Headlines (H1-H3)**: Playfair Display
- **Body & UI (H4-H6, body, buttons)**: Inter

Each style includes size, weight, line-height, and letter-spacing values.

## Updates

When updating design tokens:
1. Update `tokens.json`
2. Regenerate `tokens.css` (or update manually)
3. Update `BRAND_GUIDELINES.md` if needed
4. Test changes across the application

---

For complete brand guidelines, see [BRAND_GUIDELINES.md](../docs/BRAND_GUIDELINES.md).

