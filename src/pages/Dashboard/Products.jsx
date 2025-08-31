import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input } from '../../components/HeroUI';
import API_CONFIG from '../../config/api.js';
import Spinner from '../../components/ui/Spinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', type: '', picture: '', megaMenu: '' });
  const [picturePreview, setPicturePreview] = useState('');
  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  // Function to fetch products from API
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/products`, {
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

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString() : '',
        type: product.type || '',
        megaMenu: product.megaMenu?._id || '',
        picture: '', // File input is always empty on edit
      });
      setPicturePreview(product.pic || '');
      setIsEditing(true);
      setCurrentId(product._id);
    } else {
      setFormData({ name: '', description: '', price: '', type: '', picture: '', megaMenu: '' });
      setPicturePreview('');
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  useEffect(() => {
    if (modalOpen) {
      setLoadingMenus(true);
      const token = localStorage.getItem('token');
      fetch(`${API_CONFIG.BASE_URL}/api/megamenu/`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setMenus(data.data);
          else console.error('Failed to fetch menus:', data);
        })
        .catch(err => {
          console.error('Error fetching menus:', err);
        })
        .finally(() => setLoadingMenus(false));
    }
  }, [modalOpen]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'picture' && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, picture: file });
      setPicturePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    payload.append('price', formData.price);
    payload.append('type', formData.type);
    payload.append('megaMenu', formData.megaMenu);
    if (formData.picture) {
      payload.append('pic', formData.picture);
    }
    try {
      const token = localStorage.getItem('token');
      // Determine endpoint and HTTP method based on editing state
      const url = isEditing
        ? `${API_CONFIG.BASE_URL}/api/products/${currentId}`
        : `${API_CONFIG.BASE_URL}/api/products`;
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: payload,
      });
      const data = await response.json();
      if (data.success) {
        handleCloseModal();
        // Refresh product list
        fetchProducts();
      } else alert('Failed to add/update product');
    } catch (err) {
      alert('Error submitting form');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      const data = await res.json();
      if (data.success) fetchProducts();
      else {
        alert('Failed to delete product'); console.error('Delete failed:', data);
      }
    } catch (err) {
      alert('Error deleting product'); console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate total value of all products
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Items</h1>
          <div className="flex items-center space-x-3">
            <span className="text-md font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {products.length} items
            </span>
            {/* <span className="text-md font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              Total Value: Rs {totalValue.toFixed(2)}
            </span> */}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === 'table' ? 'solid' : 'outline'} size="sm" onClick={() => setViewMode('table')}> 
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <Button variant={viewMode === 'grid' ? 'solid' : 'outline'} size="sm" onClick={() => setViewMode('grid')}> 
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
            </svg>
          </Button>
          <Button onClick={() => handleOpenModal()} className="bg-hero-primary text-white hover:bg-hero-primary-dark flex items-center space-x-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Item</span>
          </Button>
        </div>
      </div>
      
      {loadingProducts ? (
        <div className="flex justify-center py-8"><Spinner size={32} /></div>
      ) : viewMode === 'table' ? (
      <Card>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 font-semibold">Image</th>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3">
                      <img src={product.pic} alt={product.name} className="h-12 w-12 rounded object-cover" />
                    </td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">{product.description}</td>
                    <td className="p-3">{product.price.toFixed(2)}</td>
                    <td className="p-3">{product.type}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(product)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(product._id)} disabled={deletingId === product._id}>
                          {deletingId === product._id ? <Spinner size={16} /> : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
      ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product._id} className="border rounded p-4 flex flex-col items-center">
            <img src={product.pic} alt={product.name} className="h-40 w-full object-cover mb-2" />
            <span className="font-medium text-lg mb-2">{product.name}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenModal(product)}>
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(product._id)} disabled={deletingId === product._id}>
                {deletingId === product._id ? <Spinner size={16} /> : 'Delete'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      )}
      
      {/* Modal for Add/Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-scroll">
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg dark:bg-gray-900">
            <div className="border-b p-4">
              <h3 className="text-lg font-medium">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Item Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter item name"
                    className="bg-white/50 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-400 dark:placeholder:opacity-100"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter item description"
                    className="bg-white/50 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-400 dark:placeholder:opacity-100"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Price</label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                    className="bg-white/50 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder:text-gray-400 dark:placeholder:opacity-100"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="">Select type</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="deal">Deal</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Menu Collection</label>
                  {/* {loadingMenus ? (
                    <Spinner size={20} />
                  ) : ( */}
                    <select
                      name="megaMenu"
                      value={formData.megaMenu}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="">Select menu collection</option>
                      {menus.map(menu => (
                        <option key={menu._id} value={menu._id}>{menu.name}</option>
                      ))}
                    </select>
                  {/* // )} */}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Picture</label>
                  <input
                    name="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2"
                  />
                </div>
                {picturePreview && (
                  <div className="mt-2">
                    <p className="mb-1 text-sm font-medium">Preview:</p>
                    <img src={picturePreview} alt="Preview" className="h-16 w-16 rounded object-cover" />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Spinner size={16} /> : isEditing ? 'Update' : 'Add'} Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
