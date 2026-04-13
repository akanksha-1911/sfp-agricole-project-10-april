import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { apiService, TestimonialData } from '../../../services/apiService';

// Transform API data to match component structure
const transformTestimonial = (apiTestimonial: TestimonialData) => {
  // Extract name and role from testimonial_name (format: "Name, Role")
  const nameParts = apiTestimonial.testimonial_name.split(',');
  const name = nameParts[0]?.trim() || 'Customer';
  const role = nameParts[1]?.trim() || 'Happy Customer';
  
  return {
    name: name,
    role: role,
    content: apiTestimonial.testimonial_review,
    rating: 5, // API doesn't provide rating, defaulting to 5 stars
    avatar: apiTestimonial.testimonial_image // Use actual image URL instead of emoji
  };
};

export const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTestimonials();
        if (data && data.length > 0) {
          const transformedData = data.map(transformTestimonial);
          setTestimonials(transformedData);
        } else {
          setTestimonials([]);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-sm sm:text-base text-gray-600">Trusted by thousands of farmers across India</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8 md:p-12">
              <div className="flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
                <div className="animate-pulse text-gray-400">Loading testimonials...</div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error || testimonials.length === 0) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-sm sm:text-base text-gray-600">Trusted by thousands of farmers across India</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8 md:p-12">
              <div className="text-center text-gray-500">
                {error || 'No testimonials available at the moment'}
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-sm sm:text-base text-gray-600">Trusted by thousands of farmers across India</p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative px-4 sm:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 sm:p-8 md:p-12 relative overflow-hidden">
                {/* Quote Icon - Responsive positioning */}
                <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 opacity-20">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-600" />
                </div>
                
                <div className="relative z-10">
                  {/* Rating Stars - Uncomment if needed */}
                  {/* <div className="flex items-center gap-1 mb-4 sm:mb-6 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < testimonials[currentIndex].rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div> */}

                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 text-center mb-6 sm:mb-8 italic px-2 sm:px-4">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                      {testimonials[currentIndex].avatar && testimonials[currentIndex].avatar.startsWith('http') ? (
                        <img 
                          src={testimonials[currentIndex].avatar} 
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to emoji if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('span');
                              fallback.className = 'text-xl sm:text-2xl';
                              fallback.textContent = '👨‍🌾';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-xl sm:text-2xl">👨‍🌾</span>
                      )}
                    </div>
                    
                    {/* Name and Role */}
                    <div className="text-left">
                      <div className="font-bold text-base sm:text-lg">{testimonials[currentIndex].name}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{testimonials[currentIndex].role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <div className="flex gap-1.5 sm:gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    currentIndex === idx 
                      ? 'bg-indigo-600 w-4 sm:w-6' 
                      : 'bg-gray-300 w-1.5 sm:w-2'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};