import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Product } from '../../../types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  delay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onNavigate, 
  onAddToCart,
  delay = 0 
}) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const shareText = `Check out ${product.name} - ₹${product.price.toLocaleString('en-IN')}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareText,
        url: productUrl
      }).catch(() => {});
    } else {
      // Fallback method using temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = productUrl;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices
      
      try {
        document.execCommand('copy');
        toast.success('Product link copied to clipboard!', {
          duration: 1000  // 1000ms = 1 second
        });
      } catch (err) {
        toast.error('Failed to copy link');
      }
      
      document.body.removeChild(tempInput);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-indigo-200 relative">
        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/5 z-10 pointer-events-none"
        />

        <div
          className="relative overflow-hidden bg-gray-100"
          onClick={() => onNavigate(`product/${product.id}`)}
        >
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discount && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.2, type: 'spring' }}
            >
              <Badge className="absolute top-3 right-3 bg-red-500">
                {product.discount}% OFF
              </Badge>
            </motion.div>
          )}
          <Badge className="absolute top-3 left-3 bg-indigo-600">
            {product.brand}
          </Badge>

          {/* Action Buttons - Wishlist & Share */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                toast.success('Added to wishlist!', {
                  duration: 1000  // 1000ms = 1 second
                });
              }}
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </motion.button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
          <div className="text-sm text-gray-600 mb-2">{product.category}</div>
          
          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.1 * i }}
                >
                  <Star
                    className={`w-4 h-4 ${
                      i < product.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviews.length})</span>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};