import api from './api';

const AUTH_URL = `/auth`;

export async function login(email, password) {
  const { data } = await api.post(`${AUTH_URL}/login`, { email, password });
  return data; 
}

export async function register(name, email, password) {
  const { data } = await api.post(`${AUTH_URL}/register`, { name, email, password });
  return data;
}

export async function fetchAds(params = {}) {
  const { data } = await api.get(`/ads`, { params });
  return Array.isArray(data) ? data : (data.items ?? []);
}

export async function fetchCategories() {
  const { data } = await api.get(`/ads/categories`);
  return data.categories || [];
}

export async function createAd({ title, description, location, category, price, imageFile }) {
  const formData = new FormData();
  formData.append('title', title || '');
  formData.append('description', description || '');
  if (category) formData.append('category', category);
  if (location) formData.append('location', location);
  if (price) formData.append('price', price);
  if (imageFile) formData.append('image', imageFile);

  const { data } = await api.post('/ads', formData);
  return data;
}

export async function  getAd(id) {
  const { data } = await api.get(`/ads/${id}`);
  return data;  
}

export async function deleteAd(id) {
  const { data } = await api.delete(`/ads/${id}`);
  return data;
}

export async function updateAd(id, payload) {
  const { data } = await api.put(`/ads/${id}`, payload);
  return data;
}

