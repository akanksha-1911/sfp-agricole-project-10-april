# Components Guide - SFP Agricole E-commerce

## Component Structure

All reusable components are organized in `/src/app/components/` with the following structure:

```
/src/app/components/
├── home/              # HomePage components
├── products/          # ProductsPage components
├── product-detail/    # ProductDetailPage components
├── cart/              # CartPage components
├── checkout/          # CheckoutPage components
├── auth/              # Authentication components
├── shared/            # Shared/Common components
├── ui/                # UI library components (shadcn)
└── figma/             # Figma-specific components
```

---

## 🎬 NEW ANIMATED FEATURES

### Scrolling Banner
**File:** `/src/app/components/home/ScrollingBanner.tsx`
**Features:**
- Auto-scrolling image carousel (5 second intervals)
- Manual navigation with arrows
- Smooth slide transitions
- Progress bar animation
- Dot indicators
- Responsive design

### Brand Showcase
**File:** `/src/app/components/home/BrandShowcase.tsx`
**Features:**
- Animated brand cards
- Hover effects with rotation
- Staggered entrance animations

### Stats Counter
**File:** `/src/app/components/home/StatsCounter.tsx`
**Features:**
- Animated number counting
- Triggers on scroll into view
- Smooth counting animation

### Testimonials Carousel
**File:** `/src/app/components/home/TestimonialsCarousel.tsx`
**Features:**
- Customer testimonials slider
- Star ratings
- Navigation controls
- Smooth transitions

### Floating WhatsApp Button
**File:** `/src/app/components/shared/FloatingWhatsApp.tsx`
**Features:**
- Fixed position button
- Pulse animation effect
- Expandable chat popup
- Direct WhatsApp integration

### Scroll to Top Button
**File:** `/src/app/components/shared/ScrollToTop.tsx`
**Features:**
- Appears after scrolling 300px
- Smooth scroll animation
- Fade in/out transition

### Enhanced Product Card
**File:** `/src/app/components/shared/ProductCard.tsx`
**New Features:**
- Hover lift effect
- Animated star ratings
- Wishlist heart button
- Discount badge rotation animation
- Image zoom on hover

---

## 📱 HomePage Components

Located in: `/src/app/components/home/`

### 1. HeroSection
**File:** `HeroSection.tsx`
**Purpose:** Main hero banner with CTA and stats
**Props:**
- `onNavigate: (page: string) => void` - Navigation handler

**Features:**
- Animated hero text with gradient
- Two CTA buttons (Shop Now, Learn More)
- Stats display (Products, Customers, Brands)
- Hero image with overlay badge

---

### 2. FeaturesSection
**File:** `FeaturesSection.tsx`
**Purpose:** Display 4 key features in card layout

**Features:**
- Wide Selection
- Quality Assured
- Best Prices
- 24/7 Support

---

### 3. SpecialOffersSection
**File:** `SpecialOffersSection.tsx`
**Purpose:** Featured products grid with special offers
**Props:**
- `products: Product[]` - Array of products
- `onNavigate: (page: string) => void`
- `onAddToCart: (product: Product) => void`

---

### 4. TopRatedSection
**File:** `TopRatedSection.tsx`
**Purpose:** Display top-rated products
**Props:**
- `products: Product[]` - Array of top-rated products
- `onNavigate: (page: string) => void`
- `onAddToCart: (product: Product) => void`

---

### 5. CTASection
**File:** `CTASection.tsx`
**Purpose:** Call-to-action section with gradient background
**Props:**
- `onNavigate: (page: string) => void`

---

## 🛍️ ProductsPage Components

Located in: `/src/app/components/products/`

### 1. FilterSidebar
**File:** `FilterSidebar.tsx`
**Purpose:** Comprehensive filtering sidebar
**Props:**
- `selectedBrands: string[]`
- `selectedCategories: string[]`
- `selectedSubcategories: string[]`
- `selectedRegions: string[]`
- `onBrandChange: (brand: string) => void`
- `onCategoryChange: (category: string) => void`
- `onSubcategoryChange: (subcategory: string) => void`
- `onRegionChange: (region: string) => void`
- `onClearFilters: () => void`
- `brands: string[]`
- `categories: string[]`
- `subcategories: string[]`
- `regions: string[]`
- `isMobileOpen?: boolean` - Mobile drawer state
- `onMobileClose?: () => void`

