import React from 'react';
import logoimage from "../Image/logo.jpeg"

const Receipt = ({ orderData, items }) => {
  const receipt = orderData?.receipt || {};
  // Fallbacks for online/offline
  const orderid = orderData.orderid || receipt.orderid || "Not Available";
  const receiptNumber = receipt.receiptNumber || "N/A";
  const date = receipt.date || orderData.createdAt || new Date().toISOString();
  const status = orderData.status || receipt.orderStatus || "N/A";
  const reference = receipt.orderReference || "N/A";
  const itemList = items || orderData.products || [];
  const total = typeof orderData.totalAmount === 'number' ? orderData.totalAmount : (typeof receipt.total === 'number' ? receipt.total : 0);

  return (
    <div className="p-8 bg-white">
      <div className="text-center mb-6">
       
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

      <div className="border-t border-gray-200 py-4 mb-4">
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
            {itemList.map((item) => {
  const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
  const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
  return (
    <tr key={item._id || item.product} className="text-sm">
      <td className="py-1">{item.name || item.product || ''}</td>
      <td className="py-1">{qty}</td>
      <td className="py-1">{item.type || ''}</td>
      <td className="py-1">Rs {price % 1 === 0 ? price : price.toFixed(2)}</td>
      <td className="py-1 text-right">Rs {(qty * price) % 1 === 0 ? (qty * price) : (qty * price).toFixed(2)}</td>
    </tr>
  );
})} 
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 pt-3 flex justify-between font-bold mb-6">
        <span>Total</span>
        <span>Rs {typeof total === 'number' ? (total % 1 === 0 ? total : total.toFixed(2)) : '0'}</span>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        <p>Thank you for your order!</p>
        <p className="mt-2">Note: This is a computer generated receipt.</p>
      </div>
    </div>
  );
};

export default Receipt;
