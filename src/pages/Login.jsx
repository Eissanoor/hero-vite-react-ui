
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card } from '../components/HeroUI';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo login - in a real app, you would validate against a backend
    if (email === 'admin@example.com' && password === 'password') {
      // Simulate loading
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      }, 1000);
    } else {
      setLoading(false);
      setError('Invalid email or password. Try admin@example.com / password');
    }
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
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-gray-800/50"
                />
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