**Features:**
- Brand filtering (SFP, SPADE, ORIGINAL)
- Category & Subcategory filtering
- Region filtering (Export/Domestic)
- Clear all filters button
- Mobile responsive drawer

---

### 2. ProductGrid
**File:** `ProductGrid.tsx`
**Purpose:** Grid layout for products
**Props:**
- `products: Product[]`
- `onNavigate: (page: string) => void`
- `onAddToCart: (product: Product) => void`

**Features:**
- Responsive grid (1/2/3 columns)
- Empty state handling
- Uses shared ProductCard component

---

### 3. SortControls
**File:** `SortControls.tsx`
**Purpose:** Sorting and view mode controls
**Props:**
- `sortBy: string`
- `onSortChange: (value: string) => void`
- `viewMode: 'grid' | 'list'`
- `onViewModeChange: (mode: 'grid' | 'list') => void`
- `onFilterClick?: () => void` - Mobile filter button
- `totalProducts: number`

**Sort Options:**
- Featured
- Newest First
- Highest Rated
- Name (A-Z)
- Name (Z-A)

---

## 📦 ProductDetailPage Components

Located in: `/src/app/components/product-detail/`

### 1. ImageGallery
**File:** `ImageGallery.tsx`
**Purpose:** Product image carousel with thumbnails
**Props:**
- `images: string[]`
- `productName: string`

**Features:**
- Main image display
- Thumbnail grid navigation
- Previous/Next arrows
- Image counter
- Smooth transitions

---

### 2. ProductInfo
**File:** `ProductInfo.tsx`
**Purpose:** Product details and purchase controls
**Props:**
- `product: Product`
- `onAddToCart: (quantity: number) => void`
- `onAddToWishlist: () => void`
- `onRequestCatalogue: () => void`
- `isInWishlist: boolean`

**Features:**
- Product name, brand, rating
- Stock status
- Specifications display
- Quantity selector
- Add to Cart/Wishlist buttons
- Share button
- Request Catalogue button

---

### 3. ReviewsSection
**File:** `ReviewsSection.tsx`
**Purpose:** Customer reviews and ratings
**Props:**
- `reviews: Review[]`
- `averageRating: number`

**Features:**
- Average rating display
- Rating distribution chart
- Individual reviews with ratings
- Helpful button for reviews

---

### 4. RelatedProducts
**File:** `RelatedProducts.tsx`
**Purpose:** Related product suggestions
**Props:**
- `products: Product[]`
- `onNavigate: (page: string) => void`
- `onAddToCart: (product: Product) => void`

---

### 5. ProductFeatures
**File:** `ProductFeatures.tsx`
**Purpose:** Trust badges (Fast Delivery, Quality, Best Price)

---

## 🛒 CartPage Components

Located in: `/src/app/components/cart/`

### 1. CartItem
**File:** `CartItem.tsx`
**Purpose:** Individual cart item display
**Props:**
- `item: CartItem`
- `onUpdateQuantity: (id: string, quantity: number) => void`
- `onRemove: (id: string) => void`
- `onNavigate: (page: string) => void`

**Features:**
- Product image, name, SKU
- Quantity controls (+/-)
- Remove button
- Price calculation
- Click to navigate to product

---

### 2. CartSummary
**File:** `CartSummary.tsx`
**Purpose:** Order summary and checkout
**Props:**
- `subtotal: number`
- `discount: number`
- `tax: number`
- `total: number`
- `itemCount: number`
- `onCheckout: () => void`

**Features:**
- Price breakdown
- Free shipping indicator
- GST calculation
- Proceed to Checkout button
- Sticky sidebar

---

### 3. EmptyCart
**File:** `EmptyCart.tsx`
**Purpose:** Empty cart state
**Props:**
- `onNavigate: (page: string) => void`

---

## 💳 CheckoutPage Components

Located in: `/src/app/components/checkout/`

### 1. ShippingForm
**File:** `ShippingForm.tsx`
**Purpose:** Shipping address form
**Props:**
- `formData: { name, email, phone, address, city, state, pincode }`
- `onChange: (field: string, value: string) => void`

---

### 2. PaymentForm
**File:** `PaymentForm.tsx`
**Purpose:** Payment method selection
**Props:**
- `selectedMethod: string`
- `onMethodChange: (method: string) => void`

**Payment Methods:**
- Credit/Debit Card
- UPI
- Net Banking
- Cash on Delivery

---

### 3. OrderSummary
**File:** `OrderSummary.tsx`
**Purpose:** Final order review
**Props:**
- `items: CartItem[]`
- `subtotal: number`
- `tax: number`
- `total: number`

