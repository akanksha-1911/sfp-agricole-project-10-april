import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

export const StatsCounter: React.FC = () => {
  const stats: Stat[] = [
    { value: 500, suffix: '+', label: 'Products Available', icon: '📦' },
    { value: 10000, suffix: '+', label: 'Happy Customers', icon: '😊' },
    { value: 3, suffix: '', label: 'Top Brands', icon: '⭐' },
    { value: 99, suffix: '%', label: 'Customer Satisfaction', icon: '💯' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <AnimatedStat key={idx} stat={stat} delay={idx * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimatedStat: React.FC<{ stat: Stat; delay: number }> = ({ stat, delay }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: delay + 0.2, type: 'spring' }}
        className="text-5xl mb-2"
      >
        {stat.icon}
      </motion.div>
      <motion.div
        className="text-4xl md:text-5xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        {count.toLocaleString()}
        {stat.suffix}
      </motion.div>
      <div className="text-sm md:text-base opacity-90">{stat.label}</div>
    </motion.div>
  );
};
