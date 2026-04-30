import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  User,
  UserLoginInput,
  UserRegisterInput,
  Organization,
  OrgLoginInput,
  OrgRegisterInput,
  Service,
  CreateServiceInput,
  Queue,
  OTPRequestInput,
  OTPVerifyInput,
  AuthResponse,
  ServicesResponse,
  QueuesResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  // User Auth
  registerUser: async (data: UserRegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/user/register', data);
    return response.data;
  },

  loginUser: async (data: UserLoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/user/login', data);
    return response.data;
  },

  logoutUser: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/user/logout');
    return response.data;
  },

  getUserProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await apiClient.get('/auth/user/me');
    return response.data;
  },

  // Organization Auth
  registerOrg: async (data: OrgRegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/org/register', data);
    return response.data;
  },

  loginOrg: async (data: OrgLoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/org/login', data);
    return response.data;
  },

  logoutOrg: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/org/logout');
    return response.data;
  },

  getOrgProfile: async (): Promise<{ success: boolean; organization: Organization }> => {
    const response = await apiClient.get('/auth/org/me');
    return response.data;
  },

  generateQRCode: async (orgId: string): Promise<{ success: boolean; qrCode: string }> => {
    const response = await apiClient.get(`/auth/org/qrcode/${orgId}`);
    return response.data;
  },
};

// Service Services
export const serviceService = {
  getAllServices: async (): Promise<ServicesResponse> => {
    const response = await apiClient.get('/service');
    return response.data;
  },

  getOrgServices: async (orgId: string): Promise<ServicesResponse> => {
    const response = await apiClient.get(`/service/org/${orgId}`);
    return response.data;
  },

  addService: async (data: CreateServiceInput): Promise<{ success: boolean; service: Service }> => {
    const response = await apiClient.post('/service', data);
    return response.data;
  },

  updateService: async (
    serviceId: string,
    data: Partial<CreateServiceInput>
  ): Promise<{ success: boolean; service: Service }> => {
    const response = await apiClient.put(`/service/${serviceId}`, data);
    return response.data;
  },

  deleteService: async (serviceId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/service/${serviceId}`);
    return response.data;
  },
};

// Queue Services
export const queueService = {
  joinQueue: async (serviceId: string): Promise<{ success: boolean; queue: Queue; message: string }> => {
    const response = await apiClient.post(`/queues/${serviceId}/join`);
    return response.data;
  },

  getServiceQueues: async (serviceId: string): Promise<QueuesResponse> => {
    const response = await apiClient.get(`/queues/service/${serviceId}`);
    return response.data;
  },

  getOrgQueues: async (orgId: string): Promise<QueuesResponse> => {
    const response = await apiClient.get(`/queues/org/${orgId}`);
    return response.data;
  },

  getUserQueues: async (params?: { status?: string; page?: number; limit?: number }): Promise<QueuesResponse & { pagination?: any }> => {
    const response = await apiClient.get('/queues/user', { params });
    return response.data;
  },

  updateQueueStatus: async (
    queueId: string,
    status: string
  ): Promise<{ success: boolean; queue: Queue; message: string }> => {
    const response = await apiClient.put(`/queues/${queueId}`, { status });
    return response.data;
  },

  deleteQueue: async (queueId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/queues/${queueId}`);
    return response.data;
  },
};

// OTP Services
export const otpService = {
  requestOTP: async (data: OTPRequestInput): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/otp/request', data);
    return response.data;
  },

  verifyOTP: async (
    data: OTPVerifyInput
  ): Promise<{ success: boolean; token: string; user: User; message: string }> => {
    const response = await apiClient.post('/otp/verify', data);
    return response.data;
  },
};

export default apiClient;
