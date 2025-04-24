import React, { useEffect, useState } from 'react';
import { Card, Button } from '../../components/HeroUI';
import API_CONFIG from '../../config/api';
import Spinner from '../../components/ui/Spinner';
import { useNavigate } from 'react-router-dom';
import Receipt from '../../components/Receipt';
import ReactDOMServer from 'react-dom/server';

const NewOrder = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItemss");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orderreceipt, setorderreceipt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Function to fetch products from API
  const fetchProducts = async (search = '') => {
    setLoadingProducts(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/products?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      const result = await res.json();

      if (result.success) setProducts(result.data);
      else console.error('Failed to fetch products:', result);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get current products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i._id === item._id);
      if (existingItem) {
        return prevItems.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { ...item, quantity: 1, price: item.price }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) {
            return item; // Don't allow quantity below 1
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // const vat = subtotal * 0.15;
    // const total = subtotal + vat;
    // return { subtotal, vat, total };
    return { subtotal };
  };

  useEffect(() => {
    localStorage.setItem("cartItemss", JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to handle printing receipt
  const handlePrintReceipt = (orderResult) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="receipt">
            ${ReactDOMServer.renderToString(
              <Receipt
                orderData={orderResult}
                items={cartItems}
              />
            )}
          </div>
          <script>
            window.onload = function() {
              window.print();
              // Only close after printing on non-mobile devices
              if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      alert('Please allow pop-ups to print the receipt');
    }
  };

  const handleCheckout = async () => {
    setorderreceipt(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        }))
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(orderData)
      });
      setorderreceipt(false);
      
      if (response.ok) {
        const orderResult = await response.json();
        console.log('Order Response:', orderResult);
        
        // Handle printing
        handlePrintReceipt(orderResult);

        // Clear cart
        setCartItems([]);
        localStorage.removeItem('cartItemss');

        // Navigate to orders page
        // navigate('/dashboard/orders');
      } else {
        throw new Error(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setorderreceipt(false);
      // alert(error.message);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Search bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-hero-primary focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            {loadingProducts && (
              <span className="text-sm text-gray-500">Searching...</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {products.length} products found
          </div>
        </div>

        {/* Grid of items */}
        {loadingProducts ? (
          <div className="flex justify-center py-8"><Spinner size={32} /></div>
        ) : currentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 7h16M4 15h16M4 11h16"
              />
            </svg>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-400">No products found</p>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your search to find what you're looking for
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2">
              {currentProducts.map((item) => (
                <Card key={item.id} className="flex flex-col overflow-hidden border border-gray-200">
                  <div className="flex-1 p-4">
                    {/* Barcode display area */}
                    <div className="mb-4 flex h-32 w-full items-center justify-center">
                      {/* <div className="h-16 w-48 "> */}
                      <img src={item.pic} alt={item.name} className="object-contain mb-3" />
                      {/* </div> */}
                    </div>

                    {/* Item details */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-hero-primary">{item.name}</h3>
                      <p className="text-sm text-green-600">{item.description}</p>
                      <p className="text-md text-gray-500">Price: {item.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Type: {item.type}</p>
                    </div>
                  </div>

                  {/* Add to cart button */}
                  <div className="border-t p-3">
                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full bg-hero-primary text-white hover:bg-hero-primary-dark"
                    >
                      Add Options
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {products.length > itemsPerPage && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm"
                  >
                    Previous
                  </Button>
                  {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, index) => (
                    <Button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`px-4 py-2 text-sm ${
                        currentPage === index + 1
                          ? 'bg-hero-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </Button>
                  ))}
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                    className="px-4 py-2 text-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart sidebar */}
      <div className="w-full lg:w-[350px] border-l bg-white p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-4 text-xl font-bold">Your Cart</h2>
          <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full dark:bg-gray-700">
            {cartItems.length} items
          </span>
        </div>
        <div className="space-y-4">
          {/* Cart items */}
          {cartItems.map((item) => (
            <div className='border border-gray-200 rounded-lg px-3 py-2 shadow-sm'>
              <div className="flex justify-end">
                <button
                  className="text-lg font-bold text-gray-400 hover:text-gray-600  border-2 border-red-300 hover:border-red-600 rounded-lg px-2"
                  onClick={() => removeFromCart(item._id)}
                >
                  X
                </button>
              </div>
              <div key={item.id} className="flex items-start space-x-4">
                <img
                  src={item.pic || ""}
                  alt={item.name}
                  className="w-24 h-20 object-contain mb-1 border border-gray-200 rounded-lg"
                />
                <div className="flex flex-col">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500 mt-4">Type: {item.type}</p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                {/* <div className="flex-1"> */}
                <div className="flex space-x-2 items-center bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200">
                  <button
                    className="rounded px-2 text-gray-500 hover:bg-gray-100"
                    onClick={() => updateQuantity(item._id, -1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="rounded px-2 text-gray-500 hover:bg-gray-100"
                    onClick={() => updateQuantity(item._id, 1)}
                  >
                    +
                  </button>
                </div>
                {/* </div> */}
                <div className="text-right">
                  <div className="font-medium">Rs {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Cart summary */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4">
              {/* <div className="mb-2 flex justify-between">
                <span>Subtotal:</span>
                <span>SAR {calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              <div className="mb-2 flex justify-between text-sm text-gray-600">
                <span>VAT (15%):</span>
                <span>SAR {calculateTotals().vat.toFixed(2)}</span>
              </div> */}
              <div className="mb-4 flex justify-between font-bold">
                <span>Total:</span>
                <span>Rs {calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-hero-primary text-white hover:bg-hero-primary-dark" onClick={handleCheckout}
                isLoading={orderreceipt}
                isDisabled={orderreceipt}>
                {orderreceipt ? "Processing..." : "Proceed to Order"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
