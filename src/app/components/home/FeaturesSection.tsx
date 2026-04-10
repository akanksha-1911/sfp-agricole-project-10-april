import React from 'react';
import { motion } from 'motion/react';
import { Package, Shield, TrendingUp, Users, LucideIcon } from 'lucide-react';
import { Card } from '../ui/card';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    { icon: Package, title: 'Wide Selection', desc: 'Over 500+ products' },
    { icon: Shield, title: 'Quality Assured', desc: 'Original parts only' },
    { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive rates' },
    { icon: Users, title: '24/7 Support', desc: 'Always here to help' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 hover:border-indigo-200">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
