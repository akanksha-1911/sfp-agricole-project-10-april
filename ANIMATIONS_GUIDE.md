# 🎬 Animation Features Guide - SFP Agricole E-commerce

## Overview

This website features rich, modern animations powered by **Motion/React** (formerly Framer Motion). All animations are performance-optimized and enhance user experience without compromising functionality.

---

## 🏠 Homepage Animations

### 1. **Scrolling Image Banner**
Location: Top of homepage
```tsx
import { ScrollingBanner } from '../app/components/home';
```

**Features:**
- ✨ Auto-scrolling carousel (5-second intervals)
- 🎯 Smooth slide transitions with spring physics
- 📊 Animated progress bar
- 🔘 Clickable dot indicators
- ⬅️➡️ Arrow navigation with hover effects
- 📱 Fully responsive

**Animation Details:**
- Entry animation: Slides from left/right based on direction
- Exit animation: Slides out opposite direction
- Content: Staggered fade-in for title, subtitle, and CTA
- Progress bar: Linear 5-second fill animation

---

### 2. **Brand Showcase Cards**
Location: Below banner

**Animations:**
- Initial entrance: Scale from 0.8 to 1 with stagger
- Hover effect: Scale to 1.05 and lift upward
- Icon rotation: 360° rotation on hover

---

### 3. **Animated Stats Counter**
Location: Mid-page stats section

**Features:**
- 📈 Numbers count up from 0 when scrolled into view
- ⏱️ 2-second smooth counting animation
- 🎯 Triggers only once on first view
- 🌟 Icon scale-in animation with spring effect

**Stats Displayed:**
- 500+ Products
- 10,000+ Customers
- 3 Top Brands
- 99% Satisfaction

---

### 4. **Testimonials Carousel**
Location: Customer reviews section

**Animations:**
- Slide transition: Fade and slide horizontally
- Star ratings: Always visible
- Navigation: Smooth slide on arrow click
- Dots: Expand active indicator

---

### 5. **Product Cards**
Location: Special Offers & Top Rated sections

**Hover Animations:**
- Card lifts up (-8px on Y-axis)
- Shadow expands (shadow-2xl)
- Border color changes to indigo
- Image scales to 110%
- Wishlist heart button fades in
- Overlay appears with opacity

**Entry Animations:**
- Fade in from opacity 0
- Slide up from Y: 20px
- Staggered delays based on position
- Star ratings appear one by one

---

## 🛍️ Product Pages Animations

### Product Card Enhancements

**Discount Badge:**
- Entry: Rotates from -180° with scale animation
- Uses spring physics for bounce effect

**Stars:**
- Each star animates individually
- Staggered entrance (0.1s delay between each)
- Scale from 0 to 1

**Add to Cart Button:**
- Hover: Scale to 1.02
- Click: Scale to 0.98 (press effect)
- Icon included for better UX

---

## 🎨 Shared Component Animations

### 1. **Floating WhatsApp Button**
Location: Bottom-right corner

**Features:**
- Entry: Scale from 0 with fade-in (1s delay)
- Pulse effect: Continuous scale and opacity animation
- Icon rotation: Smooth toggle between message and close icons
- Popup: Scale and fade animation

**States:**
- Closed: Message icon with pulse
- Open: Close icon with chat popup
- Popup: Slides up with scale effect

---

### 2. **Scroll to Top Button**
Location: Bottom-left corner

**Behavior:**
- Appears after scrolling 300px
- Entry/exit: Scale and fade animations
- Hover: Scale to 1.1
- Click: Scale to 0.9 (press effect)

---

### 3. **Page Transitions**
Applied to all page changes

