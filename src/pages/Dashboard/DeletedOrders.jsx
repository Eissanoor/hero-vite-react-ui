import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/HeroUI';
import API_CONFIG from '../../config/api';
import * as XLSX from 'xlsx';
import Receipt from '../../components/Receipt';
import { useReactToPrint } from 'react-to-print';

const DeletedOrders = () => {
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const fetchDeletedOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/deleted`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setDeletedOrders(data.data);
      } else {
        setError('Failed to fetch deleted orders');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedOrders();
  }, []);

  // Calculate total amount from all deleted orders
  const totalAmount = deletedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deleted Orders</h1>
        <div className="flex items-center space-x-4">
          <span className="text-md font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {deletedOrders.length} orders
          </span>
          <span className="text-md font-semibold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 px-3 py-1 rounded-full">
            Total Deleted: Rs {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {loading ? (
        <p>Loading deleted orders...</p>
      ) : (
        <Card>
          <Card.Content>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left dark:bg-gray-900">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Items</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Deleted At</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4 font-medium">#{order.orderid}</td>
                      <td className="p-4">{order.customerName || 'N/A'}</td>
                      <td className="p-4">{order.phoneNumber || 'N/A'}</td>
                      <td className="p-4">{order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0)} items</td>
                      <td className="p-4">Rs {order.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td className="p-4">{order.deletedAt ? formatDate(order.deletedAt) : 'N/A'}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReceipt(true);
                            }} 
                            className="text-blue-500 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {deletedOrders.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No deleted orders found
                </div>
              )}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">Order Receipt (Deleted)</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handlePrint}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Print
                </button>
                <button 
                  onClick={() => setShowReceipt(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-4">
              <div ref={receiptRef}>
                <Receipt 
                  orderData={{
                    ...selectedOrder,
                    receipt: {
                      ...selectedOrder.receipt,
                      receiptNumber: selectedOrder.orderid,
                      date: selectedOrder.deletedAt || selectedOrder.createdAt
                    }
                  }}
                  items={selectedOrder.products?.map(p => ({
                    ...p,
                    name: p.product?.name,
                    price: p.product?.price,
                    _id: p._id || p.product?._id
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletedOrders;
