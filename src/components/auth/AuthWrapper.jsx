'use client';
import { useEffect, useState } from 'react';
import AuthModal from './AuthModal';
import { useRouter } from 'next/navigation';

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      setIsAuthenticated(response.ok);
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={true}
        onClose={() => {}}
      />
    );
  }

  return children;
};

export default AuthWrapper; 