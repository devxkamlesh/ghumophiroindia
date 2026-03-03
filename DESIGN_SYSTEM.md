# Design System

## Color Palette

### Primary Colors (Orange/Terracotta)
- primary-50: #fef6ee - Lightest tint
- primary-100: #fdecd7
- primary-200: #fad5ae
- primary-300: #f7b77a
- primary-400: #f38f44
- primary-500: #f0701f
- primary-600: #e15515 - Main brand color
- primary-700: #ba3f13
- primary-800: #943317
- primary-900: #782c16 - Darkest shade

### Sand/Beige (Secondary)
- sand-50: #fdfbf7
- sand-100: #f9f5ed
- sand-200: #f3ead8
- sand-300: #e9d9ba
- sand-400: #ddc497
- sand-500: #d1ad76
- sand-600: #c59a5f
- sand-700: #a67d4d
- sand-800: #886644
- sand-900: #6f5439

### Neutral Grays
- Standard Tailwind gray scale

## Typography

### Font Families
- **Display**: Playfair Display (serif) - For headings and hero text
- **Body**: Inter (sans-serif) - For body text and UI elements

### Font Sizes
- text-xs: 0.75rem (12px)
- text-sm: 0.875rem (14px)
- text-base: 1rem (16px)
- text-lg: 1.125rem (18px)
- text-xl: 1.25rem (20px)
- text-2xl: 1.5rem (24px)
- text-3xl: 1.875rem (30px)
- text-4xl: 2.25rem (36px)
- text-5xl: 3rem (48px)
- text-7xl: 4.5rem (72px)

### Font Weights
- font-normal: 400
- font-medium: 500
- font-bold: 700

## Spacing

Using Tailwind's default spacing scale (4px base unit):
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)
- 20: 5rem (80px)

## Components

### Buttons

**Primary Button**
- Background: primary-600
- Hover: primary-700
- Text: white
- Padding: px-6 py-3
- Border radius: rounded-lg
- Shadow: shadow-lg
- Hover shadow: shadow-xl

**Secondary Button**
- Background: white
- Border: 2px border-primary-600
- Text: primary-600
- Hover: bg-gray-50

### Cards

**Tour Card**
- Background: white
- Border radius: rounded-xl
- Shadow: shadow-lg
- Hover: shadow-2xl + translate-y-1
- Image height: h-64
- Padding: p-5

**Feature Card**
- Background: white
- Border radius: rounded-xl
- Shadow: shadow-lg
- Padding: p-8
- Icon container: w-14 h-14 bg-primary-100 rounded-lg

### Forms

**Input Fields**
- Border: border border-gray-300
- Border radius: rounded-lg
- Padding: px-4 py-3
- Focus: ring-2 ring-primary-500

**Select Dropdowns**
- Same styling as input fields
- Icon: left-aligned with pl-10

## Layout

### Container
- Max width: max-w-7xl
- Padding: px-4 sm:px-6 lg:px-8
- Centered: mx-auto

### Grid Systems
- Mobile: grid-cols-1
- Tablet: md:grid-cols-2
- Desktop: lg:grid-cols-3 or lg:grid-cols-4

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Animations

### Transitions
- Default: transition-all duration-300
- Fast: duration-200
- Slow: duration-500

### Hover Effects
- Scale: hover:scale-110
- Translate: hover:-translate-y-1
- Shadow: hover:shadow-2xl

### Custom Animations
- fade-in: 0.6s ease-out
- slide-up: 0.6s ease-out
- scale-in: 0.4s ease-out

## Icons

Using Lucide React:
- Size: w-5 h-5 (standard)
- Size: w-6 h-6 (medium)
- Size: w-8 h-8 (large)
- Color: Inherits from parent or text-primary-600

## Images

### Optimization
- Format: AVIF, WebP fallback
- Loading: lazy (except above fold)
- Sizes: responsive with srcset

### Aspect Ratios
- Hero: 16:9
- Tour cards: 4:3
- Thumbnails: 1:1

## Accessibility

- Color contrast: WCAG AA minimum
- Focus states: visible ring
- Alt text: descriptive for all images
- Semantic HTML: proper heading hierarchy
- Keyboard navigation: full support

## Responsive Design

### Mobile First Approach
1. Design for mobile (320px+)
2. Enhance for tablet (768px+)
3. Optimize for desktop (1024px+)

### Key Considerations
- Touch targets: minimum 44x44px
- Readable text: minimum 16px
- Adequate spacing: minimum 8px
- Hamburger menu: below lg breakpoint
