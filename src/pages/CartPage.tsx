
import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  // Helper function to safely get product image - NO FALLBACK
  const getProductImage = (product: any) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    // Return undefined or empty string - no placeholder
    return '';
  };

  // Calculate savings for a single item
  const getItemSavings = (product: any, quantity: number) => {
    if (product.mrp && product.mrp > product.price) {
      return (product.mrp - product.price) * quantity;
    }
    return 0;
  };

  // Calculate total savings
  const getTotalSavings = () => {
    return cart.reduce((total, item) => {
      return total + getItemSavings(item.product, item.quantity);
    }, 0);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button onClick={() => onNavigate('products')} className="bg-gradient-to-r from-green-600 to-emerald-500">
            Shop Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <Button variant="outline" onClick={() => {
            clearCart();
            toast.success('Cart cleared', {
              duration: 1000
            });
          }}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              // Skip rendering if product data is invalid
              if (!item || !item.product) {
                console.error('Invalid cart item:', item);
                return null;
              }

              const itemSavings = getItemSavings(item.product, item.quantity);
              const hasDiscount = item.product.mrp && item.product.mrp > item.product.price;

              return (
                <motion.div
                  key={item.product.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex gap-4">
                      <div
                        className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                        onClick={() => onNavigate(`product/${item.product.id}`)}
                      >
                        <ImageWithFallback
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3
                              className="font-semibold cursor-pointer hover:text-green-600"
                              onClick={() => onNavigate(`product/${item.product.id}`)}
                            >
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.product.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              removeFromCart(item.product.id);
                              toast.success('Removed from cart', {
                                duration: 1000  
                              });
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Price Section with MRP and Savings */}
                        <div className="mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-indigo-600">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            {hasDiscount && (
                              <>
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                                </span>
                                {itemSavings > 0 && (
                                  <span className="text-xs text-green-600 font-semibold">
                                    Save ₹{itemSavings.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            ₹{item.product.price.toLocaleString('en-IN')} each
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center font-semibold text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>
                
                {/* Total Savings */}
                {getTotalSavings() > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Savings</span>
                    <span className="font-semibold text-green-600">
                      - ₹{getTotalSavings().toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                {/* Tax Section Removed */}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-green-600">
                      ₹{getCartTotal().toLocaleString('en-IN')}
                    </span>
                  </div>
                  {getTotalSavings() > 0 && (
                    <p className="text-xs text-green-600 mt-1 text-right">
                      You saved ₹{getTotalSavings().toLocaleString('en-IN')} on this order
                    </p>
                  )}
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 mb-3"
                size="lg"
                onClick={() => onNavigate('checkout')}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="w-full" onClick={() => onNavigate('products')}>
                Continue Shopping
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};