// ScrollingBanner.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { apiService, BannerSlideData } from '../../../services/apiService';

interface BannerSlide {
  image: string;
  title: string;
  subtitle: string;
  cta?: string;
  banner_id?: string;
}

interface ScrollingBannerProps {
  onNavigate?: (page: string) => void;
}

export const ScrollingBanner: React.FC<ScrollingBannerProps> = ({ onNavigate }) => {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default slides in case API fails
  const defaultSlides: BannerSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1763416160482-c77fadd32d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Premium Tractor Parts',
      subtitle: 'Quality You Can Trust',
      cta: 'Shop Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'SFP AGRICOLE',
      subtitle: 'Original Spare Parts',
      cta: 'Explore'
    },
    {
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Up to 20% Off',
      subtitle: 'Limited Time Offers',
      cta: 'View Deals'
    },
    {
      image: 'https://images.unsplash.com/photo-1581578017093-cd30ed9f64e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920',
      title: 'Fast Delivery',
      subtitle: 'Get Your Parts in 3-5 Days',
      cta: 'Learn More'
    }
  ];

  // Fetch banner slides from API
  useEffect(() => {
    const fetchBannerSlides = async () => {
      try {
        setLoading(true);
        const bannerData = await apiService.getHomeBanner();
        
        if (bannerData && bannerData.length > 0) {
          // Transform API data to match BannerSlide interface
          const transformedSlides: BannerSlide[] = bannerData.map((item: BannerSlideData) => ({
            banner_id: item.banner_id,
            image: item.banner_image,
            title: item.banner_title,
            subtitle: item.banner_caption,
            cta: 'Shop Now' // Default CTA text
          }));
          setSlides(transformedSlides);
          setError(null);
        } else {
          // Use default slides if API returns empty array
          console.warn('No banner data received, using default slides');
          setSlides(defaultSlides);
        }
      } catch (err) {
        console.error('Failed to fetch banner slides:', err);
        setError('Failed to load banner content');
        // Use default slides on error
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerSlides();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            <p className="mt-4 text-lg">Loading banner...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (error && slides.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg mb-4">Unable to load banner content</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl"
              >
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-200 mb-8"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                {slides[currentSlide].cta && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => onNavigate?.('products')}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-lg px-8"
                    >
                      {slides[currentSlide].cta}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="pointer-events-auto bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm w-12 h-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="pointer-events-auto bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm w-12 h-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentSlide ? 1 : -1);
              setCurrentSlide(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === idx
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          key={currentSlide}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
        />
      </div>
    </div>
  );
};