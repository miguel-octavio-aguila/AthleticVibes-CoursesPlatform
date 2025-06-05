# Athletic Vibes — Full-Stack Course Platform  
*Laravel 11 REST API + Angular 19 SPA*

![Laravel](https://img.shields.io/badge/Backend-Laravel%2011-red?logo=laravel)
![Angular](https://img.shields.io/badge/Frontend-Angular%2019-DD0031?logo=angular)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Table of Contents
1. [About](#about)  
2. [Key Features](#key-features)  
3. [Tech Stack](#tech-stack)  
4. [Architecture](#architecture)  
5. [Quick Start](#quick-start)  
6. [API Reference & Postman](#api-reference--postman)  
7. [Deployment Guide](#deployment-guide)  
8. [Contributing](#contributing)  

---

## About
**Athletic Vibes** is a production-ready marketplace for online courses.  
Sports lessons are seeded by default, but the codebase is **domain-agnostic**—swap the seed data and you have a platform for any e-learning niche.

* **Backend:** Laravel 11 exposes a clean RESTful API secured with stateless JSON Web Tokens (JWT).  
* **Frontend:** Angular 19 delivers a fast, mobile-first Single-Page App.  
* **Testing:** A complete Postman collection covers the full purchase flow.  
* **Ready for prod:** Docker-friendly, CI/CD sample, Stripe-ready checkout stubs, and searchable catalog.

---

## Key Features

| Area | Feature |
|------|---------|
| **Auth** | JWT-protected login & signup, hashed passwords, role guards |
| **Catalog** | Category filter, search bar, collapsible syllabus, YouTube video embeds |
| **Purchase Flow** | Cart, dynamic totals, coupon / discount placeholder, one-click checkout |
| **Learning** | “My Courses” dashboard, progress doughnut (Chart.js), per-video checkboxes |
| **Community** | Q&A threads with optional image uploads (S3-ready) |
| **Admin** | CRUD for courses, videos, categories & sales, protected routes |
| **Sales** | Order history, revenue endpoints, Stripe webhooks placeholder |
| **Dev UX** | Postman tests, Laravel migrations/seeds, Angular lazy-loaded routes |

---

## Tech Stack

| Layer | Main Tools & Libraries |
|-------|-----------------------|
### Backend (Laravel 11)
- **Framework**: Laravel 11
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MySQL (Eloquent ORM)
- **API Design**: RESTful principles
- **Validation**: Laravel Validator
- **File Storage**: Local storage with upload endpoints
- **Testing**: Postman for API endpoint verification

### Frontend (Angular 19)
- **Framework**: Angular 19 (Component-based architecture)
- **State Management**: BehaviorSubject for progress tracking
- **UI Components**: 
  - Froala WYSIWYG editor
  - NgxDropzone for file uploads
  - Chart.js integration (Doughnut charts)
- **Routing**: Angular Router with route guards
- **Forms**: Reactive forms with validation
- **HTTP Client**: Angular HttpClient with interceptors
- **Build Tool**: Angular CLI with AOT compilation

### Cross-Stack Features
- Environment configuration (production/development)
- Security headers and CORS configuration
- Error handling (iziToast notifications)
- Responsive grid layout system
- YouTube embed API integration

---

## Architecture
┌────────────────────────┐ HTTP / JSON ┌──────────────────────────┐
│ Angular 19 (SPA) │ ⇆ Laravel 11 REST API │ MySQL (migrations + │
│ • Component Store │ │ seeds) │
└────────────────────────┘ └──────────────────────────┘

* **Stateless JWT** keeps sessions lightweight.  
* **Service Layer** in Laravel centralizes purchases, Q&A, and progress logic.  
* **Lazy-loaded Angular routes** ensure sub-second first paint.

---

## Quick Start

<details>
<summary>Prerequisites</summary>

| Tool | Version |
|------|---------|
| PHP  | ≥ 8.3   |
| Composer | latest |
| Node | ≥ 20 LTS |
| npm / pnpm | latest |
| MySQL / MariaDB | ≥ 10.6 |
</details>

## 🧪 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - Token invalidation

### User Management
- `GET /api/user/detail/{id}` - User profile retrieval
- `POST /api/upload` - Avatar upload
- `GET /api/user/avatar/{filename}` - Avatar retrieval

### Course System
- `GET /api/courses` - Course listing
- `GET /courses/getByCategory/{id}` - Category filtering
- `GET /courses/getByText/{text}` - Search functionality
- `POST /api/courses` - Course creation

### Sales & Cart
- `GET /api/sales` - Sales history
- `GET /sales/getByCategory/{id}` - Category filtering
- `GET /sales/getByText/{text}` - Search functionality
- `POST /api/sales` - Purchase processing

### Interactive Features
- `POST /api/comments` - Question submission
- `GET /api/comments/image/{filename}` - Image retrieval
- `POST /api/responses` - Answer submission
- `POST /api/checkboxes` - Progress tracking

---

## 📈 Scalability & Deployment

The application is designed with cloud deployment in mind:
- API-first architecture for easy mobile/web integration
- State management ready for Redis caching
- File storage system compatible with S3/Cloudinary
- Environment-based configuration for different stages
- Docker-ready structure for containerization

---

## 🤝 Contribution Guidelines

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a new Pull Request

---
