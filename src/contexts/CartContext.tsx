// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { CartItem, Product } from '../types';
// import { useAuth } from './AuthContext';

// interface CartContextType {
//   cart: CartItem[];
//   addToCart: (product: Product, quantity?: number) => void;
//   removeFromCart: (productId: string) => void;
//   updateQuantity: (productId: string, quantity: number) => void;
//   clearCart: () => void;
//   getCartTotal: () => number;
//   getCartCount: () => number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const { user, isAuthenticated } = useAuth();

//   // Load cart when user changes
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const userCartKey = `cart_${user.id}`;
//       const storedCart = localStorage.getItem(userCartKey);
//       if (storedCart) {
//         setCart(JSON.parse(storedCart));
//       } else {
//         setCart([]);
//       }
//     } else {
//       setCart([]);
//     }
//   }, [user, isAuthenticated]);

//   // Save cart when it changes and user is authenticated
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const userCartKey = `cart_${user.id}`;
//       localStorage.setItem(userCartKey, JSON.stringify(cart));
//     }
//   }, [cart, user, isAuthenticated]);

//   const addToCart = (product: Product, quantity: number = 1) => {
//     if (!isAuthenticated) {
//       // Show message that user needs to login
//       return;
//     }
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.product.id === product.id);
//       if (existingItem) {
//         return prevCart.map(item =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
//       return [...prevCart, { product, quantity }];
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
//   };

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
//     setCart(prevCart =>
//       prevCart.map(item =>
//         item.product.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
//   };

//   const getCartCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   return (
//     <CartContext.Provider value={{
//       cart,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getCartTotal,
//       getCartCount
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within CartProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

interface CartItemFromAPI {
  product_user_id: string;
  product_id: string;
  product_name: string;
  product_qty: string;
  product_mrp: string;
  product_price: string;
  product_total_price: string;
  product_image: string;
  product_image_small: string;
  product_image_med: string;
  product_image_large: string;
  product_image_extra_small: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  syncCartWithServer: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart from server when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      syncCartWithServer();
    } else {
      setCart([]);
    }
  }, [user, isAuthenticated]);

  // Sync cart with server
  const syncCartWithServer = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    try {
      const serverCart = await apiService.getCart(user.user_id);
      
      if (serverCart && serverCart.length > 0) {
        // Transform server cart items to local format
        const transformedCart: CartItem[] = serverCart.map((item: CartItemFromAPI) => ({
          product: {
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.product_price),
            mrp: parseFloat(item.product_mrp),
            category: '',
            brand: '',
            company: '',
            images: [item.product_image],
            discount: parseFloat(item.product_mrp) > parseFloat(item.product_price) 
              ? Math.round(((parseFloat(item.product_mrp) - parseFloat(item.product_price)) / parseFloat(item.product_mrp)) * 100)
              : 0,
            region: '',
            stock: 100,
            tags: [],
            description: '',
            isActive: true,
            isSpecialOffer: false
          },
          quantity: parseInt(item.product_qty)
        }));
        setCart(transformedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to cart', {
        duration: 2000
      });
      return false;
    }

    setIsLoading(true);
    try {
      const totalPrice = product.price * quantity;
      
      const response = await apiService.addToCart({
        user_id: user.user_id,
        product_id: product.id,
        qty: quantity,
        price: product.price,
        total_price: totalPrice
      });

      if (response && response.status === true && response.code === 200) {
        // Update local cart state
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.product.id === product.id);
          if (existingItem) {
            return prevCart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prevCart, { product, quantity }];
        });
        
        toast.success(response.message || 'Added to cart', {
          duration: 1000
        });
        return true;
      } else {
        throw new Error(response?.message || 'Failed to add to cart');
      }
    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add to cart', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    setIsLoading(true);
    try {
      const response = await apiService.removeFromCart(user.user_id, productId);

      if (response && response.status === true && response.code === 200) {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
        toast.success(response.message || 'Removed from cart', {
          duration: 1000
        });
        return true;
      } else {
        throw new Error(response?.message || 'Failed to remove from cart');
      }
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      toast.error(error.message || 'Failed to remove from cart', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    setIsLoading(true);
    try {
      const cartItem = cart.find(item => item.product.id === productId);
      if (!cartItem) return false;

      const totalPrice = cartItem.product.price * quantity;

      const response = await apiService.updateCart({
        user_id: user.user_id,
        product_id: productId,
        qty: quantity,
        price: cartItem.product.price,
        total_price: totalPrice
      });

      if (response && response.status === true && response.code === 200) {
        setCart(prevCart =>
          prevCart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
        return true;
      } else {
        throw new Error(response?.message || 'Failed to update cart');
      }
    } catch (error: any) {
      console.error('Update quantity error:', error);
      toast.error(error.message || 'Failed to update quantity', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      syncCartWithServer,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};