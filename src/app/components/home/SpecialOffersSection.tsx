import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Product } from '../../../types';
import { ProductCard } from '../shared/ProductCard';

interface SpecialOffersSectionProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

export const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  products,
  onNavigate,
  onAddToCart
}) => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
            <p className="text-gray-600">Limited time deals on premium products</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('products')}>
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              onAddToCart={onAddToCart}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
