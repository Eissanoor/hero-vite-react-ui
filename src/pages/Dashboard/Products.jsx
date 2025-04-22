
import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/HeroUI';

const Products = () => {
  const initialProducts = [
    { id: 1, name: 'Espresso', description: 'Strong black coffee', price: 3.99, type: 'Coffee', picture: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Cappuccino', description: 'Coffee with steamed milk', price: 4.99, type: 'Coffee', picture: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Croissant', description: 'Buttery and flaky', price: 2.99, type: 'Bakery', picture: 'https://via.placeholder.com/100' }
  ];

  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', type: '', picture: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData({ ...product, price: product.price.toString() });
      setIsEditing(true);
      setCurrentId(product.id);
    } else {
      setFormData({ name: '', description: '', price: '', type: '', picture: 'https://via.placeholder.com/100' });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      id: isEditing ? currentId : Date.now(),
    };
    
    if (isEditing) {
      setProducts(products.map(p => p.id === currentId ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => handleOpenModal()}>Add New Product</Button>
      </div>
      
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
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img src={product.picture} alt={product.name} className="h-12 w-12 rounded object-cover" />
                    </td>
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">{product.description}</td>
                    <td className="p-3">${product.price.toFixed(2)}</td>
                    <td className="p-3">{product.type}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(product)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(product.id)}>
                          Delete
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

      {/* Modal for Add/Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="border-b p-4">
              <h3 className="text-lg font-medium">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Product Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product description"
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
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Type</label>
                  <Input
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product type"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium">Picture URL</label>
                  <Input
                    name="picture"
                    value={formData.picture}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter image URL"
                  />
                </div>
                
                {formData.picture && (
                  <div className="mt-2">
                    <p className="mb-1 text-sm font-medium">Preview:</p>
                    <img src={formData.picture} alt="Preview" className="h-16 w-16 rounded object-cover" />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Add'} Product
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
