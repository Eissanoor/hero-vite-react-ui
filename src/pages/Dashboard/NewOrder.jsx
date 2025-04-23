import React, { useEffect, useState } from 'react';
import { Card, Button } from '../../components/HeroUI';
import API_CONFIG from '../../config/api';
import Spinner from '../../components/ui/Spinner';
import { useNavigate } from 'react-router-dom';

const NewOrder = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItemss");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const barcodeTypes = [
    {
      id: 1,
      title: 'GLN',
      subtitle: 'Global Location Numbers',
      description: 'Physical and Functional locations',
      usage: 'GLNs uniquely identify locations and parties with global interoperability',
      image: '/images/barcode1.png'
    },
    {
      id: 2,
      title: 'GS1 EAN 13',
      description: 'Retail Items, Food, Non Food, Fresh Products and Beverages',
      usage: 'Ensures globally unique product identification for seamless trade',
      image: '/images/barcode2.png'
    },
    {
      id: 3,
      title: 'QR Code',
      description: 'Retail Items, Food, Non Food, Fresh Products and Beverages',
      usage: 'QR Codes store data for quick scanning, enabling efficient access and interaction',
      image: '/images/qrcode.png'
    },
    {
      id: 4,
      title: 'GTIN-13 (EAN/UCC-13)',
      description: 'Food and Non Food Items',
      usage: 'Uniquely identifies products globally, ensuring seamless trade and tracking',
      image: '/images/barcode3.png'
    },
    {
      id: 5,
      title: 'GTIN-14 (GS1-128 or ITF-14)',
      description: 'Pallets, Boxes/Cartons',
      usage: 'Identifies product groupings or cases, ensuring efficient supply chain management',
      image: '/images/barcode4.png'
    },
    {
      id: 6,
      title: 'GS1 GTIN, UPC/GTIN-13',
      description: 'Barcode for SABER Certificate',
      usage: 'Barcode for SABER Certificate',
      image: '/images/barcode5.png'
    }
  ];

  // Function to fetch products from API
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/products`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      const result = await res.json();
      console.log(result);
      
      if (result.success) setProducts(result.data);
      else console.error('Failed to fetch products:', result);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };
  
  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);
  

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


  const handleCheckout = async () => {
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
      const result = await response.json();
      console.log(result);
      
      if (response.ok) {
        // Clear the cart after successful order
        setCartItems([]);
        localStorage.removeItem('cartItemss');
        alert('Order placed successfully!');
        // Navigate to orders page
        navigate('/dashboard/orders');
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert('Failed to place order: ' + error.message);
    }
  };

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6">
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-64 rounded-lg border border-gray-300 px-4 py-2 focus:border-hero-primary focus:outline-none"
          />
        </div>

        {/* Grid of items */}
        {loadingProducts ? (
        <div className="flex justify-center py-8"><Spinner size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2">
          {products.map((item) => (
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
        )}
      </div>

      {/* Cart sidebar */}
      <div className="w-full lg:w-[350px] border-l bg-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-4 text-xl font-bold">Your Cart</h2>
          <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full">
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
                <div className="flex space-x-2 items-center bg-gray-50 rounded-md border border-gray-200">
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
              <Button className="w-full bg-hero-primary text-white hover:bg-hero-primary-dark"  onClick={handleCheckout}>
                Save & Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
