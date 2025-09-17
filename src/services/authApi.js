import { BASE_URL } from './baseUrls';

const handleResponse = async (response) => {
  const text = await response.text();
  
  if (text.startsWith('<!DOCTYPE html>')) {
    throw new Error('Server returned HTML instead of JSON');
  }

  try {
    const data = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (email, password, username) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });
  return handleResponse(response);
};

export const getAdminProfile = async (token) => {
  const response = await fetch(`${BASE_URL}/admin/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getAllAdmins = async (token) => {
  const response = await fetch(`${BASE_URL}/admin/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const logout = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    await handleResponse(response);
    localStorage.removeItem('adminToken');
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error.message);
    localStorage.removeItem('adminToken');
    return { success: true, message: 'Logged out successfully' };
  }
};