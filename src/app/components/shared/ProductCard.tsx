
// import React from 'react';
// import { motion } from 'motion/react';
// import { Star, Heart, ShoppingCart, Share2 } from 'lucide-react';
// import { Card } from '../ui/card';
// import { Badge } from '../ui/badge';
// import { Button } from '../ui/button';
// import { ImageWithFallback } from '../figma/ImageWithFallback';
// import { Product } from '../../../types';
// import { toast } from 'sonner';

// interface ProductCardProps {
//   product: Product;
//   onNavigate: (page: string) => void;
//   onAddToCart: (product: Product) => void;
//   onWishlistToggle?: (e: React.MouseEvent) => void;
//   isWishlisted?: boolean;
//   delay?: number;
// }

// export const ProductCard: React.FC<ProductCardProps> = ({ 
//   product, 
//   onNavigate, 
//   onAddToCart,
//   onWishlistToggle,
//   isWishlisted = false,
//   delay = 0 
// }) => {
//   const handleShare = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const productUrl = `${window.location.origin}/product/${product.id}`;
//     const shareText = `Check out ${product.name} - ₹${product.price.toLocaleString('en-IN')}`;
    
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: shareText,
//         url: productUrl
//       }).catch(() => {});
//     } else {
//       // Fallback method using temporary input element
//       const tempInput = document.createElement('input');
//       tempInput.value = productUrl;
//       tempInput.style.position = 'fixed';
//       tempInput.style.opacity = '0';
//       document.body.appendChild(tempInput);
//       tempInput.select();
//       tempInput.setSelectionRange(0, 99999); // For mobile devices
      
//       try {
//         document.execCommand('copy');
//         toast.success('Product link copied to clipboard!', {
//           duration: 1000
//         });
//       } catch (err) {
//         toast.error('Failed to copy link');
//       }
      
//       document.body.removeChild(tempInput);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay }}
//       whileHover={{ y: -8 }}
//     >
//       <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-indigo-200 relative">
//         {/* Quick View Overlay */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileHover={{ opacity: 1 }}
//           className="absolute inset-0 bg-black/5 z-10 pointer-events-none"
//         />

//         <div
//   className="relative overflow-hidden bg-gray-100"
//   onClick={() => onNavigate(`product/${product.id}`)}
// >
//   <ImageWithFallback
//     src={product.images[0]}
//     alt={product.name}
//     className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"  // Changed from h-48 to h-40
//   />
  
//   {/* Brand Badge */}
//   <Badge className="absolute top-2 left-2 bg-indigo-600">  {/* Changed from top-3 to top-2 */}
//     {product.brand || product.company || 'New'}
//   </Badge>

//   {/* Action Buttons */}
//   <div className="absolute bottom-2 right-2 flex gap-2">  {/* Changed from bottom-3 to bottom-2 */}
//     <motion.button
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.9 }}
//       className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"  // Changed from w-10 h-10 to w-8 h-8
//       onClick={handleShare}
//     >
//       <Share2 className="w-3.5 h-3.5 text-indigo-600" />  {/* Changed from w-4 h-4 to w-3.5 h-3.5 */}
//     </motion.button>
    
//     {onWishlistToggle && (
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"  // Changed from w-10 h-10 to w-8 h-8
//         onClick={onWishlistToggle}
//       >
//         <Heart 
//           className={`w-3.5 h-3.5 transition-colors ${  // Changed from w-4 h-4 to w-3.5 h-3.5
//             isWishlisted 
//               ? 'fill-red-500 text-red-500' 
//               : 'text-gray-600 hover:text-red-500'
//           }`}
//         />
//       </motion.button>
//     )}
//   </div>
// </div>

// <div className="p-3">  {/* Changed from p-4 to p-3 */}
//   <h3 className="font-semibold text-xs mb-1.5 line-clamp-2 min-h-[32px]">  {/* Changed from text-sm to text-xs, mb-2 to mb-1.5, min-h-[40px] to min-h-[32px] */}
//     {product.name}
//   </h3>
//   <div className="text-xs text-gray-600 mb-1.5">{product.category}</div>  {/* Changed from text-sm to text-xs, mb-2 to mb-1.5 */}
  
