import React, { useEffect, useState } from 'react';
import { Card } from '../../components/HeroUI';
import { useAuth } from '../../context/AuthContext';
import API_CONFIG from '../../config/api';
import Spinner from '../../components/ui/Spinner';

const Dashboard = () => {
  const { user, loading, fetchUserProfile } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({ totalProducts:0, menuItems:0, ordersToday:0, revenue:0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [errorRecent, setErrorRecent] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [errorPopular, setErrorPopular] = useState(null);

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/dashboard/stats`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success) setStatsData(json.data);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoadingRecent(true);
      setErrorRecent(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/orders/history?period=day`, {
          headers: { 'Content-Type':'application/json', Authorization: token ? `Bearer ${token}` : undefined }
        });
        const json = await res.json();
        if (json.success) setRecentOrders(json.data.slice(0,3));
        else setErrorRecent('Failed to load recent orders');
      } catch (err) {
        setErrorRecent(err.message);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecentOrders();
  }, []);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      setLoadingPopular(true);
      setErrorPopular(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/dashboard/popular-products`, {
          headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined }
        });
        const json = await res.json();
        if (json.success) setPopularProducts(json.data);
        else setErrorPopular('Failed to load popular products');
      } catch (err) {
        setErrorPopular(err.message);
      } finally {
        setLoadingPopular(false);
      }
    };
    fetchPopularProducts();
  }, []);

  const statsArr = [
    { label: 'Total Products', value: statsData.totalProducts },
    { label: 'Menu Items', value: statsData.menuItems },
    { label: 'Orders Today', value: statsData.ordersToday },
    { label: 'Revenue', value: `${statsData.revenue}` }, 
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
        {statsArr.map((stat) => (
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
                    <th className="pb-3 pr-4 font-medium">Items</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRecent ? (
                    <tr><td colSpan={4} className="p-4">Loading...</td></tr>
                  ) : errorRecent ? (
                    <tr><td colSpan={4} className="p-4 text-red-500">{errorRecent}</td></tr>
                  ) : (
                    recentOrders.map(order => (
                      <tr key={order._id} className="border-b">
                        <td className="py-3 pr-4">#{order.orderid}</td>
                        <td className="py-3 pr-4">{order.products.reduce((sum,p)=>sum+p.quantity,0)} items</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">Rs {order.totalAmount}</td>
                      </tr>
                    ))
                  )}
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
                    <th className="pb-3 pr-4 font-medium">Menu</th>
                    <th className="pb-3 font-medium">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingPopular ? (
                    <tr><td colSpan={3} className="p-4">Loading...</td></tr>
                  ) : errorPopular ? (
                    <tr><td colSpan={3} className="p-4 text-red-500">{errorPopular}</td></tr>
                  ) : (
                    popularProducts.map((product, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-3 pr-4">{product.name}</td>
                        <td className="py-3 pr-4">{product.category}</td>
                        <td className="py-3">{product.sales}</td>
                      </tr>
                    ))
                  )}
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
