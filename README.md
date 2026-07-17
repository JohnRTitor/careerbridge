# CareerBridge - Job Portal Platform

CareerBridge is a unified platform designed for job discovery, recruitment management, employer branding, and career development. It connects job seekers with recruiters while providing robust tools for building professional profiles, discovering jobs, and tracking applications.

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

### Database Scripts

- **`pnpm db:reset`**: Drops the entire public schema and rebuilds it using `schema.sql`. (Warning: Destructive)
- **`pnpm db:seed`**: Bulk inserts a large set of realistic mock data (thousands of candidates, employers, jobs, and applications) for system-wide testing.
- **`pnpm db:setup`**: Runs `db:reset` followed immediately by `db:seed`.
- **`pnpm seed:candidate --user=<id>`**: Populates realistic scenario data for a specific candidate ID. Generates missing profile information, creates applications to open jobs, and populates the activity timeline. Useful for testing the candidate dashboard. Options: `--applications=<num>`, `--seed=<num>`, `--dry-run`.
- **`pnpm seed:recruiter --user=<id>`**: Populates realistic scenario data for a specific employer/recruiter ID. Generates jobs, applicants, and recruiter activity for their ATS view. Useful for testing the recruiter dashboard. Options: `--jobs=<num>`, `--applications=<num>`, `--seed=<num>`, `--dry-run`.

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

### Administration & Governance

- [ ] Build System Admin dashboard for user management.
- [ ] Implement platform monitoring and audit logging.
- [ ] Add content moderation and company verification workflows.

### Future Enhancements

- [ ] AI-driven job recommendations.
- [ ] AI-powered resume analysis.
- [ ] Automated certifications upload and verification.

## API Routes Task List

### User Profile Management

- [ ] `GET /api/users/profile` - Get current user profile
- [ ] `PUT /api/users/profile` - Update user profile (personal info, visibility)
- [ ] `POST /api/users/profile/education` - Add education entry
- [ ] `PUT /api/users/profile/education/:id` - Update education entry
- [ ] `DELETE /api/users/profile/education/:id` - Delete education entry
- [ ] `POST /api/users/profile/experience` - Add work experience
- [ ] `PUT /api/users/profile/experience/:id` - Update work experience
- [ ] `DELETE /api/users/profile/experience/:id` - Delete work experience
- [ ] `POST /api/users/profile/resume` - Upload resume/portfolio

### Job Search & Application System

- [ ] `GET /api/jobs` - Search jobs (with filters, sorting, pagination)
- [ ] `GET /api/jobs/:id` - Get specific job details
- [ ] `GET /api/jobs/recommendations` - Get personalized job recommendations
- [ ] `POST /api/jobs/:id/apply` - Submit job application
- [ ] `POST /api/jobs/:id/save` - Save/bookmark a job
- [ ] `DELETE /api/jobs/:id/save` - Remove saved job
- [ ] `GET /api/applications` - Get user's job applications and statuses

### Recruiter Dashboard & ATS

- [ ] `POST /api/recruiters/jobs` - Create a new job posting
- [ ] `PUT /api/recruiters/jobs/:id` - Update an existing job posting
- [ ] `DELETE /api/recruiters/jobs/:id` - Delete a job posting
- [ ] `GET /api/recruiters/jobs/:id/applicants` - Get applicants for a job
- [ ] `PUT /api/recruiters/applications/:id/status` - Update applicant status (shortlist, reject, hire)
- [ ] `GET /api/recruiters/analytics` - Get recruitment analytics dashboard data

### Administration & Governance

- [ ] `GET /api/admin/users` - List all users (with filtering)
- [ ] `PUT /api/admin/users/:id/role` - Change user role
- [ ] `PUT /api/admin/users/:id/status` - Suspend/ban/activate user
- [ ] `GET /api/admin/audit-logs` - Retrieve audit logs
- [ ] `PUT /api/admin/companies/:id/verify` - Verify a company profile

---

_This project was initialized with `create-next-app` and uses React Compiler for optimized rendering._
