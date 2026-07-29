# Deployment Guide: Vercel & Supabase

This guide covers the best practices for deploying this application to **Vercel** while using a **Supabase PostgreSQL** database. It specifically addresses database connection strategies, connection pooling, and SSL requirements to ensure a stable and scalable production environment.

## 1. Understanding Connection Pooling

When deploying a Next.js application to Vercel, your application runs in a **Serverless** environment. 
Serverless functions are stateless and can spin up and down hundreds of times per minute depending on incoming traffic.

If your application uses a direct database connection, every single serverless function invocation will open its own dedicated connection to Supabase. This will quickly exhaust your database's connection limit (typically around 100-200 connections), causing the application to crash with a `too many clients already` error.

To solve this, **Connection Pooling** acts as a middleman, efficiently sharing a small number of actual database connections among thousands of incoming serverless requests.

Supabase provides two types of connection poolers:
- **Transaction Pooler (Recommended for Vercel):** Ideal for serverless functions where each interaction with Postgres is brief and stateless.
- **Session Pooler (Recommended for Local Scripts):** Assigns a connection for the duration of a session. Useful for long-running scripts, local migrations, or connecting via IPv4-only networks.

## 2. IPv6 and Network Requirements

In early 2024, Supabase transitioned their default database domains to resolve exclusively to **IPv6**.
- **Vercel** fully supports IPv6, so connecting from Vercel to Supabase via IPv6 works perfectly.
- **Local ISP Networks** often do not support IPv6. If you attempt to connect locally using the default IPv6 domain, you will receive an `ENETUNREACH` error. 

To bypass this locally without paying for an IPv4 add-on, you must use the **Session Pooler**, which routes traffic through Supabase's proxy that retains IPv4 support.

## 3. Environment Variable Setup

Because of the differences between the Vercel runtime and your local machine, you should use a **Dual Connection String Strategy**.

### A. Local Development (`.env` and `.env.production`)
When running the app locally or executing scripts like `reset-db.ts`, you need IPv4 support and session-level persistence.

1. Go to your **Supabase Dashboard** -> **Project Settings** -> **Database**.
2. Scroll to **Connection String**.
3. Check the box for **"Use connection pooling"**.
4. Select **Session pooler**.
5. Copy the connection string (it will contain `.pooler.supabase.com`).
6. Add it to your local environment files:

```env
# .env and .env.production (Local Machine)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
```

### B. Production Deployment (Vercel)
When deploying to Vercel, you need the Transaction Pooler to handle serverless scale.

1. Go to your **Supabase Dashboard** -> **Project Settings** -> **Database**.
2. Scroll to **Connection String**.
3. Check the box for **"Use connection pooling"**.
4. Select **Transaction pooler**.
5. Copy the connection string.
6. Go to your **Vercel Dashboard** -> Your Project -> **Settings** -> **Environment Variables**.
7. Add the `DATABASE_URL` variable with the copied string.

```env
# Vercel Environment Variables
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

*(Note: Depending on your ORM, you may need to append `?pgbouncer=true` to the URL. For standard `pg` drivers, this is usually optional but recommended).*

## 4. SSL Configuration for Production

When connecting to an external managed database like Supabase from a production server, an encrypted SSL connection is required.

By default, the `pg` driver does not enforce SSL. If you attempt to connect from Vercel without explicitly configuring SSL, the connection will drop.

To handle this, your `server/app/db.ts` file has been configured to automatically require SSL when running in the `production` environment, while skipping strict certificate validation (`rejectUnauthorized: false`), which is a standard requirement for cloud-based connection poolers.

```typescript
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Ensure it exists in the root .env");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  // Enforce SSL in production while allowing cloud proxy certificates
  ...(process.env.NODE_ENV === "production" && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});
```

## 5. Deployment Checklist

Before triggering a deployment on Vercel, verify the following:

- [ ] `DATABASE_URL` is set in Vercel Environment Variables using the **Transaction Pooler** string.
- [ ] `NODE_ENV` is implicitly set to `production` by Vercel.
- [ ] Any other required environment variables (e.g., authentication secrets, public API URLs) are configured in Vercel.
- [ ] Local migrations or database resets are run from your local machine using the **Session Pooler** string.

---
*Following these guidelines ensures that your application will scale gracefully on Vercel without hitting database connection limits or networking errors.*
