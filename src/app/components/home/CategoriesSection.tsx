// components/CategoriesSection.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/apiService';

interface Category {
  category_id: string;
  category_name: string;
  category_image: string;
  category_show_menu: string;
  category_featured: string;
  category_special: string;
  category_slug: string;
}

interface CategoriesSectionProps {
  onNavigate: (page: string, searchQuery?: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      if (data && Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    // Navigate to products page with category name as search query
    onNavigate(`products?search=${encodeURIComponent(category.category_name)}`);
  };

  if (loading) {
    return (
      <div className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-24 animate-pulse">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full"></div>
              <div className="h-3 mt-2 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <div className="px-4 py-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Shop by Category</h2>
        <button 
          onClick={() => onNavigate('products')}
          className="text-xs text-green-600 font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => handleCategoryClick(category)}
            className="flex-shrink-0 flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center group-active:scale-95 transition-transform duration-200 shadow-sm">
              {category.category_image ? (
                <img
                  src={category.category_image}
                  alt={category.category_name}
                  className="w-12 h-12 object-contain rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {category.category_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 mt-2 max-w-[70px] text-center truncate">
              {category.category_name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};