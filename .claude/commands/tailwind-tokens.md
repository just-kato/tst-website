# Title: Tailwind Tokens Map

## Description

Read tailwind.config.{js,ts} and output a compact token map for colors, font families/sizes, spacing, radii, borders, and shadows.

## Inputs

- format (optional): string ("markdown" | "json"), default "markdown"

## Instructions

1. Open `tailwind.config.js` or `tailwind.config.ts` in the workspace root.
2. Read `theme` and `theme.extend`. Collect tokens for:
   - colors (flatten nested objects to token paths, e.g., `brand.600`)
   - fontFamily
   - fontSize (include [size, {lineHeight, letterSpacing}] where present)
   - spacing
   - borderRadius
   - borderWidth
   - boxShadow
3. If tokens reference CSS variables, report the variable name (and any default fallbacks seen in the config or CSS files).
4. Output as {{format}}. If "markdown", render a readable table per category.

If the file is missing, say so and stop.
