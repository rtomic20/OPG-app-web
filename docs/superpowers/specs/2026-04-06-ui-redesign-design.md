# UI Redesign — Tržnjak Landing Page + OPG Panel

**Date:** 2026-04-06  
**Scope:** OPG-app-web (promo landing) + OPG-app/frontend (admin panel)

## Problem

Both apps look AI-generated:
- Emoji used as icons everywhere
- Green gradient + blur blobs on hero
- Mono-green palette with no warmth
- Generic card patterns
- No visual character

## Goals

1. Replace all emoji icons with Lucide SVG icons
2. Redesign hero — krem background, organic SVG decoration, staggered entrance animation
3. Warm up the color palette (krem base, topla typografija)
4. Add DM Sans Google Font
5. Add ObjaveSection — latest 6 OPG posts from `/api/vendors/feed/`
6. Uljepšati OPG admin panel nav + stat cards with Lucide icons

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Body bg | `#faf7f2` | Warm cream base |
| White sections | `#ffffff` | Alternating sections |
| Text primary | `#1c1917` | stone-900 |
| Accent green | `#16a34a` | CTAs, buttons only |
| Decorative amber | `#92400e` | SVG decoration, small accents |

## Typography

- Font: **DM Sans** (Google Fonts, weights 400/500/600/700)
- Import via `@import url(...)` in `index.css`

## Icon Mapping — Promo Web

| Component | Emoji | Lucide |
|-----------|-------|--------|
| Features | 🌱📍🤝💸📱🔒🌍⭐ | Sprout, MapPin, Handshake, Banknote, Smartphone, ShieldCheck, Leaf, Star |
| HowItWorks tabs | 🌾🛒 | Wheat, ShoppingCart |
| HowItWorks steps | 📝🧺💰🗺️📱🥗 | FileText, Basket, TrendingUp, Map, ShoppingCart, UtensilsCrossed |
| CtaSection trust | ✓✓✓ | CircleCheck |

## Icon Mapping — Admin Panel

| Nav item | Emoji | Lucide |
|----------|-------|--------|
| Nadzorna ploča | 📊 | LayoutDashboard |
| Proizvodi | 🥦 | Package |
| Narudžbe | 📦 | ShoppingBag |
| Recenzije | ⭐ | Star |
| Objave | 📢 | Megaphone |
| Primjedbe | ✉️ | MessageSquare |
| Stat: narudžbe | 📦 | ShoppingBag |
| Stat: čekanje | ⏳ | Clock |
| Stat: prihod | 💶 | Euro |
| Stat: ukupno | 📊 | BarChart2 |

## Hero Redesign

- **Remove:** `bg-gradient-to-br from-green-50 via-green-100 to-green-200`, two blur-3xl blobs
- **Add:** `bg-[#faf7f2]` background
- **Add:** Two SVG decorative elements:
  - Top-right: organic wave/curve path in `green-200`
  - Bottom-left: 3×3 dot grid pattern in `#92400e` at 30% opacity
- **Add:** Staggered CSS entrance animation — badge (0ms), h1 (100ms), p (200ms), form (300ms)

## ObjaveSection (new component)

- **File:** `src/components/ObjaveSection.tsx`
- **Position:** Between HowItWorks and CtaSection in LandingPage.tsx
- **API:** `GET /api/vendors/feed/` (public, no auth)
- **Display:** 6 posts, 3-col/2-col/1-col grid
- **Card fields:** vendor logo/initials avatar, vendor name, relative date, content (line-clamp-3), image (optional, 16/9)
- **Link:** each card links to `/opgovi/{vendor_slug}`
- **Empty state:** render null if 0 posts or API error
- **Animation:** fade-in-up on scroll (existing IntersectionObserver pattern)

## Scope Exclusions

- No changes to routing, auth, API endpoints
- No changes to Flutter mobile app
- Admin panel: icons + stat cards only — no layout restructuring
- No new backend endpoints needed
