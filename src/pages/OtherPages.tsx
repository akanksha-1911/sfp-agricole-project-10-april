import React, { useState , useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Heart, FileText, Shield, RefreshCw, HelpCircle ,ShoppingCart } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Textarea } from '../app/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../app/components/ui/accordion';
import { useProducts } from '../contexts/ProductContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { Badge } from '../app/components/ui/badge';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

interface PageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<PageProps> = ({ onNavigate }) => {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCMSContent = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getCMSContent();
        if (data && data.about) {
          setCmsContent(data.about);
        }
      } catch (error) {
        console.error('Error fetching about page content:', error);
        toast.error('Failed to load about page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMSContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">
              {cmsContent?.head || 'About TractorParts'}
            </h1>
            <p className="text-xl opacity-90">Your trusted partner in agricultural excellence</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              {cmsContent?.title || 'Our Story'}
            </h2>
            {cmsContent?.details ? (
              <div 
                className="text-gray-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: cmsContent.details }}
              />
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  Founded in 2010, TractorParts has been serving the agricultural community with premium quality tractor accessories and parts. We understand the importance of reliable equipment in farming operations.
                </p>
                <p className="text-gray-700 mb-4">
                  With over 13 years of experience, we've built strong relationships with leading brands like SFP, SPADE, and ORIGINAL to bring you the best products at competitive prices.
                </p>
                <p className="text-gray-700">
                  Our mission is to support farmers with quality products, expert advice, and exceptional customer service.
                </p>
              </>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <ImageWithFallback
              src={cmsContent?.image || "https://images.unsplash.com/photo-1709715357510-b687304cee3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"}
              alt={cmsContent?.title || "Our Team"}
              className="rounded-2xl shadow-2xl w-full max-h-[400px] object-contain"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { title: '10,000+', subtitle: 'Happy Customers', icon: Heart },
            { title: '500+', subtitle: 'Products', icon: FileText },
            { title: '3', subtitle: 'Premium Brands', icon: Shield }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-8 text-center">
                <stat.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-green-600 mb-2">{stat.title}</h3>
                <p className="text-gray-600">{stat.subtitle}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export const ContactPage: React.FC<PageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: '',  // Add subject field
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the API
      const response = await apiService.postFeedback({
        st_name: formData.name,
        st_phone: formData.phone,
        st_email: formData.email,
        st_message: formData.message,
        st_subject: formData.subject
      });
      
      if (response.status && response.code === 200) {
        toast.success(response.message || 'Message sent! We will get back to you soon.', {
          duration: 1000
        });
        // Reset form on success
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send message. Please try again later.', {
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">We're here to help you</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">123 Farm Road, Agriculture District<br />New Delhi - 110001, India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">info@tractorparts.com<br />support@tractorparts.com</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  disabled={isSubmitting}
                  placeholder="How can we help you?"
                />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const WishlistPage: React.FC<PageProps> = ({ onNavigate }) => {
  const { wishlistProducts, removeFromWishlist, isLoading: wishlistLoading, syncWishlistWithServer } = useWishlist();
  const { addToCart, isLoading: cartLoading } = useCart();
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Sync wishlist when component mounts
  useEffect(() => {
    syncWishlistWithServer();
  }, []);

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingToCartId(product.id || product.product_id);
    
    // Convert wishlist product format to cart product format
    const cartProduct = {
      id: product.product_id || product.id,
      name: product.product_name,
      price: parseFloat(product.product_price),
      mrp: parseFloat(product.product_mrp),
      images: [product.product_image],
      brand: product.brand || 'SFP',
      discount: product.discount || 0
    };
    
    await addToCart(cartProduct, 1);
    setAddingToCartId(null);
  };

  const handleRemoveFromWishlist = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRemovingId(productId);
    await removeFromWishlist(productId);
    setRemovingId(null);
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite products here</p>
          <Button onClick={() => onNavigate('products')} className="bg-gradient-to-r from-green-600 to-emerald-500">
            Browse Products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">{wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.product_id} className="overflow-hidden">
              <div
                className="relative overflow-hidden bg-gray-100 cursor-pointer"
                onClick={() => onNavigate(`product/${product.product_id}`)}
              >
                <ImageWithFallback
                  src={product.product_image || product.images?.[0]}
                  alt={product.product_name}
                  className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-green-600">{product.brand || 'SFP'}</Badge>
                {product.discount > 0 && (
                  <Badge className="absolute top-3 right-3 bg-red-500">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">{product.product_name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-xl font-bold text-green-600">
                    ₹{parseFloat(product.product_price).toLocaleString('en-IN')}
                  </span>
                  {parseFloat(product.product_mrp) > parseFloat(product.product_price) && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{parseFloat(product.product_mrp).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={addingToCartId === product.product_id || cartLoading}
                  >
                    {addingToCartId === product.product_id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleRemoveFromWishlist(product.product_id, e)}
                    disabled={removingId === product.product_id}
                  >
                    {removingId === product.product_id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      'Remove'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC<PageProps> = () => {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse our products, add items to your cart, and proceed to checkout. You can pay using Cash on Delivery.'
    },
    {
      question: 'What is the return policy?',
      answer: 'We offer a 30-day return policy on all products. Items must be in original condition with packaging.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 5-7 business days. Express delivery is available for metro cities.'
    },
    {
      question: 'How do rewards points work?',
      answer: 'Earn 1 point for every ₹100 spent. Points can be redeemed for discounts on future purchases.'
    },
    {
      question: 'Are products genuine?',
      answer: 'Yes, all our products are 100% genuine and sourced directly from authorized distributors.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-600">Find answers to common questions</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-white rounded-lg border px-6">
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCMSContent = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getCMSContent();
        if (data && data.terms_conditions) {
          setCmsContent(data.terms_conditions);
        }
      } catch (error) {
        console.error('Error fetching terms:', error);
        toast.error('Failed to load terms & conditions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMSContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">
          {cmsContent?.head || 'Terms & Conditions'}
        </h1>
        <Card className="p-8 prose prose-green max-w-none">
          {cmsContent?.details ? (
            <div dangerouslySetInnerHTML={{ __html: cmsContent.details }} />
          ) : (
            <>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h2>2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials on TractorParts website for personal, non-commercial transitory viewing only.</p>
              
              <h2>3. Disclaimer</h2>
              <p>The materials on TractorParts website are provided on an 'as is' basis. TractorParts makes no warranties, expressed or implied.</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCMSContent = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getCMSContent();
        if (data && data.privacy_policy) {
          setCmsContent(data.privacy_policy);
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        toast.error('Failed to load privacy policy');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMSContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">
          {cmsContent?.head || 'Privacy Policy'}
        </h1>
        <Card className="p-8 prose prose-green max-w-none">
          {cmsContent?.details ? (
            <div dangerouslySetInnerHTML={{ __html: cmsContent.details }} />
          ) : (
            <>
              <h2>Information Collection</h2>
              <p>We collect information from you when you register on our site, place an order, or subscribe to our newsletter.</p>
              
              <h2>Information Use</h2>
              <p>We use the information we collect to process transactions, send periodic emails, and improve customer service.</p>
              
              <h2>Data Protection</h2>
              <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export const RefundPage: React.FC = () => {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCMSContent = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getCMSContent();
        if (data && data.refund_policy) {
          setCmsContent(data.refund_policy);
        }
      } catch (error) {
        console.error('Error fetching refund policy:', error);
        toast.error('Failed to load refund policy');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMSContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">
          {cmsContent?.head || 'Refund Policy'}
        </h1>
        <Card className="p-8 prose prose-green max-w-none">
          {cmsContent?.details ? (
            <div dangerouslySetInnerHTML={{ __html: cmsContent.details }} />
          ) : (
            <>
              <h2>30-Day Return Policy</h2>
              <p>We offer a 30-day return policy on all products purchased from TractorParts.</p>
              
              <h2>Eligibility</h2>
              <p>Products must be in original condition with all packaging and accessories. Damaged or used items may not be eligible for return.</p>
              
              <h2>Refund Process</h2>
              <p>Refunds will be processed within 7-10 business days of receiving the returned item.</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};