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

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};