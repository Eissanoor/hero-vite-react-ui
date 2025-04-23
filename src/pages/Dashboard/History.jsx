import React, { useState, useEffect } from 'react';
import { Card } from '../../components/HeroUI';
import API_CONFIG from '../../config/api';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      let url = `${API_CONFIG.BASE_URL}/api/orders/history?period=${period}`;
      if (period === 'range') url += `&start=${startDate}&end=${endDate}`;
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setHistoryData(data.data);
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
    if (period !== 'range') fetchOrders();
  }, [period]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Order History</h1>
      
      <div className="flex items-center mb-4 space-x-2">
        <label>Period:</label>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="border rounded p-1">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="range">Range</option>
        </select>
        {period === 'range' && (
          <>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded p-1" />
            <span>-</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded p-1" />
            <button onClick={fetchOrders} className="bg-hero-primary text-white px-3 py-1 rounded">Filter</button>
          </>
        )}
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map(item => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-hero-primary">{item._id}</td>
                      <td className="p-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">{item.products.reduce((sum, p) => sum + p.quantity, 0)} items</td>
                      <td className="p-4">${item.totalAmount}</td>
                      <td className="p-4">{item.status}</td>
                      <td className="p-4">
                        <button onClick={() => setSelectedOrder(item)} className="text-blue-500 hover:underline">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      )}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-2 right-2 text-xl">×</button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p className="mb-2"><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p className="mb-2"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p className="mb-4"><strong>Status:</strong> {selectedOrder.status}</p>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Quantity</th>
                  <th className="p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map(p => (
                  <tr key={p._id}>
                    <td className="p-2">{p.product.name}</td>
                    <td className="p-2">{p.product.type}</td>
                    <td className="p-2 text-right">${p.product.price}</td>
                    <td className="p-2 text-right">{p.quantity}</td>
                    <td className="p-2 text-right">${p.product.price * p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right font-semibold">Total: ${selectedOrder.totalAmount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
