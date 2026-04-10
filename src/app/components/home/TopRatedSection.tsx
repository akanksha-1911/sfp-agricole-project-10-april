import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Product } from '../../../types';

interface TopRatedSectionProps {
  products: Product[];
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

export const TopRatedSection: React.FC<TopRatedSectionProps> = ({
  products,
  onNavigate,
  onAddToCart
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Rated Products</h2>
          <p className="text-gray-600">Highly recommended by our customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-indigo-200"
              onClick={() => onNavigate(`product/${product.id}`)}
            >
              <div className="relative overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-indigo-600">{product.brand}</Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews.length})</span>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
