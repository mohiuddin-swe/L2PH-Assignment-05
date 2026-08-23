export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "BANNED";
  avatarUrl?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  createdAt?: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  skills: string[];
  experience: number;
  bio?: string;
  pricing: number;
  location?: string;
  user: {
    id: string;
    name: string;
    email?: string;
  };
  services?: Service[];
  reviews?: Review[];
  avgRating?: number;
}

export interface Service {
  id: string;
  technicianProfileId: string;
  categoryId: string;
  title: string;
  description?: string;
  price: number;
  category: ServiceCategory;
  technicianProfile?: TechnicianProfile;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianProfileId: string;
  serviceId: string;
  status: BookingStatus;
  scheduledAt: string;
  service?: Service;
  technicianProfile?: TechnicianProfile;
  customer?: { id: string; name: string; email: string };
  payment?: Payment;
  review?: Review | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  transactionId?: string;
  paidAt?: string | null;
  createdAt?: string;
  booking?: Booking;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  rating: number;
  comment?: string;
  customer?: { id: string; name: string };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorDetails?: Record<string, string[]> | null;
}