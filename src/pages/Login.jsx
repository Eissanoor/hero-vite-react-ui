import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Card } from '../components/HeroUI';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || 'Invalid email or password');
        setLoading(false);
      }
      // No need to handle success case as the login function already navigates to dashboard
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-restaurant-primary/10 to-restaurant-secondary/30">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      <div className="container px-4 mx-auto">
        <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border border-restaurant-accent/20">
          <Card.Header>
            <Card.Title className="text-center text-2xl font-bold text-restaurant-primary dark:text-restaurant-secondary">
              Welcome Back
            </Card.Title>
            <Card.Description className="text-center text-gray-600 dark:text-gray-300">
              Enter your credentials to access the dashboard
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                  <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-400 dark:placeholder:opacity-100"
                />
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10 bg-white/50 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-400 dark:placeholder:opacity-100"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 mt-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 mt-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-restaurant-primary hover:bg-restaurant-primary/90 text-white"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;