**Animation:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}
```

---

## 🎯 Animation Principles Used

### 1. **Entrance Animations**
- **Fade In**: Opacity 0 → 1
- **Slide Up**: translateY(20px) → 0
- **Scale In**: Scale 0.8 → 1
- **Stagger**: Delayed animations for multiple items

### 2. **Hover Effects**
- **Lift**: translateY(0) → translateY(-8px)
- **Scale**: 1 → 1.05 or 1.1
- **Shadow**: Elevation increase
- **Border**: Color change to accent

### 3. **Interactive Feedback**
- **Button Press**: Scale 1 → 0.98 → 1
- **Toggle**: Rotation animations
- **Loading**: Continuous loops

### 4. **Scroll-Based**
- **Viewport Detection**: `whileInView` with `once: true`
- **Trigger Distance**: Animations start when 25% visible
- **One-time**: Animations don't repeat on re-scroll

---

## 🚀 Performance Optimizations

### Used Techniques:

1. **GPU Acceleration**
   - All animations use `transform` and `opacity`
   - No layout-triggering properties (width, height, etc.)

2. **Viewport-based Loading**
   - Animations trigger only when visible
   - `viewport={{ once: true }}` prevents re-animation

3. **Efficient Transitions**
   - Spring physics for natural movement
   - Duration: 0.2s - 0.6s (optimal range)

4. **Reduced Motion Support**
   - Respects user's `prefers-reduced-motion` setting
   - Motion automatically handles this

---

## 🎨 Animation Library

### Motion/React Features Used:

```tsx
// Basic animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>

// Hover animation
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
/>

// Scroll-triggered animation
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
/>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => <motion.div variants={itemVariants} />)}
</motion.div>

// AnimatePresence for mount/unmount
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

---

## 📊 Animation Timing Guide

| Animation Type | Duration | Easing |
|---------------|----------|--------|
| Page Transition | 300ms | ease-in-out |
| Card Hover | 300ms | ease-out |
| Button Click | 200ms | ease-in-out |
| Carousel Slide | 400ms | spring |
| Fade In | 400-600ms | ease-out |
| Number Counter | 2000ms | linear |
| Scroll Reveal | 500ms | ease-out |
| Loading Spinner | 1000ms | linear, infinite |

---

## 🎭 Custom Variants

### Slide Variants (Carousel)
```tsx
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};
```

### Stagger Container
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## 🌟 Special Effects

### 1. **Pulse Animation** (WhatsApp Button)
```tsx
animate={{
  scale: [1, 1.2, 1],
  opacity: [0.5, 0, 0.5],
}}
transition={{
  duration: 2,
  repeat: Infinity,
  ease: 'easeInOut',
}}
```

### 2. **Continuous Rotation**
```tsx
animate={{ rotate: 360 }}
transition={{
  duration: 1.5,
  repeat: Infinity,
  ease: 'linear'
}}
```

### 3. **Progress Bar**
```tsx
initial={{ width: '0%' }}
animate={{ width: '100%' }}
transition={{ duration: 5, ease: 'linear' }}
```

---

## 🎯 Best Practices

✅ **DO:**
- Use `transform` and `opacity` for best performance
- Add `viewport={{ once: true }}` for scroll animations
- Keep animations under 600ms for responsiveness
- Use spring physics for natural movement
- Provide visual feedback for interactions

❌ **DON'T:**
- Animate width, height, or position properties
- Use very long durations (>1s) for UI elements
- Animate on every scroll (use `once: true`)
- Overuse animations - keep it subtle
- Ignore accessibility (motion preferences)

---

## 🔧 Customization

To modify animations, edit these files:
- `/src/app/components/home/ScrollingBanner.tsx` - Banner carousel
- `/src/app/components/home/StatsCounter.tsx` - Number animations
- `/src/app/components/shared/ProductCard.tsx` - Card animations
- `/src/app/components/shared/FloatingWhatsApp.tsx` - WhatsApp button
- `/src/app/components/shared/ScrollToTop.tsx` - Scroll button

---

## 📱 Responsive Behavior

All animations are:
- Touch-friendly on mobile
- Reduced on low-performance devices
- Disabled for users with `prefers-reduced-motion`
- Optimized for different screen sizes

---

**Total Animated Components: 35+**

Every animation enhances user experience while maintaining performance! 🚀
