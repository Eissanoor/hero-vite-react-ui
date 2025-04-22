
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title className="text-center text-2xl font-bold">Login to Dashboard</Card.Title>
          <Card.Description className="text-center">Enter your credentials to access the dashboard</Card.Description>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Login;
