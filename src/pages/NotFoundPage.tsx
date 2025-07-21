import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <h1 className="text-6xl font-bold text-secondary-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-secondary-50 mb-6">Page Not Found</h2>
        <p className="text-secondary-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Home className="w-5 h-5" />}
          onClick={() => navigate('/')}
        >
          Return Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;