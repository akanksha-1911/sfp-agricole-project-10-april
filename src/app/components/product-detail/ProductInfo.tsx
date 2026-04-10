import React, { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Product } from '../../../types';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onAddToWishlist: () => void;
  onRequestCatalogue: () => void;
  isInWishlist: boolean;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onRequestCatalogue,
  isInWishlist
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Badge className="mb-2 bg-indigo-600">{product.brand}</Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < product.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="border-t border-b py-4 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-600">Category:</span>
          <span className="font-semibold">{product.category}</span>
          
          <span className="text-gray-600">SKU:</span>
          <span className="font-semibold">{product.sku}</span>
          
          <span className="text-gray-600">Stock:</span>
          <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {product.stock > 0 ? `${product.stock} Available` : 'Out of Stock'}
          </span>
          
          <span className="text-gray-600">Region:</span>
          <span className="font-semibold">{product.region}</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Description</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <div>
          <h3 className="font-semibold text-lg mb-2">Specifications</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key} className="flex gap-2">
                <span className="text-gray-600 min-w-[120px]">{key}:</span>
                <span className="font-semibold">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="font-semibold mb-2">Quantity</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500"
          onClick={() => onAddToCart(quantity)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onAddToWishlist}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Request Catalogue Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onRequestCatalogue}
      >
        <FileText className="w-4 h-4 mr-2" />
        Request Product Catalogue
      </Button>
    </div>
  );
};
