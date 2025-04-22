
import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../components/HeroUI';
import { addMegaMenu, getMegaMenus } from '../../api/megamenu';
import { useAuth } from '../../context/AuthContext';

const Menu = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  const [menuItems, setMenuItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', pic: null });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError('');
        const resp = await getMegaMenus(token);
        setMenuItems(resp.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch menu items');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
    // eslint-disable-next-line
  }, []);
  
  const handleOpenModal = (item = null) => {
    setError('');
    setSuccess('');
    if (item) {
      setFormData({ name: item.name, pic: null });
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
    const { name, value, files } = e.target;
    if (name === 'pic') {
      setFormData({ ...formData, pic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pic) {
      setError('Both name and picture are required.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addMegaMenu({ name: formData.name, pic: formData.pic, token });
      setSuccess('Menu item added successfully!');
      setModalOpen(false);
      setFormData({ name: '', pic: null });
      // Refresh menu list
      const resp = await getMegaMenus(token);
      setMenuItems(resp.data || []);
    } catch (err) {
      setError(err.message || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
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
          <Card key={item._id || item.id} className="overflow-hidden hover:shadow-lg">
            <img src={item.pic} alt={item.name} className="h-40 w-full object-cover" />
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
                  <label className="mb-1 block text-sm font-medium">Picture</label>
                  <input
                    type="file"
                    name="pic"
                    accept="image/*"
                    onChange={handleInputChange}
                    required
                    className="block w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                {formData.pic && (
                  <div className="mt-2">
                    <p className="mb-1 text-sm font-medium">Preview:</p>
                    <img src={URL.createObjectURL(formData.pic)} alt="Preview" className="h-32 w-full rounded object-cover" />
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
