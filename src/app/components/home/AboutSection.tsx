import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const AboutSection: React.FC = () => {

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2010, TractorParts has been serving the agricultural community with premium quality tractor accessories and parts. We understand the importance of reliable equipment in farming operations.
            </p>
            <p className="text-gray-700 mb-4">
              With over 13 years of experience, we've built strong relationships with leading brands like SFP, SPADE, and ORIGINAL to bring you the best products at competitive prices.
            </p>
            <p className="text-gray-700">
              Our mission is to support farmers with quality products, expert advice, and exceptional customer service.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1709715357510-b687304cee3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Our Team"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
		</div>
    </section>
  );
};
