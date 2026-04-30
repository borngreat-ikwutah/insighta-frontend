# Insighta Labs+ (HNG Task 3)

Welcome to the **Insighta Labs+ Web Portal**, a secure, data-driven profile intelligence system built for the HNG Backend Engineering Track (Stage 3).

## Project Overview

This portal serves as the primary web interface for the Insighta Labs ecosystem, providing analysts and administrators with a high-fidelity platform to manage, search, and export profile data. It is integrated with a secure Hono-based backend featuring GitHub OAuth with PKCE.

## Core Features

- **Secure Authentication**: Integration with GitHub OAuth using secure, HTTP-only cookie-based session management.
- **Role-Based Access Control (RBAC)**:
  - **Analysts**: Read-only access to browse, search, and export data.
  - **Admins**: Full administrative privileges, including profile creation and deletion.
- **Operational Dashboard**: Real-time metrics showing total indexed profiles and system health.
- **Advanced Profile Management**: 
  - Dynamic table with server-side sorting, filtering, and pagination.
  - Visualized AI confidence scores (gender/country probabilities).
- **Natural Language Search**: A dedicated search interface for complex queries (e.g., "young males from nigeria").
- **System Export**: Server-side CSV generation with customizable filters.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router)
- **UI/UX**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
- **API Client**: [Axios](https://axios-http.com/) with automated token refresh and rate-limit handling.

## Getting Started

### Prerequisites
- Node.js / Bun
- Backend API URL (configured in environment variables)

### Installation
```bash
bun install
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://your-api-url.com
```

### Development
```bash
bun --bun run dev
```

### Production Build
```bash
bun --bun run build
```

## System Architecture

The web portal acts as a consumer of the Insighta Labs+ API, maintaining a single source of truth alongside the CLI tool. 
- **API Versioning**: All requests are tagged with `X-API-Version: 1`.
- **Security**: Implements CSRF protection and enforces session integrity via global interceptors.
- **Rate Limiting**: Gracefully handles the 60 requests/minute user quota with specific feedback.

---
*Developed as part of the HNG Backend Engineering Track - Stage 3.*
