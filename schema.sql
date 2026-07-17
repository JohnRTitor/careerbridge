CREATE TYPE visibility AS ENUM (
  'public',
  'private'
);

CREATE TYPE job_type AS ENUM (
  'full-time',
  'part-time',
  'contract',
  'internship',
  'freelance'
);

CREATE TYPE job_status AS ENUM (
  'open',
  'closed',
  'draft'
);

CREATE TYPE application_status AS ENUM (
  'pending',
  'reviewing',
  'shortlisted',
  'rejected',
  'hired'
);

CREATE TYPE work_mode AS ENUM (
  'remote',
  'hybrid',
  'onsite'
);

CREATE TABLE "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL,
  "image" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "role" TEXT,
  "banned" BOOLEAN,
  "banReason" TEXT,
  "banExpires" TIMESTAMPTZ
);

CREATE TABLE "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "impersonatedBy" TEXT
);

CREATE TABLE "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMPTZ,
  "refreshTokenExpiresAt" TIMESTAMPTZ,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE TABLE "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX "session_userId_idx" ON "session" ("userId");

CREATE INDEX "account_userId_idx" ON "account" ("userId");

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

-- ==========================================
-- Core Profile
-- ==========================================

CREATE TABLE user_profile (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,

  headline TEXT,
  about TEXT,

  first_name TEXT,
  last_name TEXT,

  phone TEXT,
  date_of_birth DATE,

  gender TEXT,

  country TEXT,
  state TEXT,
  city TEXT,

  address TEXT,
  postal_code TEXT,

  avatar_url TEXT,

  visibility visibility NOT NULL DEFAULT 'public',

  portfolio_url TEXT,
  resume_url TEXT,

  open_to_work BOOLEAN NOT NULL DEFAULT true,
  willing_to_relocate BOOLEAN NOT NULL DEFAULT false,

  expected_salary NUMERIC,
  current_salary NUMERIC,

  years_of_experience INTEGER DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ==========================================
-- Career Data
-- ==========================================

CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  repository_url TEXT,
  live_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- Skills & Languages
-- ==========================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE user_skills (
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  years_of_experience INTEGER,
  proficiency SMALLINT CHECK (
    proficiency BETWEEN 1 AND 5
  ),
  PRIMARY KEY(user_id, skill_id)
);

CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE user_languages (
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  proficiency TEXT,
  PRIMARY KEY(user_id, language_id)
);

-- ==========================================
-- Documents
-- ==========================================

CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  title TEXT,
  file_url TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- Social & Preferences
-- ==========================================

CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE job_preferences (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  preferred_job_type job_type,
  preferred_work_mode work_mode,
  preferred_location TEXT,
  expected_salary NUMERIC,
  notice_period INTEGER,
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- Companies
-- ==========================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE company_followers (
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  followed_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, company_id)
);

CREATE TABLE company_members (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  role TEXT,
  PRIMARY KEY(company_id, user_id)
);

CREATE TABLE recruiter_profiles (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  designation TEXT,
  phone TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- ==========================================
-- Jobs & Applications
-- ==========================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  location TEXT,
  type job_type NOT NULL DEFAULT 'full-time',
  status job_status NOT NULL DEFAULT 'open',
  
  work_mode work_mode,
  minimum_salary NUMERIC,
  maximum_salary NUMERIC,
  currency CHAR(3),
  experience_min INTEGER,
  experience_max INTEGER,
  education_level TEXT,
  application_deadline DATE,
  vacancies INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE saved_jobs (
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, job_id)
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  cover_letter TEXT,
  recruiter_notes TEXT,
  reviewed_by TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  rating SMALLINT,

  applied_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- ==========================================
-- Administration
-- ==========================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
