// import React, { useEffect, useState } from 'react';
// import { Clock } from 'lucide-react';
// import { Product } from '../../../types';
// import { apiService } from '../../../services/apiService';
// import { ProductCard } from '../shared/ProductCard';

// interface SpecialOffersSectionProps {
//   onNavigate: (page: string) => void;
//   onAddToCart: (product: Product) => void;
// }

// export const TopRatedSection: React.FC<SpecialOffersSectionProps> = ({
//   onNavigate,
//   onAddToCart
// }) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchFeaturedProducts();
//   }, []);

//   const fetchFeaturedProducts = async () => {
//     setIsLoading(true);
//     try {
//       const featuredProducts = await apiService.getFeaturedProducts();
//       setProducts(featuredProducts);
//     } catch (error) {
//       console.error('Error fetching featured products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
//               <Clock className="w-4 h-4 animate-pulse" />
//               <span className="text-sm font-semibold">Loading Offers...</span>
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
//             <p className="text-gray-600">Grab these exclusive deals before they're gone!</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="bg-gray-200 h-64 rounded-lg"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (products.length === 0) {
//     return null;
//   }

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
//             <Clock className="w-4 h-4" />
//             <span className="text-sm font-semibold">Limited Time Offers</span>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
//           <p className="text-gray-600">Grab these exclusive deals before they're gone!</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product, idx) => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               onNavigate={onNavigate}
//               onAddToCart={onAddToCart}
//               delay={idx * 0.1}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };


import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Product } from '../../../types';
import { apiService } from '../../../services/apiService';
import { ProductCard } from '../shared/ProductCard';
import { useWishlist } from '../../../contexts/WishlistContext';

interface SpecialOffersSectionProps {
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
}

export const TopRatedSection: React.FC<SpecialOffersSectionProps> = ({
  onNavigate,
  onAddToCart
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setIsLoading(true);
    try {
      const featuredProducts = await apiService.getFeaturedProducts();
      setProducts(featuredProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold">Loading Offers...</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Special Offers</h2>
            <p className="text-gray-600">Grab these exclusive deals before they're gone!</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-14  bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-600">Grab these exclusive products before they're gone!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              onAddToCart={onAddToCart}
              onWishlistToggle={(e) => handleWishlistToggle(product, e)}
              isWishlisted={isInWishlist(product.id)}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};