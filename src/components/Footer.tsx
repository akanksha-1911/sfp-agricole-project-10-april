import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-lg mb-4 text-indigo-400">SFP Agricole</h3>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner for premium tractor accessories and parts. Quality guaranteed, farmers approved.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4 text-indigo-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Contact
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-4 text-indigo-400">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('terms')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="text-gray-300 hover:text-indigo-400 transition-colors text-sm">
                  FAQ
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4 text-indigo-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-300">123 Farm Road, Agriculture District, New Delhi - 110001</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">+91 9876543210</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-300">info@tractorparts.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} SFP Agricole. All rights reserved. | Premium Quality Tractor Accessories</p>
        </div>
      </div>
    </footer>
  );
};