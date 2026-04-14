// import React from 'react';
// import { useProducts } from '../contexts/ProductContext';
// import { useCart } from '../contexts/CartContext';
// import { useWishlist } from '../contexts/WishlistContext';
// import {
//   ScrollingBanner,
//   AboutSection,
//   FeaturesSection,
//   StatsCounter,
//   TestimonialsCarousel,
//   TopRatedSection,
//   LatestProductsSection
// } from '../app/components/home';

// interface HomePageProps {
//   onNavigate: (page: string) => void;
// }

// export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
//   const { products } = useProducts();
//   const { addToCart } = useCart();

//   return (
//     <div className="min-h-screen">
//       {/* Scrolling Banner */}
//       <ScrollingBanner onNavigate={onNavigate} />
	  
// 	    {/* About */}
//       <AboutSection />

//       {/* Features */}
//       <FeaturesSection />

//         {/* Featured Products - Mobile Only */}
//       <div className="block md:hidden">
//         <TopRatedSection 
//           onNavigate={onNavigate}
//           onAddToCart={addToCart}
//         />
//       </div>

//       {/* Stats Counter */}
//       <StatsCounter />

//         {/* Latest Product - Mobile Only */}
//       <div className="block md:hidden">
//         <LatestProductsSection
//           onNavigate={onNavigate}
//           onAddToCart={addToCart}
//         />
//       </div>

//       {/* Testimonials */}
//       <TestimonialsCarousel />
//     </div>
//   );
// };



import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import {
  ScrollingBanner,
  AboutSection,
  FeaturesSection,
  StatsCounter,
  TestimonialsCarousel,
  TopRatedSection,
  LatestProductsSection
} from '../app/components/home';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products } = useProducts();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen">
      {/* Scrolling Banner - Hidden on mobile */}
      <div className="hidden md:block">
        <ScrollingBanner onNavigate={onNavigate} />
      </div>
	  
      {/* About - Hidden on mobile */}
      <div className="hidden md:block">
        <AboutSection />
      </div>

      {/* Features - Hidden on mobile */}
      <div className="hidden md:block">
        <FeaturesSection />
      </div>

      {/* Featured Products - Mobile Only */}
      <div className="block md:hidden">
        <TopRatedSection 
          onNavigate={onNavigate}
          onAddToCart={addToCart}
        />
      </div>

      {/* Stats Counter - Hidden on mobile */}
      <div className="hidden md:block">
        <StatsCounter />
      </div>

      {/* Latest Product - Mobile Only */}
      <div className="block md:hidden">
        <LatestProductsSection
          onNavigate={onNavigate}
          onAddToCart={addToCart}
        />
      </div>

      {/* Testimonials - Hidden on mobile */}
      <div className="hidden md:block">
        <TestimonialsCarousel />
      </div>
    </div>
  );
};