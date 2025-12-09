import api from './api';

const API = 'http://localhost:5000/api';
const AUTH_URL = `${API}/auth`;

export async function login(email, password) {
  const { data } = await api.post(`${AUTH_URL}/login`, { email, password });
  return data; 
}

export async function register(name, email, password) {
  const { data } = await api.post(`${AUTH_URL}/register`, { name, email, password });
  return data;
}

export async function fetchAds(params = {}) {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const url = new URL(`${API_BASE}/api/ads`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim().length > 0) {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString(), { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Neuspješno učitavanje oglasa');

  const data = await res.json();
  return Array.isArray(data) ? data : (data.items ?? []);
}

export async function fetchCategories() {
  const res = await fetch("http://localhost:5000/api/ads/categories");
  const data = await res.json();
  return data.categories || [];
}

export async function createAd({ title, description, location, category, price, imageFile }) {
  console.log('=== FRONTEND DEBUG ===');
  console.log('API URL:', API);
  console.log('FULL URL:', `${API}/ads`);
  console.log('FromData contents:');

  const formData = new FormData();
  formData.append('title', title || '');
  formData.append('description', description || '');
  if (category) formData.append('category', category);
  if (location) formData.append('location', location);
  if (price) formData.append('price', price);
  if (imageFile) formData.append('image', imageFile);

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    console.log('Sending POST request...');
    const { data } = await api.post('/ads', formData);
    console.log('Response recived:', data);
    return data;
  } catch (error) {
    console.error('Request failed:', error.response?.data || error.message);
    throw error;
  }
  
}

export async function fetchAdById(id) {
  const { data } = await api.get(`${API}/ads/${id}`);
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

