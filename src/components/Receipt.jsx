import React from 'react';
import logoimage from "../Image/logo.jpeg"

const Receipt = ({ orderData, items }) => {
  const receipt = orderData?.receipt || {};

  return (
    <div className="p-8 max-w-md mx-auto bg-white">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-hero-primary shadow-lg">
            <img
              src={logoimage}
              alt="Restaurant Logo"
              className=" transform hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-3xl font-extrabold text-gray-800 ml-2">
            ZS Cafe
          </span>
          <p className="text-sm text-gray-600 font-medium mt-4">
            <span className="inline-flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(+92) 3329039903</span>
            </span>
          </p>
          <p className="text-sm text-gray-600 font-medium">
            <span className="inline-flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(+92) 3279799800</span>
            </span>
          </p>
        </div>
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
              <th className="pb-2 font-bold">Type</th>
              <th className="pb-2 font-bold">Price</th>
              <th className="pb-2 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="text-sm">
                <td className="py-1">{item.name}</td>
                <td className="py-1">{item.quantity}</td>
                <td className="py-1">{item.type}</td>
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
