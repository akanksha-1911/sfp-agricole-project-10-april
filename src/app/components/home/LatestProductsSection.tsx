import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Product } from '../../../types';
import { ProductCard } from '../shared/ProductCard';
import { apiService } from '../../../services/apiService';
import { useWishlist } from '../../../contexts/WishlistContext';

interface LatestProductsSectionProps {
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

export const LatestProductsSection: React.FC<LatestProductsSectionProps> = ({
  onNavigate,
  onAddToCart
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    setIsLoading(true);
    try {
      const latestProducts = await apiService.getLatestProducts();
      setProducts(latestProducts);
    } catch (error) {
      console.error('Error fetching latest products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Products</h2>
        <p className="text-gray-600">Check out our newest arrivals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            onNavigate={onNavigate}
            onAddToCart={onAddToCart}
            onWishlistToggle={(e) => handleWishlistToggle(product, e)}
            isWishlisted={isInWishlist(product.id)}
            delay={idx * 0.1}
          />
        ))}
      </div>
    </div>
  </section>
);
};