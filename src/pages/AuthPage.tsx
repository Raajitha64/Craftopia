import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

interface AuthPageProps {
  initialTab?: 'signin' | 'signup';
  redirectPath?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialTab, redirectPath }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isLoading } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(
    (initialTab || params.tab as any || 'signin') === 'signup' ? 'signup' : 'signin'
  );
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Demo credentials
  const useDemoCredentials = () => {
    setEmail('demo@craftopia.com');
    setPassword('password');
  };
  
  const toggleTab = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    navigate(`/auth/${tab}${location.search}`);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, username, name);
      }
      
      // Redirect after successful authentication
      const redirectTo = redirectPath || '/';
      navigate(redirectTo);
    } catch (error) {
      console.error('Authentication error', error);
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-primary-600 rounded-xl shadow-xl border border-primary-500 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-primary-700 border-b border-primary-500 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-secondary-500" />
            <span className="text-xl font-bold text-secondary-50">Craftopia</span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-primary-500">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'signin'
                ? 'text-secondary-50 border-b-2 border-secondary-500'
                : 'text-secondary-300 hover:text-secondary-100'
            }`}
            onClick={() => toggleTab('signin')}
          >
            <span className="flex items-center justify-center">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </span>
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'signup'
                ? 'text-secondary-50 border-b-2 border-secondary-500'
                : 'text-secondary-300 hover:text-secondary-100'
            }`}
            onClick={() => toggleTab('signup')}
          >
            <span className="flex items-center justify-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </span>
          </button>
        </div>
        
        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
              <>
                <div className="mb-4">
                  <label htmlFor="name\" className="block text-sm font-medium text-secondary-200 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-secondary-200 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-secondary-200 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-secondary-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300 hover:text-secondary-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mb-4"
            >
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
            
            {activeTab === 'signin' && (
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={useDemoCredentials}
              >
                Use Demo Account
              </Button>
            )}
          </form>
          
          {activeTab === 'signin' && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-secondary-400 hover:text-secondary-200">
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;