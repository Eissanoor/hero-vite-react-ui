
import React from 'react';
import { Card } from '../../components/HeroUI';

const History = () => {
  // Sample history data
  const historyData = [
    { 
      id: '#1234', 
      date: '2023-04-15', 
      customer: 'John Doe', 
      items: 3, 
      total: '$24.99', 
      status: 'Completed',
      payment: 'Credit Card'
    },
    { 
      id: '#1235', 
      date: '2023-04-14', 
      customer: 'Jane Smith', 
      items: 5, 
      total: '$76.50', 
      status: 'Completed',
      payment: 'PayPal'
    },
    { 
      id: '#1236', 
      date: '2023-04-13', 
      customer: 'Bob Johnson', 
      items: 2, 
      total: '$53.25', 
      status: 'Completed',
      payment: 'Cash'
    },
    { 
      id: '#1237', 
      date: '2023-04-12', 
      customer: 'Alice Williams', 
      items: 4, 
      total: '$42.75', 
      status: 'Completed',
      payment: 'Credit Card'
    },
    { 
      id: '#1238', 
      date: '2023-04-11', 
      customer: 'Charlie Brown', 
      items: 1, 
      total: '$18.99', 
      status: 'Completed',
      payment: 'Credit Card'
    },
    { 
      id: '#1239', 
      date: '2023-04-10', 
      customer: 'Diana Prince', 
      items: 6, 
      total: '$87.50', 
      status: 'Completed',
      payment: 'PayPal'
    },
    { 
      id: '#1240', 
      date: '2023-04-09', 
      customer: 'Ethan Hunt', 
      items: 3, 
      total: '$34.99', 
      status: 'Completed',
      payment: 'Cash'
    }
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Order History</h1>
      
      <Card>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Payment Method</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-hero-primary">{item.id}</td>
                    <td className="p-4">{item.date}</td>
                    <td className="p-4">{item.customer}</td>
                    <td className="p-4">{item.items} items</td>
                    <td className="p-4">{item.total}</td>
                    <td className="p-4">{item.payment}</td>
                    <td className="p-4">
                      <span className="inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default History;
