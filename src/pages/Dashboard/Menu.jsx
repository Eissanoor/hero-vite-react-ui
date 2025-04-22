
import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/HeroUI';

const Menu = () => {
  const initialMenuItems = [
    { id: 1, name: 'Breakfast Menu', picture: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Lunch Special', picture: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Dinner Selection', picture: 'https://via.placeholder.com/100' }
  ];

  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', picture: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({ ...item });
      setIsEditing(true);
      setCurrentId(item.id);
    } else {
      setFormData({ name: '', picture: 'https://via.placeholder.com/100' });
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
    
    const newMenuItem = {
      ...formData,
      id: isEditing ? currentId : Date.now(),
    };
    
    if (isEditing) {
      setMenuItems(menuItems.map(item => item.id === currentId ? newMenuItem : item));
    } else {
      setMenuItems([...menuItems, newMenuItem]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button onClick={() => handleOpenModal()}>Add New Menu Item</Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg">
            <img src={item.picture} alt={item.name} className="h-40 w-full object-cover" />
            <Card.Content className="p-4">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(item)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Modal for Add/Edit Menu Item */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="border-b p-4">
              <h3 className="text-lg font-medium">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Menu Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter menu name"
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
                    <img src={formData.picture} alt="Preview" className="h-32 w-full rounded object-cover" />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? 'Update' : 'Add'} Menu Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
