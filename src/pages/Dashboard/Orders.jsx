import React, { useState } from 'react';
import { Card, Button } from '../../components/HeroUI';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  // Sample order data
  const initialOrders = [
    { 
      id: '#1234', 
      customer: 'John Doe', 
      items: [
        { name: 'Espresso', quantity: 2, price: 3.99 },
        { name: 'Croissant', quantity: 1, price: 2.99 }
      ], 
      total: 10.97, 
      status: 'Pending',
      time: '10 mins ago'
    },
    { 
      id: '#1235', 
      customer: 'Jane Smith', 
      items: [
        { name: 'Cappuccino', quantity: 1, price: 4.99 },
        { name: 'Sandwich', quantity: 2, price: 7.99 }
      ], 
      total: 20.97, 
      status: 'Processing',
      time: '25 mins ago'
    },
    { 
      id: '#1236', 
      customer: 'Bob Johnson', 
      items: [
        { name: 'Latte', quantity: 1, price: 4.50 },
        { name: 'Muffin', quantity: 1, price: 3.25 }
      ], 
      total: 7.75, 
      status: 'Ready',
      time: '40 mins ago'
    }
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const navigate = useNavigate();
  
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-row justify-between">
      <h1 className="text-2xl font-bold">Active Orders</h1>
        <Button onClick={() => navigate('/dashboard/new-order')} className="bg-hero-primary text-white hover:bg-hero-primary-dark">
          New Order
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between border-b bg-gray-50 p-4 sm:flex-nowrap">
              <div className="mb-2 flex items-center space-x-4 sm:mb-0">
                <span className="font-bold text-hero-primary">{order.id}</span>
                <span className="text-gray-500">{order.time}</span>
                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {order.status === 'Pending' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Processing')}>
                    Start Processing
                  </Button>
                )}
                
                {order.status === 'Processing' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Ready')}>
                    Mark as Ready
                  </Button>
                )}
                
                {order.status === 'Ready' && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Completed')}>
                    Complete Order
                  </Button>
                )}
                
                {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-500" 
                    onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                  >
                    Cancel
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                </Button>
              </div>
            </div>
            
            <Card.Content className={`p-0 ${expandedOrderId === order.id ? 'block' : 'hidden'}`}>
              <div className="p-4">
                <h3 className="mb-2 font-medium">Customer: {order.customer}</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium">Quantity</th>
                      <th className="pb-2 font-medium">Price</th>
                      <th className="pb-2 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">${item.price.toFixed(2)}</td>
                        <td className="py-2">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="py-2 text-right font-medium">Total:</td>
                      <td className="py-2 font-bold">${order.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
