import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CartItem } from '../../../types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  tax,
  total
}) => {
  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold">Order Summary</h2>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <ImageWithFallback
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold line-clamp-1">{item.product.name}</h4>
              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-indigo-600">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-indigo-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span className="font-semibold">₹{tax}</span>
        </div>
        <div className="border-t pt-2 flex justify-between">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-2xl text-indigo-600">₹{total}</span>
        </div>
      </div>
    </Card>
  );
};
