# CareerBridge - Job Portal and Professional Networking Platform

CareerBridge is a unified platform designed for professional networking, job discovery, recruitment management, employer branding, and career development. It connects job seekers with recruiters while providing robust tools for building professional profiles, discovering jobs, tracking applications, and fostering professional relationships.

## Tech Stack

This project is built using modern web technologies:

- **Framework**: [Next.js](https://nextjs.org/) (SSR/SPA)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), [Base UI](https://base-ui.com/)
- **API & Routing**: [Hono](https://hono.dev/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Database**: PostgreSQL (via `pg`)
- **State Management**: [React Query](https://tanstack.com/query/latest)
- **Icons**: [Hugeicons](https://hugeicons.com/)

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- `pnpm` (Package manager)
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd careerbridge
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Copy the example environment file and fill in your details (e.g., Database URL, Auth secrets).

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Checklist

### Core Infrastructure

- [ ] Set up Next.js architecture and database connections.
- [ ] Implement robust authentication and authorization using Better Auth (RBAC for Job Seekers, Recruiters, Admins).
- [ ] Set up Hono API routes.

### User Profile Management

- [ ] Create user registration and onboarding flow.
- [ ] Build professional profile management (personal info, education, work experience, skills).
- [ ] Implement resume and portfolio upload functionality.
- [ ] Add profile visibility controls.

### Job Search & Application System

- [ ] Develop job search engine with keyword filtering and sorting.
- [ ] Implement personalized job recommendations (based on user profile).
- [ ] Build job application submission flow.
- [ ] Allow users to save jobs and track application status.

### Recruiter Dashboard & ATS

- [ ] Build tools for creating and managing job postings.
- [ ] Develop Applicant Tracking System (ATS) interface.
- [ ] Implement candidate review, filtering, and shortlisting.
- [ ] Add recruitment analytics.

### Professional Networking (Optional/Phase 2)

- [ ] Implement connection requests and relationship management.
- [ ] Build user follow/unfollow functionality for companies.
- [ ] Add professional recommendations and skill endorsements.

### Messaging System (Optional/Phase 2)

- [ ] Develop real-time direct messaging between candidates and recruiters.
- [ ] Implement file attachment support in messages.

### Administration & Governance

- [ ] Build System Admin dashboard for user management.
- [ ] Implement platform monitoring and audit logging.
- [ ] Add content moderation and company verification workflows.

### Future Enhancements

- [ ] AI-driven job recommendations.
- [ ] AI-powered resume analysis.
- [ ] Automated certifications upload and verification.

---

_This project was initialized with `create-next-app` and uses React Compiler for optimized rendering._
