# Product Context — tripX

## Register
product

## Users
- **Primary**: Single operator managing shared group expenses during outings
- **Context**: Recording expenses in real-time during trips (restaurants, activities, transport)
- **Skill level**: Non-technical; expects consumer app simplicity
- **Device**: iPhone (iOS-first), personal device
- **Usage pattern**: Intermittent bursts during group activities, quick glances for entry

## Product Purpose
Offline-first expense tracker for group outings. One person records all expenses for the group, then finalizes to produce net balances and simplified settlement transfers. The app prioritizes correct math, fast entry, and dispute resolution via transparent item-level records.

## Brand
- **Tone**: Practical, trustworthy, unobtrusive
- **Voice**: Direct, no-nonsense helper — not a companion, not playful, not corporate
- **Personality**: Quiet competence; stays out of the way until needed
- **Register alignment**: Product utility over brand expression

## Key Product Principles
1. **Correctness first**: Math must be verifiable; structured data over notes
2. **Fast capture**: Optimize for speed during active outings (modal flows, smart defaults)
3. **Transparent truth**: Expense list is the dispute-resolution surface; never hide details
4. **Explicit state**: Draft vs finalized is always clear; no accidental edits post-settlement
5. **Offline-only v1**: No sync, no cloud, no auth — pure local utility

## Anti-references
- Not a social app (no feeds, no sharing mechanics)
- Not gamified (no streaks, badges, or celebration)
- Not a fintech product (no bank connections, no payment processing)
- Not collaborative (single-user in v1, no real-time co-editing)
- Not a receipt scanner (no OCR, no automatic parsing)

## Semantic Color Roles
- **Green** (`--sf-green`): Positive net balance ("should receive" / credit)
- **Red** (`--sf-red`): Negative net balance ("owes" / debt)
- **Blue** (`--sf-blue`): Primary actions (buttons, links)
- **Gray** (`--sf-gray`): Neutral, disabled states

These roles are **functional**, not decorative — green/red only appear with money.

## Copy Principles
- Every label earns its place
- No placeholder text that restates the label
- No em dashes or `--` separators
- Error messages explain consequence + remedy
- "Finalize" over "Close", "Net" over "Balance Due"

## Scene Sentence
Operator entering expenses mid-outing — daylight or indoor lighting, quick glances between conversations, occasional need to show the screen to group members for verification. Light theme default serves this primary context.
