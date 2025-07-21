import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Search, Menu, X, ChevronDown, LogIn, UserCircle, MessageSquare, ShoppingCart, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  isHomePage: boolean;
  isScrolled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isHomePage, isScrolled }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  
  const categories = [
    { name: 'Graphic Design', path: '/explore?category=graphic-design' },
    { name: 'Digital Art', path: '/explore?category=digital-art' },
    { name: 'Handmade Crafts', path: '/explore?category=handmade-crafts' },
    { name: 'Photography', path: '/explore?category=photography' },
    { name: 'Music & Audio', path: '/explore?category=music-production' },
    { name: 'Writing & Translation', path: '/explore?category=writing-translation' },
    { name: 'Web Development', path: '/explore?category=web-development' },
  ];
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isHomePage
          ? 'bg-primary-700 shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-secondary-500" />
            <span className="text-xl font-bold text-secondary-50">Craftopia</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center text-secondary-100 hover:text-secondary-50">
                Categories
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-primary-600 border border-primary-500 rounded-md shadow-lg z-50">
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className="block px-4 py-2 text-sm text-secondary-100 hover:bg-primary-500 hover:text-secondary-50"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/explore" className="text-secondary-100 hover:text-secondary-50">
              Explore
            </Link>
            {isAuthenticated && (
              <Link to="/create-service" className="text-secondary-100 hover:text-secondary-50">
                Sell a Service
              </Link>
            )}
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full py-2 pl-10 pr-4 bg-primary-600 border border-primary-500 rounded-md text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-300 w-4 h-4" />
            </div>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-secondary-500">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-full h-full text-secondary-500" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-primary-600 border border-primary-500 rounded-md shadow-lg z-50"
                    >
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-primary-500">
                          <p className="text-sm font-medium text-secondary-50">{user?.name}</p>
                          <p className="text-xs text-secondary-300">@{user?.username}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-secondary-100 hover:bg-primary-500 hover:text-secondary-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/messages"
                          className="block px-4 py-2 text-sm text-secondary-100 hover:bg-primary-500 hover:text-secondary-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Messages
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setShowUserMenu(false);
                            navigate('/');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-danger-400 hover:bg-primary-500"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth/signin')}
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/auth/signup')}
                >
                  Join
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary-100 hover:text-secondary-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary-600 border-t border-primary-500"
          >
            <div className="px-4 py-3">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full py-2 pl-10 pr-4 bg-primary-700 border border-primary-500 rounded-md text-secondary-100 placeholder-secondary-300/50 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-300 w-4 h-4" />
              </div>
              
              <nav className="space-y-1">
                <div className="py-2 border-b border-primary-500">
                  <p className="text-sm font-medium text-secondary-50 mb-1">Categories</p>
                  <div className="ml-2 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        className="block py-1.5 text-sm text-secondary-100 hover:text-secondary-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <Link
                  to="/explore"
                  className="block py-2 text-secondary-100 hover:text-secondary-50 border-b border-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link
                      to="/create-service"
                      className="block py-2 text-secondary-100 hover:text-secondary-50 border-b border-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sell a Service
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center py-2 text-secondary-100 hover:text-secondary-50 border-b border-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center py-2 text-secondary-100 hover:text-secondary-50 border-b border-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Messages
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                        navigate('/');
                      }}
                      className="flex items-center w-full py-2 text-danger-400"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Sign Out
                    </button>
                  </>
                )}
                
                {!isAuthenticated && (
                  <div className="pt-2 flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        navigate('/auth/signin');
                        setIsMenuOpen(false);
                      }}
                      leftIcon={<LogIn className="w-4 h-4" />}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => {
                        navigate('/auth/signup');
                        setIsMenuOpen(false);
                      }}
                    >
                      Join
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};