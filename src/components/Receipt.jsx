import React from 'react';

const Receipt = ({ orderData, items }) => {
  const receipt = orderData?.receipt || {};

  return (
    <div className="p-8 max-w-md mx-auto bg-white">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">Restaurant Name</h1>
        <p className="text-sm text-gray-600">123 Main Street</p>
        <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
      </div>

      <div className="mb-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span><span className='font-bold'>Order #:</span> {receipt.orderid || "Not Available"}</span>
            <span><span className='font-bold'>Receipt #:</span> {receipt.receiptNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span><span className='font-bold'>Date:</span> {new Date(receipt.date).toLocaleString()}</span>
            <span><span className='font-bold'>Status:</span> {receipt.orderStatus}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span><span className='font-bold'>Reference:</span> {receipt.orderReference}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm border-b">
              <th className="pb-2 font-bold">Item Name</th>
              <th className="pb-2 font-bold">Qty</th>
              <th className="pb-2 font-bold">Price</th>
              <th className="pb-2 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="text-sm">
                <td className="py-1">{item.name}</td>
                <td className="py-1">{item.quantity}</td>
                <td className="py-1">Rs {item.price.toFixed(2)}</td>
                <td className="py-1 text-right">Rs {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between font-bold mb-6">
        <span>Total</span>
        <span>Rs {receipt.total.toFixed(2)}</span>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        <p>Thank you for your order!</p>
        <p className="mt-2">Note: This is a computer generated receipt.</p>
      </div>
    </div>
  );
};

export default Receipt;
