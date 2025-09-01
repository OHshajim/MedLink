import axios from 'axios';

const API_BASE_URL = 'https://appointment-manager-node.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authApi = {
  login: (data: { email: string; password: string; role: 'DOCTOR' | 'PATIENT' }) =>
    api.post('/auth/login', data),
  
  registerPatient: (data: { name: string; email: string; password: string; photo_url?: string }) =>
    api.post('/auth/register/patient', data),
  
  registerDoctor: (data: { name: string; email: string; password: string; specialization: string; photo_url?: string }) =>
    api.post('/auth/register/doctor', data),
};

// Specializations endpoints
export const specializationsApi = {
  getAll: () => api.get('/specializations'),
};

// Doctors endpoints
export const doctorsApi = {
  getAll: (params: { page?: number; limit?: number; search?: string; specialization?: string }) =>
    api.get('/doctors', { params }),
};

// Appointments endpoints
export const appointmentsApi = {
    create: (data: { doctorId: string; date: string }) =>
        api.post("/appointments", data),

    getPatientAppointments: (params: { status?: string; page: number }) =>
        api.get("/appointments/patient", { params }),

    getDoctorAppointments: (params: {
        status?: string;
        date?: string;
        page: number;
    }) => api.get("/appointments/doctor", { params }),

    updateStatus: (data: {
        status: "CANCELLED" | "COMPLETED";
        appointment_id: string;
    }) => api.patch("/appointments/update-status", data),
};