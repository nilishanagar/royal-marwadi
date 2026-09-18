import api from './api';

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const logoutUser = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/update-profile', data);
export const updatePassword = (data) => api.put('/auth/update-password', data);
export const updateAddresses = (data) => api.put('/auth/addresses', data);
export const deleteAddress = (addressId) => api.delete(`/auth/addresses/${addressId}`);
