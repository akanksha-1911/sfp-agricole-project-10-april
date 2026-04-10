import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyCartProps {
  onNavigate: (page: string) => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
      <p className="text-gray-600 mb-6">Add some products to get started</p>
      <Button 
        onClick={() => onNavigate('products')} 
        className="bg-gradient-to-r from-indigo-600 to-indigo-500"
      >
        Shop Now
      </Button>
    </motion.div>
  );
};
