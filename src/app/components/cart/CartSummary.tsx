import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Tag } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount,
  tax,
  total,
  itemCount,
  onCheckout
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="p-6 sticky top-24">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-semibold">₹{subtotal}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Discount
              </span>
              <span className="font-semibold">-₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold text-indigo-600">Free</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (GST 18%)</span>
            <span className="font-semibold">₹{tax}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-indigo-600">
                ₹{total}
              </span>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 mb-3"
          size="lg"
          onClick={onCheckout}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Proceed to Checkout
        </Button>

        <div className="text-xs text-center text-gray-500">
          Secure checkout powered by industry standards
        </div>
      </Card>
    </motion.div>
  );
};
