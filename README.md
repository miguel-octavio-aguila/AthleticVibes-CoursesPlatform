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
| **Backend** | PHP 8.3 • **Laravel 11** • MySQL/MariaDB • Firebase `php-jwt` • Laravel Sanctum (optional) • Pest PHP |
| **Frontend** | **Angular 19** • RxJS • Angular Router • ng2-charts + Chart.js • Bootstrap 5 • Themify Icons • iziToast • AOS • Froala Editor |
| **Dev / Ops** | Docker / Docker Compose • GitHub Actions • Postman • ESLint + Prettier • Vite (Angular 19 default) |

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
