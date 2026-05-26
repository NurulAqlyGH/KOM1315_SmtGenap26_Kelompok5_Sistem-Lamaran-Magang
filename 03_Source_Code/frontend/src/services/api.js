const API_BASE_URL = '/api/v1';
const TOKEN_KEY = 'career_tracker_token';
const ROLE_KEY = 'career_tracker_role';

const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.detail || data?.message || response.statusText;
    throw new Error(message || 'Terjadi kesalahan jaringan');
  }

  return data;
};

export const loginUser = async (identifier, password) => {
  const body = new URLSearchParams();
  body.append('username', identifier);
  body.append('password', password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.detail || data?.message || response.statusText;
    throw new Error(message || 'Login gagal');
  }

  return data;
};

export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);
export const setAuthRole = (role) => localStorage.setItem(ROLE_KEY, role);
export const getAuthRole = () => localStorage.getItem(ROLE_KEY);
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const getActiveLowongan = async () => request('/lowongan/aktif');
export const getAllLowongan = async () => request('/lowongan');

export const submitPendaftaran = async (lowonganId, fileCv, fileRekomendasi) => {
  const formData = new FormData();
  formData.append('lowongan_id', lowonganId);
  formData.append('file_cv', fileCv);
  formData.append('file_rekomendasi', fileRekomendasi);

  return request('/pendaftaran/', {
    method: 'POST',
    body: formData,
  });
};

export const submitSignedRecommendation = async (suratId, fileSigned) => {
  const formData = new FormData();
  formData.append('status', 'APPROVED');
  formData.append('file_signed', fileSigned);

  return request(`/surat-rekomendasi/${suratId}/proses`, {
    method: 'PATCH',
    body: formData,
  });
};
