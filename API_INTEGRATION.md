# FixItNow - API Integration Documentation

This document maps all frontend components and routes to their corresponding backend REST endpoints.

| Route / Component | Backend Endpoint | HTTP Method | Description |
|---|---|---|---|
| `/` (Home View) | `/api/services` | GET | Fetches featured services & top-rated technicians |
| `/services` | `/api/services` | GET | Browse all services with search & filter queries |
| `/technicians/:id` | `/api/technicians/:id` | GET | Retrieves technician profile details and availability |
| `/auth/register` | `/api/auth/register` | POST | Registers a new Customer or Technician |
| `/auth/login` | `/api/auth/login` | POST | Authenticates user and returns JWT |
| `/dashboard/customer` | `/api/bookings` | GET | Fetches booking history for current customer |
| `/dashboard/customer/bookings/:id/pay` | `/api/payments/create` | POST | Initiates Stripe/SSLCommerz payment session |
| `/dashboard/technician` | `/api/technician/profile` | GET | Fetches technician profile and stats |
| `/dashboard/technician/bookings` | `/api/technician/bookings` | GET | Fetches incoming jobs |
| `/dashboard/technician/bookings/:id` | `/api/technician/bookings/:id` | PATCH | Updates job status (Accept/Decline/Complete) |
| `/dashboard/admin` | `/api/admin/users` | GET | Fetches all users for admin management |
| `/dashboard/admin/categories` | `/api/admin/categories` | GET, POST | Manages service categories |