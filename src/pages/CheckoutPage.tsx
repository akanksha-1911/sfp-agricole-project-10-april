import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CreditCard, MapPin, User as UserIcon, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Textarea } from '../app/components/ui/textarea';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

interface UserProfile {
  user_id: string;
  user_name: string;
  user_address: string;
  user_pincode: string;
  user_city: string;
  user_state: string;
  user_country: string;
  user_email: string;
  user_contact_number: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        const response = await apiService.getUserProfile(userId);
        
        if (response.status && response.code === 200 && response.data && response.data[0]) {
          const profile: UserProfile = response.data[0];
          
          setShippingInfo({
            fullName: profile.user_name || '',
            email: profile.user_email || '',
            phone: profile.user_contact_number || '',
            address: profile.user_address || '',
            city: profile.user_city || '',
            state: profile.user_state || '',
            country: profile.user_country || '',
            pincode: profile.user_pincode || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Could not fetch your profile details');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (cart.length === 0 && !orderPlaced) {
    onNavigate('cart');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      toast.error('Please fill all shipping details');
      return;
    }

    // Validate email format if provided
    if (shippingInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(shippingInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(shippingInfo.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const userId = user?.id || localStorage.getItem('user_id');
      
      if (!userId) {
        toast.error('User not found. Please login again.');
        return;
      }

      // Prepare order items
      const orderItems = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        total_price: item.product.price * item.quantity
      }));

      // Calculate total amount (without tax as per your requirement)
      const totalAmount = getCartTotal();

      // Prepare checkout request body
      const checkoutData = {
        user_id: userId,
        shipping_address: {
          full_name: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country || 'India',
          pincode: shippingInfo.pincode
        },
        order_items: orderItems,
        payment_method: "COD",
        total_amount: totalAmount
      };

      console.log('Sending checkout request:', checkoutData);

      // Call the checkout API
      const response = await apiService.placeOrder(checkoutData);

      // Check if order was successful
      if (response.status && response.code === 200) {
        // Calculate points earned (1 point per ₹100)
        const pointsEarned = Math.floor(getCartTotal() / 100);
        
        // Update user points if logged in
        if (user) {
          const updatedUser = {
            ...user,
            points: (user.points || 0) + pointsEarned
          };
          updateUser(updatedUser);
        }

        // Clear cart and show success
        clearCart();
        setOrderPlaced(true);
        toast.success(response.message || `Order placed successfully! You earned ${pointsEarned} points!`, {
          duration: 3000
        });
      } else {
        // Handle API error response
        toast.error(response.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please check your connection and try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-green-600">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => onNavigate('products')}
                className="bg-gradient-to-r from-green-600 to-emerald-500"
              >
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => onNavigate('home')}>
                Go to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const total = subtotal;

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      rows={3}
                      placeholder="Street address, apartment, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="India"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      type="text"
                      value={shippingInfo.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      required
                      placeholder="422001"
                      maxLength={6}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>
                <div className="p-4 border-2 border-green-600 rounded-lg bg-green-50">
                  <p className="font-semibold text-green-800">Cash on Delivery (COD)</p>
                  <p className="text-sm text-green-700 mt-1">Pay when you receive your order</p>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-green-600">₹{total}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
                  size="lg"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Placing Order...</span>
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};