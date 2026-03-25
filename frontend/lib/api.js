const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("hms_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Treatment APIs
export const treatmentAPI = {
  startTreatment: (appointmentId, data) =>
    apiRequest(`/treatments/${appointmentId}/start`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getTreatment: (appointmentId) =>
    apiRequest(`/treatments/${appointmentId}`, { method: 'GET' }),
  updateStatus: (appointmentId, treatmentStatus) =>
    apiRequest(`/treatments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ treatmentStatus }),
    }),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (appointmentId, message) =>
    apiRequest(`/chats/${appointmentId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  getMessages: (appointmentId, limit = 50, page = 1) =>
    apiRequest(`/chats/${appointmentId}/messages?limit=${limit}&page=${page}`, {
      method: 'GET',
    }),
  markAsRead: (appointmentId, messageId) =>
    apiRequest(`/chats/${appointmentId}/messages/${messageId}/read`, {
      method: 'PATCH',
    }),
  getUnreadCount: (appointmentId) =>
    apiRequest(`/chats/${appointmentId}/unread`, { method: 'GET' }),
};

// Prescription APIs
export const prescriptionAPI = {
  create: (data) =>
    apiRequest('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getHistory: (patientId) =>
    apiRequest(`/prescriptions/patient/${patientId}/history`, { method: 'GET' }),
  getSummary: (patientId) =>
    apiRequest(`/prescriptions/patient/${patientId}/summary`, { method: 'GET' }),
  getByDisease: (patientId, disease) =>
    apiRequest(`/prescriptions/patient/${patientId}/disease/${encodeURIComponent(disease)}`, {
      method: 'GET',
    }),
};

