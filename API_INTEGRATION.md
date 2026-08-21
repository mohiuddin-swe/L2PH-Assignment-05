# FixItNow - API Integration Documentation

This document maps all frontend components and routes to their corresponding backend REST API endpoints.

## Public & Authentication Routes
| Frontend Route | Backend Endpoint | Method | Description |
|---|---|---|---|
| `/` (Home View) | `/api/services` | GET | Fetches featured services & top-rated technicians |
| `/services` | `/api/services` | GET | Browse all services with search & filter queries |
| `/technicians/:id` | `/api/technicians/:id` | GET | Retrieves technician profile details and availability |
| `/auth/register` | `/api/auth/register` | POST | Registers a new Customer or Technician |
| `/auth/login` | `/api/auth/login` | POST | Authenticates user and returns JWT |

## Customer Operations
| Frontend Component/Route | Backend Endpoint | Method | Description |
|---|---|---|---|
| `/dashboard/customer` | `/api/bookings` | GET | Fetches booking history for current customer |
| `/dashboard/customer` | `/api/bookings/:id` | PATCH | Updates booking status (e.g., CANCELLED) |
| `/dashboard/customer/.../pay` | `/api/payments/create` | POST | Initiates Stripe/SSLCommerz payment session |

## Technician Operations
| Frontend Component/Route | Backend Endpoint | Method | Description |
|---|---|---|---|
| `/dashboard/technician` | `/api/technician/profile` | GET | Fetches technician profile and stats |
| `/dashboard/technician` | `/api/technician/bookings` | GET | Fetches incoming jobs |
| `/dashboard/technician` | `/api/technician/bookings/:id` | PATCH | Updates job status (Accept/Decline/Complete) |
| `/dashboard/technician` | `/api/technician/availability` | POST | Updates calendar off-days |

## Admin Operations
| Frontend Component/Route | Backend Endpoint | Method | Description |
|---|---|---|---|
| `/dashboard/admin` | `/api/admin/stats` | GET | Retrieves global revenue and user stats |
| `/dashboard/admin` | `/api/admin/users` | GET | Fetches all users for moderation |
| `/dashboard/admin` | `/api/admin/users/:id/ban`| PATCH | Toggles user ban status |
| `/dashboard/admin` | `/api/admin/categories` | GET/POST | Manages service categories |
| `/dashboard/admin` | `/api/admin/categories/:id`| DELETE | Deletes a specific category |