import React, { useEffect, useState } from 'react';
import { Card, Button } from '../../components/HeroUI';
import API_CONFIG from '../../config/api';
import Spinner from '../../components/ui/Spinner';
import { useNavigate, useParams } from 'react-router-dom';
import Receipt from '../../components/Receipt';
import ReactDOMServer from 'react-dom/server';
import { getMegaMenus } from '../../api/megamenu';
import { useQuery } from '@tanstack/react-query';

const NewOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false); 
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [originalOrder, setOriginalOrder] = useState(null);
  // Listen for online/offline events
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const token = localStorage.getItem('token');

    useEffect(() => {
      const fetchMenus = async () => {
        try {
          setLoading(true);
          const resp = await getMegaMenus(token);
          setMenuItems(resp.data || []);
        } catch (err) {
          // setError(err.message || 'Failed to fetch menu items');
        } finally {
          setLoading(false);
        }
      };
      fetchMenus();
      // eslint-disable-next-line
    }, []);

  // Sync pending orders when back online
  useEffect(() => {
    if (isOnline) {
      const pending = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
      if (pending.length > 0) {
        setSyncing(true);
        Promise.all(pending.map(async (orderData) => {
          const token = localStorage.getItem('token');
          try {
            await fetch(`${API_CONFIG.BASE_URL}/api/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : undefined
              },
              body: JSON.stringify(orderData)
            });
          } catch (e) { /* Optionally, handle/report errors here */ }
        })).then(() => {
          localStorage.removeItem('pendingOrders');
          setSyncing(false);
        });
      }
    }
  }, [isOnline]);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItemss");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderreceipt, setorderreceipt] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeMenu, setActiveMenu] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({ customerName: '', phoneNumber: '' });

  // Function to fetch products from API
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/products?search=${encodeURIComponent(searchQuery)}`, {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error('Failed to fetch products');
    }
    return result.data;
  };

  // Use React Query for products
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: fetchProducts,
    select: (data) => {
      // Filter products based on selected menu
      return activeMenu === 'all'
        ? data
        : data.filter(product => product.megaMenu?._id === activeMenu);
    },
    // staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The query will automatically refetch when searchQuery changes
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const addToCart = (item, isSpicy = false, size = "medium") => {
    setCartItems(prevItems => {
      // For existing items with same type and size, just increment quantity
      const existingItem = prevItems.find(i => 
        i._id === item._id && 
        i.isSpicy === isSpicy && 
        i.size === size
      );
      
      if (existingItem) {
        return prevItems.map(i =>
          (i._id === item._id && i.isSpicy === isSpicy && i.size === size)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { 
        ...item, 
        quantity: 1, 
        price: item.price, 
        isSpicy, 
        size 
      }];
    });
  };

  const removeFromCart = (itemId, isSpicy, size) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item._id === itemId && item.isSpicy === isSpicy && item.size === size)
    ));
  };

  const updateQuantity = (itemId, isSpicy, size, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === itemId && item.isSpicy === isSpicy && item.size === size) {
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
    const discountAmount = discount > subtotal ? subtotal : discount;
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  useEffect(() => {
    localStorage.setItem("cartItemss", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch order data if in update mode
  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        try {
          setLoading(true);
          setIsUpdateMode(true);
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_CONFIG.BASE_URL}/api/orders/${orderId}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined
            }
          });
          
          if (response.ok) {
            const orderData = await response.json();
            setOriginalOrder(orderData.data);
            
              // Map products to cart items format
              if (orderData.data && orderData.data.products) {
                const mappedCartItems = orderData.data.products.map(item => ({
                  ...item.product,
                  quantity: item.quantity,
                  _id: item.product._id,
                  isSpicy: item.isSpicy || false,
                  size: item.size || "medium"
                }));
                
                setCartItems(mappedCartItems);
              
              // Set customer info if available
              if (orderData.data.customerName) {
                setCustomerName(orderData.data.customerName);
              }
              
              if (orderData.data.phoneNumber) {
                setPhoneNumber(orderData.data.phoneNumber);
              }
              
              if (orderData.data.discount) {
                setDiscount(orderData.data.discount);
              }
            }
          } else {
            console.error('Failed to fetch order data');
            navigate('/dashboard/new-order');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchOrderData();
  }, [orderId, navigate]);

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

  const handleCheckout = () => {
    // Show the customer info popup
    setShowCustomerPopup(true);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { customerName: '', phoneNumber: '' };
    
    if (!customerName.trim()) {
      errors.customerName = 'Customer name is required';
      isValid = false;
    }
    
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const submitOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    setorderreceipt(true);
    const orderData = {
      products: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        isSpicy: item.isSpicy || false,
        size: item.size || "medium"
      })),
      customerName,
      phoneNumber,
      discount
    };
    
    if (!isOnline) {
      // Save to pending orders in localStorage
      const pending = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
      localStorage.setItem('pendingOrders', JSON.stringify([...pending, orderData]));
      setorderreceipt(false);
      // Print a temporary receipt with a placeholder orderResult
      const offlineOrderResult = {
        orderid: `OFFLINE-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Pending (Offline)',
        totalAmount: calculateTotals().total,
        customerName,
        phoneNumber,
        discount,
        products: orderData.products
      };
      handlePrintReceipt(offlineOrderResult);
      setCartItems([]);
      localStorage.removeItem('cartItemss');
      alert('Order saved offline and will be sent automatically when you are back online.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Determine if this is a create or update operation
      const url = isUpdateMode 
        ? `${API_CONFIG.BASE_URL}/api/orders/${orderId}` 
        : `${API_CONFIG.BASE_URL}/api/orders`;
        
      const method = isUpdateMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
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

        // Reset customer info
        setCustomerName('');
        setPhoneNumber('');

        // Navigate to orders page
        navigate('/dashboard/orders');
      } else {
        throw new Error(response.message || `Failed to ${isUpdateMode ? 'update' : 'place'} order`);
      }
    } catch (error) {
      console.error(`Error ${isUpdateMode ? 'updating' : 'placing'} order:`, error);
      setorderreceipt(false);
      // alert(error.message);
    }
  };

  // Function to handle image click
  const handleImageClick = (imageUrl, name) => {
    setSelectedImage({ url: imageUrl, name: name });
  };

  // Function to close image preview
  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  // Product Card Skeleton component
  const ProductCardSkeleton = () => (
    <Card className="flex flex-col overflow-hidden border border-gray-200 animate-pulse">
      <div className="flex-1 p-4">
        <div className="mb-5 flex h-32 w-full items-center justify-center">
          <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="space-y-1">
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="border-t p-3">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </Card>
  );

  // Cart Item Skeleton component
  const CartItemSkeleton = () => (
    <div className='border border-gray-200 rounded-lg px-3 py-2 shadow-sm animate-pulse'>
      <div className="flex justify-end">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="flex items-start space-x-4">
        <div className="w-24 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex flex-col space-y-4 flex-1">
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );

  // Offline/Sync Banner
  return (
    <>
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 mb-2">Offline Mode: Orders will be saved and synced when online.</div>
      )}
      {syncing && (
        <div className="bg-yellow-400 text-black text-center py-2 mb-2">Syncing pending orders...</div>
      )}
      <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Search bar */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold mr-4">{isUpdateMode ? 'Update Order' : 'New Order'}</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
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
          <div className="text-md text-gray-500 font-bold">
            {products.length} items found
          </div>
        </div>

        <div className='mb-6 overflow-x-auto'>
        {
        loading ? (
          <div className="flex flex-row ">
            {[...Array(6)].map((_, index) => (
                <div className="h-10 mx-2 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className='flex flex-nowrap space-x-2 min-w-max'>
            <button 
              onClick={() => setActiveMenu('all')}
              className={`border-4 px-4 py-1 text-md font-mono rounded-lg whitespace-nowrap mb-3 ${activeMenu === 'all' ? 'bg-restaurant-primary/20 border-restaurant-primary/40' : 'dark:border-restaurant-primary/20 dark:hover:border-restaurant-primary/30'}`}
            >
              All
            </button>
            {
              menuItems.map((item) => (
                <button 
                  key={item._id}
                  onClick={() => setActiveMenu(item._id)}
                  className={`border-4 px-4 py-1 text-md font-mono rounded-lg whitespace-nowrap mb-3 ${activeMenu === item._id ? 'bg-restaurant-primary/20 border-restaurant-primary/40' : 'dark:border-restaurant-primary/20 dark:hover:border-restaurant-primary/30'}`}
                >
                  {item?.name || ""}
                </button>
              ))
            }
          </div>
        )
      }

        </div>

        {/* Grid of items */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2">
            {[...Array(6)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
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
              {products.map((item) => (
                <Card key={item.id} className="flex flex-col overflow-hidden border border-gray-200">
                  <div className="flex-1 p-4">
                    {/* Barcode display area */}
                    <div className="mb-4 flex h-32 w-full items-center justify-center">
                      {/* <div className="h-16 w-48 "> */}
                      <img src={item.pic} alt={item.name} className="object-cover mb-3 h-40 w-full cursor-pointer" onClick={() => handleImageClick(item.pic, item.name)} />
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
                    <div className="flex flex-col space-y-2">
                      {item.type === 'family' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => addToCart(item, false, "family")}
                            className="bg-hero-primary text-white hover:bg-hero-primary-dark"
                          >
                            Family
                          </Button>
                          <Button
                            onClick={() => addToCart(item, true, "family")}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Spicy Family
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => addToCart(item, false, "small")}
                              className="bg-hero-primary text-white hover:bg-hero-primary-dark"
                            >
                              Small
                            </Button>
                            <Button
                              onClick={() => addToCart(item, true, "small")}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Small Spicy
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => addToCart(item, false, "medium")}
                              className="bg-hero-primary text-white hover:bg-hero-primary-dark"
                            >
                              Medium
                            </Button>
                            <Button
                              onClick={() => addToCart(item, true, "medium")}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Medium Spicy
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => addToCart(item, false, "large")}
                              className="bg-hero-primary text-white hover:bg-hero-primary-dark"
                            >
                              Large
                            </Button>
                            <Button
                              onClick={() => addToCart(item, true, "large")}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Large Spicy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Cart sidebar */}
      <div className="w-full lg:w-[350px] border-l bg-white p-6 dark:bg-gray-800 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-4 text-xl font-bold">Your Cart</h2>
          {
            loadingProducts ? (
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>

            ) : (
              <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full dark:bg-gray-700">
                {cartItems.length} items
              </span>
            )
          }
        </div>
        <div className="space-y-4">
          {/* Cart items */}
          {loadingProducts ? (
            [...Array(cartItems.length || 0)].map((_, index) => (
              <CartItemSkeleton key={index} />
            ))
          ) : (
            cartItems.map((item) => (
              <div className='border border-gray-200 rounded-lg px-3 py-2 shadow-sm'>
                <div className="flex justify-end">
                  <button
                    className="text-lg font-bold text-gray-400 hover:text-gray-600  border-2 border-red-300 hover:border-red-600 rounded-lg px-2"
                    onClick={() => removeFromCart(item._id, item.isSpicy, item.size)}
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
                    <div className="flex flex-wrap gap-1 mt-1">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isSpicy 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.isSpicy ? 'Spicy' : 'Normal'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex space-x-2 items-center bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200">
                    <button
                      className="rounded px-2 text-gray-500 hover:bg-gray-100"
                      onClick={() => updateQuantity(item._id, item.isSpicy, item.size, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="rounded px-2 text-gray-500 hover:bg-gray-100"
                      onClick={() => updateQuantity(item._id, item.isSpicy, item.size, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Rs {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))
          )}

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
              <div className="mb-2 flex justify-between">
                <span>Subtotal:</span>
                <span>Rs {calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="mb-2 flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>- Rs {calculateTotals().discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="mb-4 flex justify-between font-bold">
                {
                  loadingProducts ? (
                    <div className='flex flex-row justify-between w-full'>
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <span>Total:</span>
                      <span>Rs {calculateTotals().total.toFixed(2)}</span>
                    </>
                  )
                }
              </div>
              <Button className="w-full bg-hero-primary text-white hover:bg-hero-primary-dark" onClick={handleCheckout}
                isLoading={orderreceipt}
                isDisabled={orderreceipt}>
                {orderreceipt ? "Processing..." : isUpdateMode ? "Update Order" : "Proceed to Order"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={closeImagePreview}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
              className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  type="button"
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={closeImagePreview}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modal-title">
                      {selectedImage.name}
                    </h3>
                    <div className="relative w-full h-[60vh]">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.name}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Info Popup */}
      {showCustomerPopup && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
              className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slideIn"
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative header */}
              <div className="bg-hero-primary text-white p-6 relative">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                    onClick={() => setShowCustomerPopup(false)}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" id="modal-title">
                      Customer Details
                    </h3>
                    <p className="text-sm text-white text-opacity-80">
                      Please enter the customer information to proceed
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 px-6 py-6">
                <div className="space-y-6">
                  <div className="relative">
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Customer Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 ${formErrors.customerName ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (formErrors.customerName) {
                            setFormErrors({...formErrors, customerName: ''});
                          }
                        }}
                        className={`pl-10 block w-full rounded-lg shadow-sm focus:ring-2 transition-all duration-200 sm:text-sm dark:bg-gray-700 dark:text-white ${
                          formErrors.customerName 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-hero-primary focus:ring-hero-primary'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.customerName && (
                        <div className="flex items-center mt-1 text-sm text-red-500">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{formErrors.customerName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 ${formErrors.phoneNumber ? 'text-red-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (formErrors.phoneNumber) {
                            setFormErrors({...formErrors, phoneNumber: ''});
                          }
                        }}
                        className={`pl-10 block w-full rounded-lg shadow-sm focus:ring-2 transition-all duration-200 sm:text-sm dark:bg-gray-700 dark:text-white ${
                          formErrors.phoneNumber 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:border-hero-primary focus:ring-hero-primary'
                        }`}
                        placeholder="+92 123 456 7890"
                      />
                      {formErrors.phoneNumber && (
                        <div className="flex items-center mt-1 text-sm text-red-500">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{formErrors.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Discount (Rs)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        id="discount"
                        value={discount}
                        min="0"
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="pl-10 block w-full rounded-lg shadow-sm focus:ring-2 transition-all duration-200 sm:text-sm dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:border-hero-primary focus:ring-hero-primary"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex flex-col sm:flex-row-reverse sm:justify-between gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-lg border border-transparent px-5 py-3 bg-hero-primary text-base font-medium text-white hover:bg-hero-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hero-primary transition-colors duration-200 sm:w-auto"
                  onClick={() => {
                    setShowCustomerPopup(false);
                    submitOrder();
                  }}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Order
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-lg border border-gray-300 px-5 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hero-primary transition-colors duration-200 sm:w-auto dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setShowCustomerPopup(false)}
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default NewOrder;
