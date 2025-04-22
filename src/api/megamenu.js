import API_CONFIG from '../config/api';

// Add new Mega Menu item (POST, multipart/form-data, secure)
export async function addMegaMenu({ name, pic, token }) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('pic', pic);

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEGAMENU}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Do NOT set Content-Type here; browser will set multipart boundaries
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to add Mega Menu item');
  }
  return data;
}

// Get Mega Menu items (GET, secure)
export async function getMegaMenus(token) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MEGAMENU}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch Mega Menu items');
  }
  return data;
}
