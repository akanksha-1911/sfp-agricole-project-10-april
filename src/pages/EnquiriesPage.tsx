// pages/EnquiriesPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, ShoppingBag, IndianRupee, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface EnquiryItem {
  order_id: string;
  product_id: string;
  product_name: string;
  product_company_name: string;
  product_category_name: string;
  product_price: string;
  product_qty: string;
  product_total: string;
  product_image: string;
  product_image_small: string;
  product_image_med: string;
  product_image_large: string;
  product_image_extra_small: string;
}

interface GroupedOrder {
  order_id: string;
  items: EnquiryItem[];
  total_amount: number;
  order_date: string;
}

interface EnquiriesPageProps {
  onNavigate: (page: string) => void;
}

export const EnquiriesPage: React.FC<EnquiriesPageProps> = ({ onNavigate }) => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('user_id') || user?.user_id;
      if (!userId) {
        toast.error('Please login to view your orders');
        return;
      }
      
      const data = await apiService.getEnquiries(userId);
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load your orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Group items by order_id
  const groupOrdersByOrderId = (items: EnquiryItem[]): GroupedOrder[] => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = {
          order_id: item.order_id,
          items: [],
          total_amount: 0,
          order_date: new Date().toISOString()
        };
      }
      acc[item.order_id].items.push(item);
      acc[item.order_id].total_amount += parseFloat(item.product_total);
      return acc;
    }, {} as Record<string, GroupedOrder>);

    return Object.values(grouped).sort((a, b) => 
      parseInt(b.order_id) - parseInt(a.order_id)
    );
  };

  const groupedOrders = groupOrdersByOrderId(enquiries);
  const totalOrders = groupedOrders.length;
  const totalItems = enquiries.length;
  const totalSpent = enquiries.reduce((sum, item) => sum + parseFloat(item.product_total), 0);

  const getProductImage = (item: EnquiryItem) => {
    return item.product_image_large || item.product_image_med || item.product_image_small || item.product_image;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
          <Button onClick={() => onNavigate('products')} className="bg-gradient-to-r from-indigo-600 to-indigo-500">
            Start Shopping
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>
        

        {/* Orders List - Directly showing all items */}
        <div className="space-y-6">
          {groupedOrders.map((order, idx) => (
            <motion.div
              key={order.order_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Order ID</p>
                        <p className="font-bold text-gray-900">#{order.order_id}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-300 hidden sm:block" />
                      <div>
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="font-semibold text-gray-900">{order.items.length}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-300 hidden sm:block" />
                      <div>
                        <p className="text-xs text-gray-600">Total Amount</p>
                        <p className="font-bold text-indigo-600 text-lg">₹{order.total_amount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items - Always Visible */}
                <div className="p-4 space-y-4">
                  {order.items.map((item, itemIdx) => (
                    <div
                      key={`${item.order_id}-${item.product_id}`}
                      className="flex gap-3 sm:gap-4 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => onNavigate(`product/${item.product_id}`)}
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={getProductImage(item)}
                          alt={item.product_name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 hover:text-indigo-600 truncate">
                          {item.product_name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600">{item.product_company_name}</p>
                        <p className="text-xs text-gray-500">{item.product_category_name}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {parseFloat(item.product_price).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Qty: {item.product_qty}
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-indigo-600">
                            Total: ₹{parseFloat(item.product_total).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 self-center flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};