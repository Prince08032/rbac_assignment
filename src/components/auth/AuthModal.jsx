import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { showSuccessAlert, showErrorAlert } from '@/utils/alerts';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '', // Only for signup
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await showSuccessAlert(isLogin ? 'Login successful!' : 'Account created successfully!');
        onClose();
        window.location.reload();
      } else {
        showErrorAlert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      showErrorAlert('Authentication failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Background overlay - increased opacity from 70% to 85% */}
      <div className="fixed inset-0 bg-black/85" aria-hidden="true" />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-2xl">
          {/* Modal header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Dialog.Title>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isLogin 
                ? 'Please sign in to your account'
                : 'Fill in the information to create your account'}
            </p>
          </div>

          {/* Modal body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                         text-white font-medium transition-colors
                         dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* Modal footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 
                       dark:hover:text-blue-300 font-medium text-center"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal; 