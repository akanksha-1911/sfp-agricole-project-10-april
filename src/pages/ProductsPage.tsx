import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, X, ShoppingCart, Heart, Search, SlidersHorizontal, Download, Lock } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Input } from '../app/components/ui/input';
import { Checkbox } from '../app/components/ui/checkbox';
import { Label } from '../app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../app/components/ui/sheet';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

interface ProductsPageProps {
  onNavigate: (page: string) => void;
  searchQuery?: string;
}

interface Category {
  category_id: string;
  category_name: string;
  category_image: string;
  category_show_menu: string;
  category_featured: string;
  category_special: string;
  category_slug: string;
}

interface Company {
  company_id: string;
  company_name: string;
  company_slug: string;
  company_logo: string;
}

interface Tag {
  tag_id: string;
  tag_name: string;
  tag_slug: string;
}

interface APIProduct {
  product_id: string;
  product_name: string;
  product_company_id: string;
  product_company_name: string;
  product_category_id: string;
  product_category_name: string;
  product_brand_id: string;
  product_brand_name: string;
  product_mrp: string;
  product_price: string;
  product_export: string;
  product_domestic: string;
  product_both: string;
  product_image: string;
  product_image_small: string;
  product_image_med: string;
  product_image_large: string;
  product_image_extra_small: string;
  product_tags: string[];
}

