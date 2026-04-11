// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { WishlistItem } from '../types';
// import { useAuth } from './AuthContext';

// interface WishlistContextType {
//   wishlist: WishlistItem[];
//   addToWishlist: (productId: string) => void;
//   removeFromWishlist: (productId: string) => void;
//   isInWishlist: (productId: string) => boolean;
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
//   const { user, isAuthenticated } = useAuth();

//   // Load wishlist when user changes
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const userWishlistKey = `wishlist_${user.id}`;
//       const storedWishlist = localStorage.getItem(userWishlistKey);
//       if (storedWishlist) {
//         setWishlist(JSON.parse(storedWishlist));
//       } else {
//         setWishlist([]);
//       }
//     } else {
//       setWishlist([]);
//     }
//   }, [user, isAuthenticated]);

//   // Save wishlist when it changes and user is authenticated
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const userWishlistKey = `wishlist_${user.id}`;
//       localStorage.setItem(userWishlistKey, JSON.stringify(wishlist));
//     }
//   }, [wishlist, user, isAuthenticated]);

//   const addToWishlist = (productId: string) => {
//     if (!isAuthenticated) {
//       return;
//     }
//     setWishlist(prev => {
//       if (!prev.find(item => item.productId === productId)) {
//         return [...prev, { productId, addedAt: new Date().toISOString() }];
//       }
//       return prev;
//     });
//   };

//   const removeFromWishlist = (productId: string) => {
//     setWishlist(prev => prev.filter(item => item.productId !== productId));
//   };

//   const isInWishlist = (productId: string) => {
//     return wishlist.some(item => item.productId === productId);
//   };

//   return (
//     <WishlistContext.Provider value={{
//       wishlist,
//       addToWishlist,
//       removeFromWishlist,
//       isInWishlist
//     }}>
//       {children}
//     </WishlistContext.Provider>
//   );
// };

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error('useWishlist must be used within WishlistProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem } from '../types';
import { useAuth } from './AuthContext';
import { apiService } from '../services/apiService';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistProducts: any[]; // Add this to store full product details from API
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  syncWishlistWithServer: () => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]); // Store full product details
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Sync wishlist with server when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      syncWishlistWithServer();
    } else {
      setWishlist([]);
      setWishlistProducts([]);
    }
  }, [user, isAuthenticated]);

  const syncWishlistWithServer = async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoading(true);
    try {
      const serverWishlist = await apiService.getWishlist(user.user_id);
      console.log('Server wishlist response:', serverWishlist);
      
      if (serverWishlist && serverWishlist.length > 0) {
        // Store the full product details from API
        setWishlistProducts(serverWishlist);
        
        // Also store just the IDs for quick lookup
        const transformedWishlist: WishlistItem[] = serverWishlist.map((item: any) => ({
          productId: item.product_id,
          addedAt: new Date().toISOString()
        }));
        setWishlist(transformedWishlist);
        
        console.log('Wishlist products set:', serverWishlist);
      } else {
        setWishlist([]);
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to wishlist', {
        duration: 2000
      });
      return false;
    }

    setIsLoading(true);
    try {
      const response = await apiService.addToWishlist(user.user_id, productId);

      if (response && response.status === true && response.code === 200) {
        // Refresh wishlist from server to get latest data
        await syncWishlistWithServer();
        
        toast.success(response.message || 'Added to wishlist', {
          duration: 1000
        });
        return true;
      } else {
        throw new Error(response?.message || 'Failed to add to wishlist');
      }
    } catch (error: any) {
      console.error('Add to wishlist error:', error);
      toast.error(error.message || 'Failed to add to wishlist', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;

    setIsLoading(true);
    try {
      const response = await apiService.removeFromWishlist(user.user_id, productId);

      if (response && response.status === true && response.code === 200) {
        // Update local state
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        setWishlistProducts(prev => prev.filter(item => item.product_id !== productId));
        
        toast.success(response.message || 'Removed from wishlist', {
          duration: 1000
        });
        return true;
      } else {
        throw new Error(response?.message || 'Failed to remove from wishlist');
      }
    } catch (error: any) {
      console.error('Remove from wishlist error:', error);
      toast.error(error.message || 'Failed to remove from wishlist', {
        duration: 2000
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistProducts, // Provide full product details
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      syncWishlistWithServer,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};