import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { apiService } from '../../../services/apiService';
import { toast } from 'sonner';

export const AboutSection: React.FC = () => {
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
        console.error('Error fetching about section content:', error);
        toast.error('Failed to load about content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMSContent();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
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
      </div>
    </section>
  );
};