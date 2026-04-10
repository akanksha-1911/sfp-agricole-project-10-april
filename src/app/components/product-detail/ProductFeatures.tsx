import React from 'react';
import { Package, Shield, TrendingUp } from 'lucide-react';
import { Card } from '../ui/card';

export const ProductFeatures: React.FC = () => {
  const features = [
    { icon: Package, label: 'Fast Delivery', desc: '3-5 Business Days' },
    { icon: Shield, label: 'Quality Assured', desc: '100% Original' },
    { icon: TrendingUp, label: 'Best Price', desc: 'Guaranteed' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {features.map((feature, idx) => (
        <Card key={idx} className="p-4 text-center">
          <feature.icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-xs font-semibold">{feature.label}</p>
          <p className="text-xs text-gray-600">{feature.desc}</p>
        </Card>
      ))}
    </div>
  );
};
