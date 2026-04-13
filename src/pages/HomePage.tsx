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
      {/* Scrolling Banner */}
      <ScrollingBanner onNavigate={onNavigate} />
	  
	    {/* About */}
      <AboutSection />

      {/* Features */}
      <FeaturesSection />

        {/* Featured Products - Mobile Only */}
      <div className="block md:hidden">
        <TopRatedSection 
          onNavigate={onNavigate}
          onAddToCart={addToCart}
        />
      </div>

      {/* Stats Counter */}
      <StatsCounter />

        {/* Latest Product - Mobile Only */}
      <div className="block md:hidden">
        <LatestProductsSection
          onNavigate={onNavigate}
          onAddToCart={addToCart}
        />
      </div>

      {/* Testimonials */}
      <TestimonialsCarousel />
    </div>
  );
};