**Features:**
- Product list with images
- Price breakdown
- Sticky sidebar

---

### 4. OrderSuccess
**File:** `OrderSuccess.tsx`
**Purpose:** Order confirmation screen
**Props:**
- `orderId: string`
- `onNavigate: (page: string) => void`

---

## 🔐 Auth Components

Located in: `/src/app/components/auth/`

### 1. LoginForm
**File:** `LoginForm.tsx`
**Purpose:** User login form
**Props:**
- `onLogin: (email: string, password: string) => void`
- `onSwitchToSignup: () => void`

**Features:**
- Email and password fields
- Show/hide password toggle
- Switch to signup link

---

### 2. SignupForm
**File:** `SignupForm.tsx`
**Purpose:** User registration form
**Props:**
- `onSignup: (name: string, email: string, phone: string, password: string) => void`
- `onSwitchToLogin: () => void`

**Features:**
- Name, email, phone, password fields
- Password confirmation
- Show/hide password toggle
- Switch to login link

---

## 🔄 Shared Components

Located in: `/src/app/components/shared/`

### ProductCard
**File:** `ProductCard.tsx`
**Purpose:** Reusable product card (used across multiple pages)
**Props:**
- `product: Product`
- `onNavigate: (page: string) => void`
- `onAddToCart: (product: Product) => void`
- `delay?: number` - Animation delay

**Features:**
- Product image with hover effect
- Brand and discount badges
- Rating stars
- Add to Cart button
- Responsive design

---

## 📝 Usage Examples

### Using HomePage components:

```tsx
import { 
  HeroSection, 
  FeaturesSection, 
  SpecialOffersSection, 
  TopRatedSection, 
  CTASection 
} from '../app/components/home';

export const HomePage = ({ onNavigate }) => {
  return (
    <div>
      <HeroSection onNavigate={onNavigate} />
      <FeaturesSection />
      <SpecialOffersSection 
        products={featuredProducts} 
        onNavigate={onNavigate}
        onAddToCart={addToCart}
      />
      <TopRatedSection 
        products={topRatedProducts}
        onNavigate={onNavigate}
        onAddToCart={addToCart}
      />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
};
```

### Using ProductsPage components:

```tsx
import { FilterSidebar, ProductGrid, SortControls } from '../app/components/products';

export const ProductsPage = () => {
  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <FilterSidebar 
        selectedBrands={selectedBrands}
        onBrandChange={handleBrandChange}
        // ... other props
      />
      <div className="lg:col-span-3">
        <SortControls 
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalProducts={filteredProducts.length}
        />
        <ProductGrid 
          products={filteredProducts}
          onNavigate={onNavigate}
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
};
```

---

## 🎨 Styling

All components use:
- **Tailwind CSS** for styling
- **Indigo/Blue theme** (matching SFP Agricole logo)
- **Motion/React** for animations
- **shadcn/ui** components for UI elements

---

## 🔧 Key Features

✅ **Fully Responsive** - All components work on mobile, tablet, and desktop
✅ **Reusable** - Easy to import and use across pages
✅ **Type-safe** - Full TypeScript support
✅ **Animated** - Smooth Motion animations
✅ **Accessible** - Proper ARIA labels and semantic HTML
✅ **Consistent** - Unified color scheme and design language

---

## 📂 File Structure Summary

```
/src/app/components/
├── home/
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── SpecialOffersSection.tsx
│   ├── TopRatedSection.tsx
│   ├── CTASection.tsx
│   └── index.ts
├── products/
│   ├── FilterSidebar.tsx
│   ├── ProductGrid.tsx
│   ├── SortControls.tsx
│   └── index.ts
├── product-detail/
│   ├── ImageGallery.tsx
│   ├── ProductInfo.tsx
│   ├── ReviewsSection.tsx
│   ├── RelatedProducts.tsx
│   ├── ProductFeatures.tsx
│   └── index.ts
├── cart/
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   ├── EmptyCart.tsx
│   └── index.ts
├── checkout/
│   ├── ShippingForm.tsx
│   ├── PaymentForm.tsx
│   ├── OrderSummary.tsx
│   ├── OrderSuccess.tsx
│   └── index.ts
├── auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── index.ts
└── shared/
    ├── ProductCard.tsx
    └── index.ts
```

---

**Total Components Created: 27**

Each component is modular, reusable, and follows best practices for React development!