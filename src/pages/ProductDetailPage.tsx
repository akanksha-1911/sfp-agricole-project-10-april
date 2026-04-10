import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, Share2, Download, Minus, Plus, Package, Shield, TrendingUp, Copy, MessageCircle, Facebook } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../app/components/ui/dialog';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

interface ProductImage {
  product_image_small: string;
  product_image_med: string;
  product_image_large: string;
  product_image_extra_small: string;
}

interface ProductFeature {
  title: string;
  info: string;
}

interface ProductReview {
  review: string;
  rate: string;
}

interface APIProductDetail {
  product_id: string;
  product_name: string;
  product_company_id: string;
  product_company_name: string;
  product_category_id: string;
  product_category_name: string;
  product_brand_id: string;
  product_brand_name: string;
  product_mrp: string;
  product_price: string;
  product_export: string;
  product_domestic: string;
  product_both: string;
  product_catalogue: string;
  product_image: string;
  product_image_small: string;
  product_image_med: string;
  product_image_large: string;
  product_image_extra_small: string;
  product_tags: string[];
  product_images: ProductImage[];
  product_features: ProductFeature[];
  product_reviews: ProductReview[];
}

interface TransformedProductDetail {
  id: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  brand: string;
  company: string;
  images: string[];
  tags: string[];
  discount: number;
  description: string;
  region: string;
  stock: number;
  catalogue: string;
  features: ProductFeature[];
  reviews: ProductReview[];
  export: string;
  domestic: string;
  both: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const { addToCart, isLoading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { products } = useProducts();
  
  const [product, setProduct] = useState<TransformedProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [catalogueDialogOpen, setCatalogueDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [catalogueForm, setCatalogueForm] = useState({ name: '', contact: '', email: '' });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const productData = await apiService.getProductDetail(productId);
        
        if (productData) {
          const discount = parseFloat(productData.product_mrp) > parseFloat(productData.product_price)
            ? Math.round(((parseFloat(productData.product_mrp) - parseFloat(productData.product_price)) / parseFloat(productData.product_mrp)) * 100)
            : 0;
          
          let region = 'Domestic';
          if (productData.product_export === 'yes' && productData.product_domestic === 'yes') {
            region = 'Both';
          } else if (productData.product_export === 'yes') {
            region = 'Export';
          } else if (productData.product_domestic === 'yes') {
            region = 'Domestic';
          }
          
          const allImages = [productData.product_image];
          if (productData.product_images && productData.product_images.length > 0) {
            productData.product_images.forEach(img => {
              if (img.product_image_large) {
                allImages.push(img.product_image_large);
              }
            });
          }
          
          const transformedProduct: TransformedProductDetail = {
            id: productData.product_id,
            name: productData.product_name,
            price: parseFloat(productData.product_price),
            mrp: parseFloat(productData.product_mrp),
            category: productData.product_category_name,
            brand: productData.product_brand_name,
            company: productData.product_company_name,
            images: allImages,
            tags: productData.product_tags || [],
            discount: discount,
            description: `${productData.product_name} - High quality ${productData.product_category_name?.toLowerCase() || ''} from ${productData.product_brand_name}`,
            region: region,
            stock: 100,
            catalogue: productData.product_catalogue || '',
            features: productData.product_features || [],
            reviews: productData.product_reviews || [],
            export: productData.product_export,
            domestic: productData.product_domestic,
            both: productData.product_both
          };
          
          setProduct(transformedProduct);
          
          if (products.length > 0) {
            const related = products
              .filter(p => p.category === transformedProduct.category && p.id !== transformedProduct.id && p.isActive)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        } else {
          toast.error('Product not found');
          onNavigate('products');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details');
        onNavigate('products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId, products, onNavigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        duration: 2000
      });
      onNavigate('login');
      return;
    }

    setIsAddingToCart(true);
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      category: product.category,
      brand: product.brand,
      company: product.company,
      images: product.images,
      discount: product.discount,
      region: product.region,
      stock: product.stock,
      tags: product.tags,
      description: product.description,
      isActive: true,
      isSpecialOffer: product.discount > 20
    };
    
    await addToCart(cartProduct, quantity);
    setIsAddingToCart(false);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist', {
        duration: 2000
      });
      onNavigate('login');
      return;
    }
    
    setIsTogglingWishlist(true);
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
    setIsTogglingWishlist(false);
  };

  const handleShare = () => {
    const productUrl = window.location.href;
    const shareText = `Check out ${product?.name} - ₹${product?.price.toLocaleString('en-IN')}`;
    
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: shareText,
        url: productUrl
      }).catch(() => {
        copyToClipboard(productUrl);
      });
    } else {
      setShareDialogOpen(true);
    }
  };

  const copyToClipboard = (text: string) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
      document.execCommand('copy');
      toast.success('Product link copied to clipboard!', {
        duration: 1000
      });
    } catch (err) {
      toast.error('Failed to copy link');
    }
    
    document.body.removeChild(tempInput);
  };

  const handleCopyLink = () => {
    copyToClipboard(window.location.href);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out ${product?.name} - ₹${product?.price.toLocaleString('en-IN')}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleCatalogueRequest = () => {
    if (catalogueForm.name && catalogueForm.contact && catalogueForm.email) {
      toast.success('Catalogue request submitted! We will send it to your email.', {
        duration: 1000
      });
      setCatalogueDialogOpen(false);
      setCatalogueForm({ name: '', contact: '', email: '' });
    } else {
      toast.error('Please fill all fields');
    }
  };

  const handleRelatedProductAddToCart = async (relatedProduct: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        duration: 2000
      });
      onNavigate('login');
      return;
    }

    await addToCart(relatedProduct, 1);
  };

  const showActualImage = !product?.catalogue || isAuthenticated;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => onNavigate('products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-green-600">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-green-600">Products</button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card className="overflow-hidden mb-4">
              <div className="relative bg-gray-100">
                <ImageWithFallback
                  src={showActualImage ? product.images[selectedImage] : 'https://images.unsplash.com/photo-1557487970-5d5211b65a82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
                {!showActualImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Package className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-semibold mb-2">Login to view actual images</p>
                      <Button variant="secondary" onClick={() => onNavigate('login')}>
                        Login Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            {showActualImage && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <Card
                    key={idx}
                    className={`cursor-pointer overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-green-600' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-2 bg-green-600">{product.brand}</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              </div>
              {product.discount > 0 && (
                <Badge className="bg-red-500 text-lg px-3 py-1">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline">{product.stock} in stock</Badge>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-indigo-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-green-600 font-semibold">
                      Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Inclusive of all taxes</p>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-semibold">{product.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Company</span>
                <p className="font-semibold">{product.company}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Region</span>
                <p className="font-semibold">{product.region}</p>
              </div>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Product Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="bg-gray-100 rounded-lg p-2">
                      <span className="text-xs text-gray-500">{feature.title}</span>
                      <p className="font-semibold text-sm">{feature.info}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <Label>Quantity:</Label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isAddingToCart}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isAddingToCart}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500"
                onClick={handleAddToCart}
                disabled={isAddingToCart || cartLoading}
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleWishlistToggle} 
                disabled={isAddingToCart || isTogglingWishlist || wishlistLoading}
              >
                {isTogglingWishlist ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                ) : (
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleCopyLink} disabled={isAddingToCart}>
                <Copy className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleWhatsAppShare} disabled={isAddingToCart}>
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleFacebookShare} disabled={isAddingToCart}>
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare} disabled={isAddingToCart}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {product.catalogue && (
              <Dialog open={catalogueDialogOpen} onOpenChange={setCatalogueDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mb-6">
                    <Download className="w-4 h-4 mr-2" />
                    Download Catalogue
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Catalogue</DialogTitle>
                    <DialogDescription>Enter your details to request the catalogue.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={catalogueForm.name}
                        onChange={(e) => setCatalogueForm({ ...catalogueForm, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact">Contact Number *</Label>
                      <Input
                        id="contact"
                        value={catalogueForm.contact}
                        onChange={(e) => setCatalogueForm({ ...catalogueForm, contact: e.target.value })}
                        placeholder="Your contact number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={catalogueForm.email}
                        onChange={(e) => setCatalogueForm({ ...catalogueForm, email: e.target.value })}
                        placeholder="Your email"
                      />
                    </div>
                    <Button onClick={handleCatalogueRequest} className="w-full">
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Product</DialogTitle>
                  <DialogDescription>Share this product with your friends and family</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleWhatsAppShare();
                      setShareDialogOpen(false);
                    }}
                  >
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    Share on WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleFacebookShare();
                      setShareDialogOpen(false);
                    }}
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    Share on Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      handleCopyLink();
                      setShareDialogOpen(false);
                    }}
                  >
                    <Copy className="w-5 h-5 text-gray-600" />
                    Copy Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Customer Reviews</h3>
                <div className="space-y-3">
                  {product.reviews.map((review, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < parseInt(review.rate) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.review}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center">
                <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">Fast Delivery</p>
              </Card>
              <Card className="p-4 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">Quality Assured</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold">Best Price</p>
              </Card>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card
                  key={relatedProduct.id}
                  className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-200"
                  onClick={() => onNavigate(`product/${relatedProduct.id}`)}
                >
                  <div className="relative overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-600">{relatedProduct.brand}</Badge>
                    {relatedProduct.discount > 0 && (
                      <Badge className="absolute top-3 right-3 bg-red-500">
                        {relatedProduct.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-indigo-600">
                        ₹{relatedProduct.price.toLocaleString('en-IN')}
                      </span>
                      {relatedProduct.mrp > relatedProduct.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{relatedProduct.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
                      onClick={(e) => handleRelatedProductAddToCart(relatedProduct, e)}
                      disabled={cartLoading}
                    >
                      {cartLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};