interface TransformedProduct {
  id: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  brand: string;
  company: string;
  images: string[];
  isActive: boolean;
  tags: string[];
  discount: number;
  description: string;
  region: string;
  isSpecialOffer: boolean;
  stock: number;
  export: string;
  domestic: string;
  both: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate, searchQuery = '' }) => {
  const { addToCart, isLoading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [togglingWishlistId, setTogglingWishlistId] = useState<string | null>(null);

  const regions = ['Export', 'Domestic', 'Both'];

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const productsData = await apiService.getProducts();
        
        const transformedProducts: TransformedProduct[] = productsData.map((product: APIProduct) => {
          const discount = parseFloat(product.product_mrp) > parseFloat(product.product_price)
            ? Math.round(((parseFloat(product.product_mrp) - parseFloat(product.product_price)) / parseFloat(product.product_mrp)) * 100)
            : 0;
          
          let region = 'Domestic';
          if (product.product_export === 'yes' && product.product_domestic === 'yes') {
            region = 'Both';
          } else if (product.product_export === 'yes') {
            region = 'Export';
          } else if (product.product_domestic === 'yes') {
            region = 'Domestic';
          }
          
          const cleanedTags = product.product_tags.map(tag => tag.trim());
          
          return {
            id: product.product_id,
            name: product.product_name,
            price: parseFloat(product.product_price),
            mrp: parseFloat(product.product_mrp),
            category: product.product_category_name,
            brand: product.product_brand_name,
            company: product.product_company_name,
            images: [product.product_image],
            isActive: true,
            tags: cleanedTags,
            discount: discount,
            description: `${product.product_name} - High quality ${product.product_category_name.toLowerCase()} from ${product.product_brand_name}`,
            region: region,
            isSpecialOffer: discount > 20,
            stock: 100,
            export: product.product_export,
            domestic: product.product_domestic,
            both: product.product_both
          };
        });
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      setLoadingFilters(true);
      try {
        const [categoriesData, companiesData, tagsData] = await Promise.all([
          apiService.getCategories(),
          apiService.getCompanies(),
          apiService.getTags(),
        ]);
        setCategories(categoriesData);
        setCompanies(companiesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        toast.error('Failed to load filters');
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterData();
  }, []);

  const allTags = useMemo(() => {
    const apiTagNames = tags.map(tag => tag.tag_name);
    const productTags = products.flatMap(p => p.tags);
    const allUniqueTags = [...new Set([...apiTagNames, ...productTags])];
    return allUniqueTags.sort();
  }, [tags, products]);

  const allCategories = useMemo(() => {
    return categories.map(cat => cat.category_name);
  }, [categories]);

  const allCompanies = useMemo(() => {
    return companies.map(company => company.company_name);
  }, [companies]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.isActive);

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(p => selectedCompanies.includes(p.company));
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter(p => {
        if (selectedRegions.includes('Export') && p.region === 'Export') return true;
        if (selectedRegions.includes('Domestic') && p.region === 'Domestic') return true;
        if (selectedRegions.includes('Both') && p.region === 'Both') return true;
        return false;
      });
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(p =>
        p.tags.some(tag => selectedTags.includes(tag))
      );
    }

    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        filtered.sort((a, b) => {
          if (a.isSpecialOffer && !b.isSpecialOffer) return -1;
          if (!a.isSpecialOffer && b.isSpecialOffer) return 1;
          return 0;
        });
    }

    return filtered;
  }, [products, searchTerm, selectedCategories, selectedCompanies, selectedRegions, selectedTags, sortBy]);

  const toggleFilter = (value: string, selected: string[], setter: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setter(selected.filter(v => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedRegions([]);
    setSelectedTags([]);
    setSearchTerm('');
  };

  const handleWishlistToggle = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist', {
        duration: 2000
      });
      onNavigate('login');
      return;
    }

    setTogglingWishlistId(productId);
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
    setTogglingWishlistId(null);
  };

  const handleAddToCart = async (product: TransformedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart', {
        duration: 2000
      });
      onNavigate('login');
      return;
    }

    setAddingToCartId(product.id);
    await addToCart(product, 1);
    setAddingToCartId(null);
  };

  const handleDownloadBrochure = () => {
    toast.success('Brochure download started!', {
      duration: 1000
    });
  };

  const FilterSection = () => {
    const [tempSearch, setTempSearch] = useState(searchTerm);

    const applySearch = () => {
      setSearchTerm(tempSearch);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        applySearch();
      }
    };

    useEffect(() => {
      setTempSearch(searchTerm);
    }, [searchTerm]);

    return (
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-semibold mb-2 block">Search Products</Label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Input
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search"
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button 
              onClick={applySearch}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Search
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Press Enter or click Search button to apply filter</p>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Category</Label>
          {loadingFilters ? (
            <div className="text-sm text-gray-500">Loading categories...</div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allCategories.map(cat => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="cursor-pointer text-sm">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Company / Brand</Label>
          {loadingFilters ? (
            <div className="text-sm text-gray-500">Loading companies...</div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allCompanies.map(company => (
                <div key={company} className="flex items-center space-x-2">
                  <Checkbox
                    id={`company-${company}`}
                    checked={selectedCompanies.includes(company)}
                    onCheckedChange={() => toggleFilter(company, selectedCompanies, setSelectedCompanies)}
                  />
                  <Label htmlFor={`company-${company}`} className="cursor-pointer text-sm">
                    {company}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Region Availability</Label>
          <div className="space-y-2">
            {regions.map(region => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => toggleFilter(region, selectedRegions, setSelectedRegions)}
                />
                <Label htmlFor={`region-${region}`} className="cursor-pointer text-sm">
                  {region}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Product Tags</Label>
          {loadingFilters ? (
            <div className="text-sm text-gray-500">Loading tags...</div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allTags.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => toggleFilter(tag, selectedTags, setSelectedTags)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="cursor-pointer text-sm">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-[400px] lg:h-auto">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1658490266041-10f471248e7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwYWNjZXNzb3JpZXMlMjBwYXJ0cyUyMGNhdGFsb2d8ZW58MXx8fHwxNzczNzU4OTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Tractor Accessories Catalog"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-20 h-20 text-white/80" />
                  </div>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600">
                      Premium Products
                    </Badge>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      Exclusive Access to Our Product Catalog
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      Discover our comprehensive range of premium tractor accessories, spare parts, and agricultural equipment.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Wide Product Range</h3>
                          <p className="text-gray-600 text-sm">Over 500+ premium tractor accessories</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Trusted Brands</h3>
                          <p className="text-gray-600 text-sm">SFP, SPADE, and ORIGINAL products</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        To Download Our Product Brochure
                      </h2>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          size="lg"
                          onClick={handleDownloadBrochure}
                          className="bg-gradient-to-r from-green-600 to-emerald-600"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Now
                        </Button>
                        
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => onNavigate('login')}
                          className="border-2 border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Lock className="w-5 h-5 mr-2" />
                          Login to View Products
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Explore our wide range of premium tractor accessories</p>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-2">
              Showing results for: <span className="font-semibold text-green-600">"{searchTerm}"</span>
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            <span className="text-sm text-gray-600">
              {loadingProducts ? 'Loading...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Product' : 'Products'}`}
            </span>
            
            {(selectedCategories.length > 0 || selectedCompanies.length > 0 || selectedRegions.length > 0 || selectedTags.length > 0 || searchTerm) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="discount">Discount: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h2>
                {(selectedCategories.length > 0 || selectedCompanies.length > 0 || selectedRegions.length > 0 || selectedTags.length > 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs h-auto py-1"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <FilterSection />
            </Card>
          </aside>

          <div className="flex-1">
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
                      <div
                        className="relative overflow-hidden bg-gray-100 cursor-pointer"
                        onClick={() => onNavigate(`product/${product.id}`)}
                      >
                        <ImageWithFallback
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.discount > 0 && (
                          <Badge className="absolute top-3 right-3 bg-red-500">
                            {product.discount}% OFF
                          </Badge>
                        )}
                        <Badge className="absolute top-3 left-3 bg-green-600">
                          {product.brand}
                        </Badge>
                        {product.region && (
                          <Badge className="absolute bottom-3 left-3 bg-blue-600">
                            {product.region}
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                          onClick={(e) => handleWishlistToggle(product.id, e)}
                          disabled={togglingWishlistId === product.id || wishlistLoading}
                        >
                          {togglingWishlistId === product.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <Heart
                              className={`w-4 h-4 ${
                                isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                              }`}
                            />
                          )}
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          {product.tags.length > 0 && (
                            <span className="text-xs text-gray-400">
                              {product.tags[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px]">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-green-600">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500"
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={addingToCartId === product.id || cartLoading}
                          >
                            {addingToCartId === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};