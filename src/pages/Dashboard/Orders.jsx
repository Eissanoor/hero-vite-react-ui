import React, { useEffect, useState } from 'react';
import { Card, Button } from '../../components/HeroUI';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../config/api';
import Spinner from '../../components/ui/Spinner';

const Orders = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let url = `${API_CONFIG.BASE_URL}/api/orders/history?period=day`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setHistoryData(data?.data || []);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setHistoryData(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-[#DCFCE7] text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total amount from all orders
  const totalAmount = historyData.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Active Orders</h1>
          <div className="flex items-center space-x-3">
            <span className="text-md font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {historyData.length} orders
            </span>
            <span className="text-md font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              Total: Rs {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchOrders}
            isLoading={loading}
            className="flex items-center space-x-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/new-order')} 
            className="bg-hero-primary text-white hover:bg-hero-primary-dark flex items-center space-x-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Order</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size={32} />
        </div>
      ) : error ? (
        <div className="flex justify-center py-8 text-red-600">
          {error}
        </div>
      ) : historyData.length === 0 ? (
        <div className="flex justify-center py-8 text-gray-600">
          No orders found
        </div>
      ) : (
        <div className="space-y-6">
          {historyData.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between border-b bg-gray-50 dark:bg-gray-700 p-4 sm:flex-nowrap">
                <div className="mb-2 flex items-center space-x-4 sm:mb-0">
                  <span className="font-bold text-hero-primary">Order ID :{order.orderid}</span>
                  <span className="text-gray-500 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {order.status === 'Pending' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order._id, 'Processing')}>
                      Start Processing
                    </Button>
                  )}

                  {order.status === 'Processing' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order._id, 'Ready')}>
                      Mark as Ready
                    </Button>
                  )}

                  {order.status === 'Ready' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order._id, 'Completed')}>
                      Complete Order
                    </Button>
                  )}

                  {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500"
                      onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {expandedOrderId === order._id ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>
              </div>

              <Card.Content className={`p-0 ${expandedOrderId === order._id ? 'block' : 'hidden'}`}>
                <div className="p-4">
                  <h6 className="mb-2 font-medium">Order Details</h6>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">Product</th>
                        <th className="pb-2 font-medium">Quantity</th>
                        <th className="pb-2 font-medium">Price</th>
                        <th className="pb-2 font-medium">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{item?.product?.name || ""}</td>
                          <td className="py-2">{item?.quantity || 0}</td>
                          <td className="py-2">Rs {item?.product?.price?.toFixed(2) || ""}</td>
                          <td className="py-2">Rs {(item?.quantity * item?.product?.price || "").toFixed(2) || ""}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="py-2 text-right font-medium">Total:</td>
                        <td className="py-2 font-bold">
                          Rs {order.products.reduce((sum, item) => sum + (item.quantity  * item?.product?.price || 0), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
