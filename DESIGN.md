# Design System — tripX

## Color Strategy
**Restrained**: Tinted neutrals + functional accents (green/red for money only, blue for actions). No decorative color. The app's visual character comes from spatial rhythm and typography hierarchy, not color saturation.

## Theme
Light v1. Dark mode deferred but designed-in via `light-dark()` tokens — flipping `color-scheme` in v2 requires zero component rewrites.

## Color Tokens (Apple Semantic + Custom)

### Backgrounds
- `--sf-bg`: Primary background (systemBackground)
- `--sf-bg-2`: Grouped background (systemGroupedBackground)
- `--sf-surface`: Cards, elevated surfaces (secondarySystemGroupedBackground)

### Text
- `--sf-text`: Primary text (label)
- `--sf-text-2`: Secondary text (secondaryLabel)
- `--sf-text-3`: Tertiary text (tertiaryLabel)

### Accents (Functional)
- `--sf-blue`: Primary actions, links (systemBlue)
- `--sf-green`: Positive money (credit, "should receive") (systemGreen)
- `--sf-red`: Negative money (debt, "owes") (systemRed)
- `--sf-gray`: Neutral, disabled (systemGray)
- `--sf-separator`: Hairlines (separator)

All tokens use `light-dark()` for light/dark values. On iOS, `platformColor()` maps to native semantic colors. On Android/web, explicit OKLCH fallbacks.

## Typography

### Scale
- Title: 28px / 700 (SF Pro Display)
- Headline: 20px / 600 (SF Pro Text)
- Body: 17px / 400 (SF Pro Text)
- Subheadline: 15px / 400 (SF Pro Text)
- Caption: 13px / 400 (SF Pro Text)
- Money: 17px / 600 (SF Pro Text, `tabular-nums`)

### Hierarchy
Scale + weight contrast ≥1.25 ratio between levels. Avoid flat scales. Use weight strategically: 400 (body), 600 (emphasis, money), 700 (titles).

### Platform Fonts
iOS: SF Pro Text/Display (system default)
Android: Roboto fallback
Web: system-ui stack

## Spacing Scale
4, 8, 12, 16, 20, 24, 32, 40, 48

Vary for rhythm. Cards != rows != inputs. Avoid uniform padding everywhere.

## Elevation
- Cards: subtle shadow on light (0 1px 3px rgba(0,0,0,0.08))
- Modals: sheet presentation (iOS native)
- No z-index stacking beyond modals

## Components

### Button
- Primary: filled blue (`--sf-blue` bg, white text)
- Secondary: tinted (`--sf-blue` at 10% opacity bg, blue text)
- Destructive: filled red (`--sf-red` bg, white text)
- Height: 48px (iOS standard touch target)
- Haptic feedback on press (iOS)

### Card / Row
- Card: `--sf-surface` bg, 12px radius, 16px padding, shadow on light
- Row: flat, no radius, 12px vertical padding, separator hairline
- Never nest cards inside cards

### Field (Input)
- Label above input (15px subheadline, `--sf-text-2`)
- Input: 48px height, 12px radius, `--sf-bg-2` background, 12px horizontal padding
- Error slot below (13px caption, `--sf-red`)
- Focus state: 2px `--sf-blue` border

### Money
- Color by sign: green (positive), red (negative), primary text (zero)
- `fontVariant: 'tabular-nums'` for column alignment
- `selectable` for copy
- 17px / 600 weight

### EmptyState
- Icon: 48px system symbol (gray)
- Heading: 20px / 600
- Body: 15px / 400, `--sf-text-2`
- Optional CTA button below

### Banner
- Background: `--sf-blue` at 10% opacity (info), `--sf-red` at 10% opacity (warning)
- Text: 15px / 400
- Icon leading: 20px system symbol
- 12px padding, 8px radius

## Motion
- Reanimated for entering/exiting list items
- Ease-out curves (ease-out-quart)
- Duration: 200-300ms
- No bounce, no elastic, no spring

## Layout Principles
- Vary spacing for rhythm (not uniform 16px everywhere)
- Cards only where elevated surface is the best affordance
- Most lists use flat rows with separators, not cards
- Cap content width at 600px on tablet/web (centered)
- No nested cards (absolute ban)

## Accessibility
- Minimum 44x44pt touch targets (iOS HIG)
- Text contrast ≥4.5:1 (WCAG AA)
- Semantic colors accessible in both light and dark
- VoiceOver labels on icon-only buttons
- Dynamic type support (scale with system text size)

## Absolute Bans (Impeccable Laws)
- Side-stripe borders (colored `border-left`/`border-right` as accents)
- Gradient text (`background-clip: text`)
- Glassmorphism as default
- Hero-metric template (big number + gradient)
- Identical card grids
- Modal as first thought (exhaust inline alternatives)
- Em dashes in copy

## Implementation Notes
- NativeWind v5 + Tailwind v4 for styling
- Apple semantic colors via `platformColor()` on iOS
- `src/tw/` wrappers for `useCssElement` (View, Text, etc.)
- `src/css/sf.css` defines all `--sf-*` tokens
- `src/global.css` imports Tailwind + platform fonts + theme tokens
- Money formatting lives in `src/lib/money-format.ts` + `src/components/ui/Money.tsx`
