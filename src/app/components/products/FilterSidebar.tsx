import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';

interface FilterSidebarProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedRegions: string[];
  onBrandChange: (brand: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onRegionChange: (region: string) => void;
  onClearFilters: () => void;
  brands: string[];
  categories: string[];
  subcategories: string[];
  regions: string[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedBrands,
  selectedCategories,
  selectedSubcategories,
  selectedRegions,
  onBrandChange,
  onCategoryChange,
  onSubcategoryChange,
  onRegionChange,
  onClearFilters,
  brands,
  categories,
  subcategories,
  regions,
  isMobileOpen = false,
  onMobileClose
}) => {
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
          {isMobileOpen && onMobileClose && (
            <Button variant="ghost" size="icon" onClick={onMobileClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-semibold mb-3">Brand</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => onBrandChange(brand)}
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer flex-1"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer flex-1"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {selectedCategories.length > 0 && subcategories.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Subcategory</h4>
          <div className="space-y-2">
            {subcategories.map((subcategory) => (
              <div key={subcategory} className="flex items-center gap-2">
                <Checkbox
                  id={`subcategory-${subcategory}`}
                  checked={selectedSubcategories.includes(subcategory)}
                  onCheckedChange={() => onSubcategoryChange(subcategory)}
                />
                <label
                  htmlFor={`subcategory-${subcategory}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {subcategory}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Region */}
      <div>
        <h4 className="font-semibold mb-3">Region</h4>
        <div className="space-y-2">
          {regions.map((region) => (
            <div key={region} className="flex items-center gap-2">
              <Checkbox
                id={`region-${region}`}
                checked={selectedRegions.includes(region)}
                onCheckedChange={() => onRegionChange(region)}
              />
              <label
                htmlFor={`region-${region}`}
                className="text-sm cursor-pointer flex-1"
              >
                {region}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  if (!isMobileOpen) {
    return (
      <Card className="p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        <FilterContent />
      </Card>
    );
  }

  // Mobile drawer
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="fixed inset-0 z-50 lg:hidden"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
        <FilterContent />
      </div>
    </motion.div>
  );
};
