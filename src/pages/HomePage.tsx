import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import {
  ScrollingBanner,
  AboutSection,
  FeaturesSection,
  //BrandShowcase,
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
      {/* Scrolling Banner */}
      <ScrollingBanner onNavigate={onNavigate} />
	  
	  {/* About */}
      <AboutSection />

      {/* Features */}
      <FeaturesSection />

      {/* Featured Products */}
      <TopRatedSection 
        onNavigate={onNavigate}
        onAddToCart={addToCart}
      />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Latest Product */}
       <LatestProductsSection
        onNavigate={onNavigate}
        onAddToCart={addToCart}
      />

      {/* Testimonials */}
      <TestimonialsCarousel />
    </div>
  );
};