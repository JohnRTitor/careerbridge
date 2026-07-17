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
   Copy the example environment file and fill in your details (e.g., Database URL, Auth secrets). Ensure you have a running PostgreSQL database and update the `DATABASE_URL` accordingly.

   ```bash
   cp .env.example .env
   ```

4. Setup the database and seed it with mock data:

   ```bash
   pnpm db:setup
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Scripts

- **`pnpm db:reset`**: Drops the entire public schema and rebuilds it using `schema.sql`. (Warning: Destructive)
- **`pnpm db:seed`** or **`pnpm seed`**: Bulk inserts a large set of realistic mock data for system-wide testing. Supports multiple execution modes via the `--mode` flag:
  - `--mode=minimal`: Extremely fast generation (20-50 users, 50 jobs) for rapid local testing.
  - `--mode=standard` (default): Realistic dataset (500+ users, 2500 jobs, 10000+ apps) for everyday development.
  - `--mode=large`: Massive dataset (1500+ users, 15000 jobs, 50000+ apps) for performance testing, QA, and pagination.
- **`pnpm db:setup`**: Runs `db:reset` followed immediately by `db:seed`.
- **`pnpm seed:candidate --user=<id>`**: Populates realistic scenario data for a specific candidate ID. Generates missing profile information, creates applications to open jobs, and populates the activity timeline. Useful for testing the candidate dashboard. Options: `--applications=<num>`, `--seed=<num>`, `--dry-run`.
- **`pnpm seed:recruiter --user=<id>`**: Populates realistic scenario data for a specific employer/recruiter ID. Generates jobs, applicants, and recruiter activity for their ATS view. Useful for testing the recruiter dashboard. Options: `--jobs=<num>`, `--applications=<num>`, `--seed=<num>`, `--dry-run`.

## Development Checklist

### Core Infrastructure

- [x] Set up Next.js architecture and database connections.
- [x] Implement robust authentication and authorization using Better Auth (RBAC for Job Seekers, Recruiters, Admins).
- [x] Set up Hono API routes.

### User Profile Management

- [x] Create user registration and onboarding flow.
- [x] Build professional profile management (personal info, education, work experience, skills).
- [x] Implement resume and portfolio upload functionality.
- [x] Add profile visibility controls.

### Job Search & Application System

- [x] Develop job search engine with keyword filtering and sorting.
- [ ] Implement personalized job recommendations (based on user profile).
- [x] Build job application submission flow.
- [x] Allow users to save jobs and track application status.

### Recruiter Dashboard & ATS

- [x] Build tools for creating and managing job postings.
- [x] Develop Applicant Tracking System (ATS) interface.
- [x] Implement candidate review, filtering, and shortlisting.
- [ ] Add recruitment analytics.

### Administration & Governance

- [ ] Build System Admin dashboard for user management.
- [ ] Implement platform monitoring and audit logging.

### Future Enhancements

- [ ] AI-driven job recommendations.
- [ ] AI-powered resume analysis.
- [ ] Automated certifications upload and verification.

---

_This project was initialized with `create-next-app` and uses React Compiler for optimized rendering._
