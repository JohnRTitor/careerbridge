import { faker } from "@faker-js/faker";
import { pool } from "../app/db";
import { randomUUID as uuidv4 } from "node:crypto";
async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create Companies
    console.log("Creating companies...");
    const companyIds: string[] = [];
    for (let i = 0; i < 10; i++) {
      const id = uuidv4();
      companyIds.push(id);
      await pool.query(
        `INSERT INTO companies (id, name, description, logo_url, website, industry, size, location, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          faker.company.name(),
          faker.company.catchPhrase(),
          faker.image.urlLoremFlickr({ category: "business" }),
          faker.internet.url(),
          faker.commerce.department(),
          faker.helpers.arrayElement(["1-10", "11-50", "51-200", "201-500", "500+"]),
          faker.location.city(),
          faker.datatype.boolean(0.8), // 80% verified
        ]
      );
    }

    // 2. Create Users (Candidates & Recruiters)
    console.log("Creating users...");
    const candidateIds: string[] = [];
    const recruiterIds: string[] = [];

    // 10 Candidates
    for (let i = 0; i < 10; i++) {
      const id = uuidv4();
      candidateIds.push(id);
      await pool.query(
        `INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())`,
        [
          id,
          faker.person.fullName(),
          faker.internet.email(),
          true,
          faker.image.avatar(),
          "candidate",
        ]
      );

      // Create Profile
      await pool.query(
        `INSERT INTO user_profile (user_id, headline, about, visibility, portfolio_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          faker.person.jobTitle(),
          faker.lorem.paragraph(),
          "public",
          faker.internet.url(),
        ]
      );

      // Create Education
      await pool.query(
        `INSERT INTO education (id, user_id, institution, degree, field_of_study, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          uuidv4(),
          id,
          faker.company.name() + " University",
          faker.helpers.arrayElement(["BSc", "MSc", "PhD"]),
          faker.person.jobArea(),
          faker.date.past({ years: 5 }),
          faker.date.recent(),
        ]
      );
    }

    // 5 Recruiters
    for (let i = 0; i < 5; i++) {
      const id = uuidv4();
      recruiterIds.push(id);
      await pool.query(
        `INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())`,
        [
          id,
          faker.person.fullName(),
          faker.internet.email(),
          true,
          faker.image.avatar(),
          "recruiter",
        ]
      );
    }

    // 3. Create Jobs
    console.log("Creating jobs...");
    const jobIds: string[] = [];
    for (let i = 0; i < 20; i++) {
      const id = uuidv4();
      jobIds.push(id);
      await pool.query(
        `INSERT INTO jobs (id, title, description, company_id, recruiter_id, location, type, salary_range, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          faker.person.jobTitle(),
          faker.lorem.paragraphs(3),
          faker.helpers.arrayElement(companyIds),
          faker.helpers.arrayElement(recruiterIds),
          faker.location.city(),
          faker.helpers.arrayElement(["full-time", "part-time", "contract", "internship"]),
          `$${faker.number.int({ min: 50, max: 150 })}k - $${faker.number.int({ min: 150, max: 250 })}k`,
          faker.helpers.arrayElement(["open", "closed", "draft"]),
        ]
      );
    }

    // 4. Create Applications
    console.log("Creating applications...");
    for (let i = 0; i < 30; i++) {
      // Avoid duplicate candidate-job combinations using a simple try-catch for unique constraints if any
      try {
        await pool.query(
          `INSERT INTO applications (id, candidate_id, job_id, status, cover_letter)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            uuidv4(),
            faker.helpers.arrayElement(candidateIds),
            faker.helpers.arrayElement(jobIds),
            faker.helpers.arrayElement(["pending", "reviewing", "shortlisted", "rejected", "hired"]),
            faker.lorem.paragraph(),
          ]
        );
      } catch (e) {
        // Ignore unique constraint violations (candidate can only apply to a job once)
      }
    }

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
