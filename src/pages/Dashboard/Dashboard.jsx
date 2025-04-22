
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/HeroUI';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, loading, fetchUserProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setProfileLoading(true);
        // If we already have user data from context, use it
        if (user) {
          setUserProfile(user);
        } else {
          // Otherwise fetch it
          const userData = await fetchUserProfile();
          setUserProfile(userData);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [user, fetchUserProfile]);

  const stats = [
    { label: 'Total Products', value: 45 },
    { label: 'Menu Items', value: 23 },
    { label: 'Orders Today', value: 12 },
    { label: 'Revenue', value: '$1,245' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard Overview</h1>
      
      {/* User Profile Card */}
      <Card className="mb-8 border-l-4 border-hero-primary">
        <Card.Content className="p-6">
          {profileLoading ? (
            <p>Loading user profile...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userProfile ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Welcome!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="truncate">{userProfile._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p>{new Date(userProfile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>No user profile data available</p>
          )}
        </Card.Content>
      </Card>
      
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-l-4 border-hero-primary">
            <Card.Content className="flex flex-col p-6">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <span className="mt-2 text-3xl font-bold">{stat.value}</span>
            </Card.Content>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Recent Orders</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium">Order ID</th>
                    <th className="pb-3 pr-4 font-medium">Customer</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#1234', customer: 'John Doe', status: 'Completed', total: '$24.99' },
                    { id: '#1235', customer: 'Jane Smith', status: 'Processing', total: '$76.50' },
                    { id: '#1236', customer: 'Bob Johnson', status: 'Pending', total: '$53.25' },
                  ].map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 pr-4">{order.id}</td>
                      <td className="py-3 pr-4">{order.customer}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header>
            <Card.Title>Popular Products</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium">Product</th>
                    <th className="pb-3 pr-4 font-medium">Category</th>
                    <th className="pb-3 font-medium">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Espresso', category: 'Coffee', sales: 145 },
                    { name: 'Croissant', category: 'Bakery', sales: 98 },
                    { name: 'Sandwich', category: 'Food', sales: 65 },
                  ].map((product, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3 pr-4">{product.name}</td>
                      <td className="py-3 pr-4">{product.category}</td>
                      <td className="py-3">{product.sales}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
