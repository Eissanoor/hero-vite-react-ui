import React from 'react';
import logoimage from "../Image/logo.jpeg"

const Receipt = ({ orderData, items }) => {
  const receipt = orderData?.receipt || {};
  // Fallbacks for online/offline
  const orderid = orderData.orderid || receipt.orderid || orderData._id || "N/A";
  const receiptNumber = receipt.receiptNumber || orderid || "N/A";
  const date = receipt.date || orderData.createdAt || orderData.date || new Date().toISOString();
  // Customer information
  const customerName = orderData.customerName || receipt.customerName || "";
  const phoneNumber = orderData.phoneNumber || receipt.phoneNumber || "";
  const discount = orderData.discount || receipt.discount || 0;
  // Status and reference removed as they're not needed
  const itemList = items || orderData.products || [];
  const total = typeof orderData.totalAmount === 'number' ? orderData.totalAmount : (typeof receipt.total === 'number' ? receipt.total : 0);

  return (
    <div className="p-6 bg-white max-w-md mx-auto shadow-sm">
      <div className="text-center mb-4">
       
        <div className="space-y-1">
          <span className="text-2xl font-bold text-gray-800">
            ZS Cafe
          </span>
          <p className="text-xs text-gray-600 font-medium mt-2">
            <span className="inline-flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(+92) 3329039903</span>
            </span>
          </p>
          <p className="text-xs text-gray-600 font-medium">
            <span className="inline-flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(+92) 3279799800</span>
            </span>
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between text-xs">
            <span><span className='font-bold'>Order #:</span> {orderid}</span>
            <span><span className='font-bold'>Receipt #:</span> {receiptNumber}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span><span className='font-bold'>Date:</span> {new Date(date).toLocaleString()}</span>
          </div>
          {customerName && (
            <div className="flex justify-between text-xs mt-2">
              <span><span className='font-bold'>Customer:</span> {customerName}</span>
            </div>
          )}
          {phoneNumber && (
            <div className="flex justify-between text-xs">
              <span><span className='font-bold'>Phone:</span> {phoneNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t-2 border-black py-3 mb-3">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs border-b border-black">
              <th className="pb-2 font-bold">Item Name</th>
              <th className="pb-2 font-bold">Qty</th>
              <th className="pb-2 font-bold">Price</th>
              <th className="pb-2 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {itemList.map((item) => {
  const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
  const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
  const isSpicy = item.isSpicy || (item.type === 'spicy') || false;
  const size = item.size || 'medium';
  return (
    <tr key={item._id || item.product} className="text-xs border-b border-dashed border-gray-300">
      <td className="py-1">
        {item.name || item.product || ''}
        <div className="text-xs text-gray-600">
          {size.charAt(0).toUpperCase() + size.slice(1)}{isSpicy ? ' (Spicy)' : ''}
        </div>
      </td>
      <td className="py-1">{qty}</td>
      <td className="py-1">{price % 1 === 0 ? price : price.toFixed(2)}</td>
      <td className="py-1 text-right">{(qty * price) % 1 === 0 ? (qty * price) : (qty * price).toFixed(2)}</td>
    </tr>
  );
})} 
          </tbody>
        </table>
      </div>
      <div className="border-t-2 border-black pt-2">
        {discount > 0 && (
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>Rs {typeof total === 'number' ? (total + discount).toFixed(2) : '0'}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600 mb-2">
            <span>Discount</span>
            <span>- Rs {typeof discount === 'number' ? discount.toFixed(2) : '0'}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm mb-4">
          <span>Total</span>
          <span>Rs {typeof total === 'number' ? (total % 1 === 0 ? total : total.toFixed(2)) : '0'}</span>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-4 border-t border-black pt-3">
        <p>Thank you for your order!</p>
        <p className="mt-2">Note: This is a computer generated receipt.</p>
      </div>
    </div>
  );
};

export default Receipt;