//   <div className="mb-2">  {/* Changed from mb-3 to mb-2 */}
//     <div className="flex items-center gap-1.5">  {/* Changed from gap-2 to gap-1.5 */}
//       <span className="text-base font-bold text-indigo-600">  {/* Changed from text-xl to text-base */}
//         ₹{product.price.toLocaleString('en-IN')}
//       </span>
//       {product.mrp && product.mrp > product.price && (
//         <span className="text-xs text-gray-400 line-through">  {/* Changed from text-sm to text-xs */}
//           ₹{product.mrp.toLocaleString('en-IN')}
//         </span>
//       )}
//     </div>
//   </div>

//   <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//     <Button
//       size="sm"
//       className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-xs py-1.5 h-8"  // Added text-xs py-1.5 h-8
//       onClick={(e) => {
//         e.stopPropagation();
//         onAddToCart(product);
//       }}
//     >
//       <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />  {/* Changed from w-4 h-4 mr-2 to w-3.5 h-3.5 mr-1.5 */}
//       Add to Cart
//     </Button>
//   </motion.div>
// </div>
//       </Card>
//     </motion.div>
//   );
// };


import React from 'react';
import { motion } from 'motion/react';
import { Star, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Product } from '../../../types';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onWishlistToggle?: (e: React.MouseEvent) => void;
  isWishlisted?: boolean;
  delay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onNavigate, 
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
  delay = 0 
}) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const shareText = `Check out ${product.name} - ₹${product.price.toLocaleString('en-IN')}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareText,
        url: productUrl
      }).catch(() => {});
    } else {
      // Fallback method using temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = productUrl;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices
      
      try {
        document.execCommand('copy');
        toast.success('Product link copied to clipboard!', {
          duration: 1000
        });
      } catch (err) {
        toast.error('Failed to copy link');
      }
      
      document.body.removeChild(tempInput);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -8 }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-indigo-200 relative">
        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/5 z-10 pointer-events-none"
        />

        <div
  className="relative overflow-hidden bg-gray-100"
  onClick={() => onNavigate(`product/${product.id}`)}
>
  <ImageWithFallback
    src={product.images[0]}
    alt={product.name}
    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"  // Changed from h-48 to h-40
  />
  
  {/* Brand Badge */}
  <Badge className="absolute top-2 left-2 bg-indigo-600">  {/* Changed from top-3 to top-2 */}
    {product.brand || product.company || 'New'}
  </Badge>

  {/* Action Buttons */}
  <div className="absolute bottom-2 right-2 flex gap-2">  {/* Changed from bottom-3 to bottom-2 */}
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"  // Changed from w-10 h-10 to w-8 h-8
      onClick={handleShare}
    >
      <Share2 className="w-3.5 h-3.5 text-indigo-600" />  {/* Changed from w-4 h-4 to w-3.5 h-3.5 */}
    </motion.button>
    
    {onWishlistToggle && (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"  // Changed from w-10 h-10 to w-8 h-8
        onClick={onWishlistToggle}
      >
        <Heart 
          className={`w-3.5 h-3.5 transition-colors ${  // Changed from w-4 h-4 to w-3.5 h-3.5
            isWishlisted 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-600 hover:text-red-500'
          }`}
        />
      </motion.button>
    )}
  </div>
</div>

<div className="p-3">  {/* Changed from p-4 to p-3 */}
  <h3 className="font-semibold text-xs mb-1.5 line-clamp-2 min-h-[32px]">  {/* Changed from text-sm to text-xs, mb-2 to mb-1.5, min-h-[40px] to min-h-[32px] */}
    {product.name}
  </h3>
</div>
      </Card>
    </motion.div>
  );
};