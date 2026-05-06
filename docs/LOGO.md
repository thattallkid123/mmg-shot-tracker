# MMG Logo Reference

## Source files

All master logo PNGs live in the main MMG site repo:

```
C:\Users\andyg\Desktop\cursor\mrmallorcagolf-real\public\images\logo\
```

| File | Use on |
|---|---|
| `MMG_Logo_Green_Transparent.png` | Light backgrounds (cream, white) — main MMG site default |
| `MMG_Logo_White_Transparent.png` | Dark/pine backgrounds |
| `MMG_Logo_Black_Transparent.png` | Source for CSS-tinted variants (gold, custom colours) |
| `MMG_Logo_Grey_Transparent.png` | Subtle/muted contexts |
| `MMG_Logo_Green.png` | Green on white (no transparency) |
| `MMG_Logo_White.png` | White on green (no transparency) |
| `MMG_Logo_Black.png` | Black on white (no transparency) |
| `MMG_Logo_Grey.png` | Grey on white (no transparency) |

## This project (Strokes Gained)

This app uses **`public/MMG_Logo_Gold_Transparent.png`** — a copy of the black transparent logo rendered gold via CSS `filter` in `shot-tracker.module.css`.

The filter stack in `.heroLogo`:
```css
filter:
  invert(63%) sepia(42%) saturate(608%) hue-rotate(4deg) brightness(91%) contrast(90%)
  drop-shadow(0 16px 26px rgba(44, 42, 39, 0.08));
```
This converts the black logo to `#B8973C` (MMG gold). Adjust `brightness()` to go lighter or darker. Filter values were computed for that exact hex — use [cssfiltertools.com](https://www.cssfiltertools.com/filter-to-color/) to generate values for any other colour.

## Adding a new colour variant

1. Copy `MMG_Logo_Black_Transparent.png` from the MMG site repo into this project's `public/` folder with a descriptive name (e.g. `MMG_Logo_Slate_Transparent.png`).
2. Apply a CSS `filter` chain to tint it. Use a tool like [CSS Filter Generator](https://www.cssfiltertools.com/filter-to-color/) to find the right filter for any hex colour.
3. Reference the new file in the `<img src="...">` and apply the filter class.

## MMG brand colours (for reference)

```
--gold:      #B8973C   ← this app
--gold-light: #D4B068
--pine:      #2D4A3E
--deep:      #1A1916
--taupe:     #8A7F74
--cream:     #F7F4EF
```
