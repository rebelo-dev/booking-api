# Booking API (NestJS + Prisma)

A scheduling API built with NestJS, PostgreSQL, and Prisma.  
This project focuses on core backend concepts such as authentication, availability management, and preventing double bookings.

---

## Features

- User registration and login (JWT authentication)
- Provider system (users can become providers)
- Availability management (time ranges)
- Slot generation (time ranges are splitted into 30-minute intervals)
- Appointment booking with schedule overlap prevention
- RBAC ready (Not enforced)
- End-to-end testing (Jest + Supertest)

---

## Architecture

The project follows a modular NestJS structure:

src/
  auth/
  users/
  providers/
  availability/
  appointments/
  slots/
  prisma/

Each module contains:
- Controller: HTTP requests handling
- Service: Business logic
- Module: Dependencies setup

---

## Authentication

- Users register with email and password
- Passwords are hashed using bcrypt
- Login returns a JWT token
- Protected routes use JwtAuthGuard so only authenticaded users can access them.

---

## Database Design

### Models

User
- id
- email
- password
- role (USER | PROVIDER | ADMIN)

Provider
- id
- userId (unique)
- businessName

Availability
- id
- providerId
- startTime
- endTime

Appointment
- id
- userId
- providerId
- startTime
- endTime
- status (PENDING | CONFIRMED | CANCELLED)

---

## Relationships

- User 1:1 Provider
- User 1:N Appointment
- Provider 1:N Availability
- Provider 1:N Appointment

---

## Core Logic

### Slot Generation

Slots are not stored in the database. Instead they are generated from fetched availability time intervals, which are then splitted into 30 minutes slots. These are filtered as well removing taken slots.

---

### Double Booking Prevention

Before creating an appointment, the system checks for overlap:

startTime < existing.endTime  
AND  
endTime > existing.startTime  

If an overlap exists, the booking is rejected.

---

## Roles and Permissions

Roles exist in the database:
- USER
- PROVIDER
- ADMIN

Current state:
- Authentication is enforced (JWT)
- Role-based access control is not enforced for this version.

The system is ready to support RBAC using guards, but it was intentionally left out to keep the MVP simple.

---

## API Endpoints

Auth
POST /auth/register  
POST /auth/login  
GET /auth/me (protected)

Providers
POST /providers (protected)

Availability
POST /availability (protected)  
GET /availability?providerId=xxx  
GET /availability/available?providerId=xxx  

Slots
GET /slots?start=&end=&interval=

Appointments
POST /appointments (protected)

---

## Testing

End-to-end tests using Jest and Supertest.

Covered scenarios:
- Appointment creation
- Invalid time validation
- Double booking prevention
- Slot generation

---

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL
- JWT (Passport)
- bcrypt
- Jest (E2E)

---

## Key Decisions

Prisma + PostgreSQL  
Chosen for type safety and real-world usage.

Simple Role System  
Roles exist but are not enforced yet to avoid overengineering.

Modular Architecture  
Each module is isolated for better scalability and maintainability following the separation of concerns pattern.

---

## What This Project Demonstrates

- Backend architecture with NestJS
- Authentication with JWT
- Database modeling and relations
- Business logic for scheduling systems
- End-to-end testing

---

## Improvements for the future

- Role-based access control (RBAC)
- Booking cancellation and updates

---

## Author

João Rebelo