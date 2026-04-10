import React, { useState } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, UserCircle, Package, Award } from 'lucide-react';
import logoImage from '../assets/dbb3a662c87a2a20de8c59dfa5e2eeba1ad617d7.png';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../app/components/ui/button';
import { Badge } from '../app/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      onNavigate(`products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'products' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img src={logoImage} alt="SFP Agricole" className="h-12 w-auto" />
          </motion.div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
           
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate('wishlist')}
            >
              <Heart className={`w-5 h-5 ${currentPage === 'wishlist' ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                  {wishlist.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingCart className={`w-5 h-5 ${currentPage === 'cart' ? 'text-indigo-600' : ''}`} />
              {getCartCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-indigo-600">
                  {getCartCount()}
                </Badge>
              )}
            </Button>

                      
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="text-sm">{user?.name}</span>
                  </Button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2"
                      >
                        {/* Profile button for all users */}
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </button>
                        
                        {/* Admin Panel only for admins */}
                        {user?.isAdmin && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setShowUserMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Package className="w-4 h-4" />
                            Admin Panel
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            onNavigate('home');
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button onClick={() => onNavigate('login')} className="bg-gradient-to-r from-indigo-600 to-indigo-500">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 pb-4">
          {navItems.map((item) => (
            <Button
              key={item.page}
              variant="ghost"
              onClick={() => onNavigate(item.page)}
              className={`${
                currentPage === item.page
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-600 hover:text-indigo-700'
              }`}
            >
              {item.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.page}
                    variant="ghost"
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`justify-start ${
                      currentPage === item.page
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.name}
                  </Button>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className="flex flex-col gap-2 pt-4 border-t">
                {isAuthenticated && user && (
                  <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">{user.name}</span>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-semibold text-amber-700">{user.points} Points</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onNavigate('wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist ({wishlist.length})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onNavigate('cart');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart ({getCartCount()})
                  </Button>
                </div>

                {isAuthenticated ? (
                  <>
                    {user?.isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          onNavigate('admin');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        onNavigate('home');
                      }}
                      className="text-red-600 border-red-200"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};