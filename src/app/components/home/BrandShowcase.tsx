import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';

export const BrandShowcase: React.FC = () => {
  const brands = [
    { name: 'SFP', logo: '🚜', color: 'from-blue-600 to-indigo-600' },
    { name: 'SPADE', logo: '⚙️', color: 'from-indigo-600 to-purple-600' },
    { name: 'ORIGINAL', logo: '✓', color: 'from-purple-600 to-pink-600' },
  ];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-8"
        >
          Trusted Brands We Carry
        </motion.h3>

        <div className="grid grid-cols-3 gap-6">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="p-8 text-center cursor-pointer group hover:shadow-2xl transition-all duration-300">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`text-6xl mb-4 bg-gradient-to-r ${brand.color} bg-clip-text`}
                >
                  {brand.logo}
                </motion.div>
                <h4 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                  {brand.name}
                </h4>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
