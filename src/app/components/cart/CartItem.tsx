import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CartItem as CartItemType } from '../../../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onNavigate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Card className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div
            className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer flex-shrink-0"
            onClick={() => onNavigate(`product/${item.product.id}`)}
          >
            <ImageWithFallback
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <h3
                  className="font-semibold cursor-pointer hover:text-indigo-600"
                  onClick={() => onNavigate(`product/${item.product.id}`)}
                >
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>
                <p className="text-xs text-gray-500 mt-1">SKU: {item.product.sku}</p>
              </div>

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.product.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Quantity and Price */}
            <div className="flex items-end justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  className="h-8 w-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">
                  ₹{item.product.price * item.quantity}
                </p>
                <p className="text-xs text-gray-500">
                  ₹{item.product.price} each
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
