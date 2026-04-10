import React from 'react';
import { Product } from '../../../types';
import { ProductCard } from '../shared/ProductCard';

interface RelatedProductsProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  onNavigate,
  onAddToCart
}) => {
  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
};
