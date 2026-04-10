import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Users, ShoppingBag, Award, Plus, Edit, Trash2, Power } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../app/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Switch } from '../app/components/ui/switch';
import { Textarea } from '../app/components/ui/textarea';
import { Badge } from '../app/components/ui/badge';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';
import { categories } from '../data/mockData';
import { toast } from 'sonner';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { products, updateProduct, addProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    brand: 'SFP',
    category: '',
    subcategory: '',
    images: [],
    tags: [],
    company: '',
    region: 'Both',
    rating: 4.5,
    reviews: [],
    stock: 0,
    isActive: true,
    isRestricted: false
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page</p>
          <Button onClick={() => onNavigate('home')}>Go Home</Button>
        </Card>
      </div>
    );
  }

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productForm } as Product);
      toast.success('Product updated successfully');
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: `prod${Date.now()}`,
        name: productForm.name!,
        description: productForm.description!,
        price: productForm.price!,
        brand: productForm.brand as 'SFP' | 'SPADE' | 'ORIGINAL',
        category: productForm.category!,
        subcategory: productForm.subcategory!,
        images: productForm.images!,
        tags: productForm.tags!,
        company: productForm.company!,
        region: productForm.region as 'Export' | 'Domestic' | 'Both',
        rating: 4.5,
        reviews: [],
        stock: productForm.stock!,
        isActive: productForm.isActive!,
        isRestricted: productForm.isRestricted!
      };
      addProduct(newProduct);
      toast.success('Product added successfully');
      setIsAddDialogOpen(false);
    }

    setProductForm({
      name: '',
      description: '',
      price: 0,
      brand: 'SFP',
      category: '',
      subcategory: '',
      images: [],
      tags: [],
      company: '',
      region: 'Both',
      stock: 0,
      isActive: true,
      isRestricted: false
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      toast.success('Product deleted');
    }
  };

  const toggleProductActive = (product: Product) => {
    updateProduct({ ...product, isActive: !product.isActive });
    toast.success(product.isActive ? 'Product deactivated' : 'Product activated');
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'green' },
    { label: 'Active Products', value: products.filter(p => p.isActive).length, icon: Package, color: 'blue' },
    { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: ShoppingBag, color: 'red' },
    { label: 'Special Offers', value: products.filter(p => p.isSpecialOffer).length, icon: Award, color: 'amber' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage your e-commerce store</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('home')}>
            Back to Store
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Product Management</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-500">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                      <DialogDescription>
                        {editingProduct ? 'Make changes to the product details.' : 'Enter the product details.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label>Product Name *</Label>
                          <Input
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Description *</Label>
                          <Textarea
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Price *</Label>
                          <Input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Stock *</Label>
                          <Input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Brand *</Label>
                          <Select value={productForm.brand} onValueChange={(val) => setProductForm({ ...productForm, brand: val as any })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SFP">SFP</SelectItem>
                              <SelectItem value="SPADE">SPADE</SelectItem>
                              <SelectItem value="ORIGINAL">ORIGINAL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Category *</Label>
                          <Select value={productForm.category} onValueChange={(val) => setProductForm({ ...productForm, category: val })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Company *</Label>
                          <Input
                            value={productForm.company}
                            onChange={(e) => setProductForm({ ...productForm, company: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Region *</Label>
                          <Select value={productForm.region} onValueChange={(val) => setProductForm({ ...productForm, region: val as any })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Export">Export</SelectItem>
                              <SelectItem value="Domestic">Domestic</SelectItem>
                              <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Image URL</Label>
                          <Input
                            value={productForm.images?.[0] || ''}
                            onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={productForm.isActive}
                            onCheckedChange={(val) => setProductForm({ ...productForm, isActive: val })}
                          />
                          <Label>Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={productForm.isRestricted}
                            onCheckedChange={(val) => setProductForm({ ...productForm, isRestricted: val })}
                          />
                          <Label>Restricted (Login required)</Label>
                        </div>
                      </div>
                      <Button onClick={handleSaveProduct} className="w-full bg-gradient-to-r from-green-600 to-emerald-500">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell><Badge>{product.brand}</Badge></TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProductActive(product)}
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                handleEditProduct(product);
                                setIsAddDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="brands" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Brand Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['SFP', 'SPADE', 'ORIGINAL'].map(brand => {
                  const brandProducts = products.filter(p => p.brand === brand);
                  return (
                    <Card key={brand} className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{brand}</h3>
                      <p className="text-gray-600">{brandProducts.length} products</p>
                      <p className="text-sm text-gray-500">{brandProducts.filter(p => p.isActive).length} active</p>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Category Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => {
                  const catProducts = products.filter(p => p.category === category.name);
                  return (
                    <Card key={category.id} className="p-4">
                      <h3 className="font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{catProducts.length} products</p>
                      <div className="text-xs text-gray-500">
                        Subcategories: {category.subcategories.length}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};