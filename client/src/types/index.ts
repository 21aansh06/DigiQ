// User Types
export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: 'serviceUser' | 'organization';
  createdAt: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserRegisterInput {
  name: string;
  email: string;
  password: string;
  phone: string;
}

// Organization Types
export type OrgType = 'hospital' | 'bank' | 'office' | 'clinic';

export interface Organization {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: OrgType;
  services: string[];
  qrCode?: string;
  createdBy: string;
  createdAt: string;
}

export interface OrgLoginInput {
  email: string;
  password: string;
}

export interface OrgRegisterInput {
  name: string;
  email: string;
  password: string;
  address: string;
  type: OrgType;
}

// Service Types
export interface Service {
  _id: string;
  organization: Organization | string;
  name: string;
  description?: string;
  averageTimePerCustomer: number;
  isActive: boolean;
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  averageTimePerCustomer?: number;
}

// Queue Types
export type QueueStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled';

export interface Queue {
  _id: string;
  service: Service | string;
  organization: Organization | string;
  user: User | string;
  tokenNumber: number;
  status: QueueStatus;
  joinedAt: string;
  completedAt?: string;
  estimatedWaitTime?: number;
  isRemote: boolean;
}

export interface QueueWithDetails extends Queue {
  service: Service;
  organization: Organization;
  user: User;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  organization?: Organization;
}

export interface ServicesResponse {
  success: boolean;
  count?: number;
  services: Service[];
}

export interface QueuesResponse {
  success: boolean;
  queues: Queue[];
  service?: {
    averageTimePerCustomer: number;
  };
}

// OTP Types
export interface OTPRequestInput {
  phone: string;
}

export interface OTPVerifyInput {
  phone: string;
  otp: string;
}

// Socket Events
export interface QueueUpdateEvent {
  action: 'join';
  queue: Queue;
}

export interface QueueStatusEvent {
  action: 'status_update';
  queueId: string;
  status: QueueStatus;
}
