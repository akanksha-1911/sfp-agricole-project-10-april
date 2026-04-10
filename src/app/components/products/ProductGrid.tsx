import React from 'react';
import { Product } from '../../../types';
import { ProductCard } from '../shared/ProductCard';

interface ProductGridProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onNavigate,
  onAddToCart
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">No products found matching your criteria.</p>
        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
          delay={idx * 0.05}
        />
      ))}
    </div>
  );
};
