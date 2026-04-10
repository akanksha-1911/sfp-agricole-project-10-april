import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface OrderSuccessProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-green-600">Order Placed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've received it and will process it shortly.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-xl font-bold text-gray-900">{orderId}</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => onNavigate('products')}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500"
          >
            Continue Shopping
          </Button>
          <Button variant="outline" onClick={() => onNavigate('profile')}>
            <Package className="w-4 h-4 mr-2" />
            View Orders
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
