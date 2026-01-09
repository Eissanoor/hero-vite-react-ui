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
  const [searchName, setSearchName] = useState('');
  const [filterMegaMenu, setFilterMegaMenu] = useState('');

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

  // Fetch menus on mount for filter dropdown
  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoadingMenus(true);
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

  // Filter products based on search name and megaMenu
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesName = searchName === '' || 
        product.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesMegaMenu = filterMegaMenu === '' || 
        product.megaMenu?._id === filterMegaMenu;
      return matchesName && matchesMegaMenu;
    });
  }, [products, searchName, filterMegaMenu]);

  // Group products by name and organize by size
  const groupedProducts = useMemo(() => {
    const grouped = {};
    filteredProducts.forEach(product => {
      const name = product.name;
      if (!grouped[name]) {
        grouped[name] = {
          name,
          description: product.description,
          pic: product.pic,
          megaMenu: product.megaMenu,
          products: [],
          _id: product._id // Keep first product ID for reference
        };
      }
      grouped[name].products.push(product);
    });
    
    // Convert to array and sort
    return Object.values(grouped).map(group => ({
      ...group,
      small: group.products.find(p => p.type === 'small'),
      medium: group.products.find(p => p.type === 'medium'),
      large: group.products.find(p => p.type === 'large'),
      family: group.products.find(p => p.type === 'family'),
      deal: group.products.find(p => p.type === 'deal')
    }));
  }, [filteredProducts]);

  // Calculate total value of all products
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Items</h1>
          <div className="flex items-center space-x-3">
            <span className="text-md font-semibold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {viewMode === 'table' ? groupedProducts.length : filteredProducts.length} items
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

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by product name..."
            className="w-full"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={filterMegaMenu}
            onChange={(e) => setFilterMegaMenu(e.target.value)}
            className="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">All Menu Collections</option>
            {menus.map(menu => (
              <option key={menu._id} value={menu._id}>{menu.name}</option>
            ))}
          </select>
        </div>
        {(searchName || filterMegaMenu) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchName('');
              setFilterMegaMenu('');
            }}
            className="flex items-center space-x-1"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear Filters</span>
          </Button>
        )}
      </div>
      
      {loadingProducts ? (
        <div className="flex justify-center py-8"><Spinner size={32} /></div>
      ) : viewMode === 'table' ? (
      <Card>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-300">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-4 font-semibold text-left border-2 border-gray-300">Product Name</th>
                  <th className="p-4 font-semibold text-center border-2 border-gray-300">Small</th>
                  <th className="p-4 font-semibold text-center border-2 border-gray-300">Medium</th>
                  <th className="p-4 font-semibold text-center border-2 border-gray-300">Large</th>
                  <th className="p-4 font-semibold text-center border-2 border-gray-300">Family</th>
                  <th className="p-4 font-semibold text-center border-2 border-gray-300">Deal</th>
                  <th className="p-4 font-semibold text-center border-2 border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedProducts.map((group, index) => (
                  <tr key={group.name + index} className="border-b-2 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4 font-bold border-2 border-gray-300">
                      <div className="flex items-center space-x-3">
                        {group.pic && (
                          <img src={group.pic} alt={group.name} className="h-12 w-12 rounded object-cover" />
                        )}
                        <div>
                          <div className="font-semibold">{group.name}</div>
                          {group.description && (
                            <div className="text-sm text-gray-500 font-normal">{group.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-semibold border-2 border-gray-300">
                      {group.small ? `Rs ${group.small.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4 text-center font-semibold border-2 border-gray-300">
                      {group.medium ? `Rs ${group.medium.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4 text-center font-semibold border-2 border-gray-300">
                      {group.large ? `Rs ${group.large.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4 text-center font-semibold border-2 border-gray-300">
                      {group.family ? `Rs ${group.family.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4 text-center font-semibold border-2 border-gray-300">
                      {group.deal ? `Rs ${group.deal.price.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4 border-2 border-gray-300">
                      <div className="flex flex-col space-y-2">
                        {group.products.map((product) => (
                          <div key={product._id} className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenModal(product)}
                              className="text-xs"
                            >
                              Edit {product.type}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 hover:bg-red-50 hover:text-red-700 text-xs" 
                              onClick={() => handleDelete(product._id)} 
                              disabled={deletingId === product._id}
                            >
                              {deletingId === product._id ? <Spinner size={12} /> : 'Del'}
                            </Button>
                          </div>
                        ))}
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
        {filteredProducts.map(product => (
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
                    <option value="family">Family</option>
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
