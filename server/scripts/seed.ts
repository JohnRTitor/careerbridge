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
          faker.image.url(),
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
    const candidateResumes: Record<string, string> = {};
    const recruiterIds: string[] = [];

    // 10 Candidates
    for (let i = 0; i < 10; i++) {
      const id = uuidv4();
      candidateIds.push(id);
      
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      await pool.query(
        `INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())`,
        [
          id,
          `${firstName} ${lastName}`,
          faker.internet.email(),
          true,
          faker.image.avatar(),
          "candidate",
        ]
      );

      // Create Profile
      await pool.query(
        `INSERT INTO user_profile (user_id, headline, about, visibility, portfolio_url, first_name, last_name, expected_salary)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          faker.person.jobTitle(),
          faker.lorem.paragraph(),
          "public",
          faker.internet.url(),
          firstName,
          lastName,
          faker.number.int({ min: 50000, max: 150000 })
        ]
      );

      // Create Resume
      const resumeId = uuidv4();
      candidateResumes[id] = resumeId;
      await pool.query(
        `INSERT INTO resumes (id, user_id, title, file_url, is_default)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          resumeId,
          id,
          `${firstName}'s Resume`,
          faker.internet.url(),
          true
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

      const companyId = faker.helpers.arrayElement(companyIds);

      await pool.query(
        `INSERT INTO recruiter_profiles (user_id, company_id, designation, phone, verified)
         VALUES ($1, $2, $3, $4, $5)`,
        [
            id,
            companyId,
            faker.person.jobTitle(),
            faker.phone.number(),
            faker.datatype.boolean(0.8)
        ]
      );

      await pool.query(
        `INSERT INTO company_members (company_id, user_id, role)
         VALUES ($1, $2, $3)`,
         [companyId, id, "admin"]
      );
    }

    // 3. Create Jobs
    console.log("Creating jobs...");
    const jobIds: string[] = [];
    for (let i = 0; i < 20; i++) {
      const id = uuidv4();
      jobIds.push(id);
      await pool.query(
        `INSERT INTO jobs (id, title, description, company_id, created_by, location, type, status, minimum_salary, maximum_salary, currency, experience_min, experience_max, education_level, application_deadline, vacancies, work_mode, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          id,
          faker.person.jobTitle(),
          faker.lorem.paragraphs(3),
          faker.helpers.arrayElement(companyIds),
          faker.helpers.arrayElement(recruiterIds), // created_by
          faker.location.city(),
          faker.helpers.arrayElement(["full-time", "part-time", "contract", "internship"]), // type
          faker.helpers.arrayElement(["open", "closed", "draft"]), // status
          faker.number.int({ min: 50000, max: 90000 }), // minimum_salary
          faker.number.int({ min: 100000, max: 200000 }), // maximum_salary
          "USD", // currency
          faker.number.int({ min: 0, max: 2 }), // experience_min
          faker.number.int({ min: 3, max: 10 }), // experience_max
          faker.helpers.arrayElement(["Bachelor's", "Master's", "High School"]), // education_level
          faker.date.future(), // application_deadline
          faker.number.int({ min: 1, max: 5 }), // vacancies
          faker.helpers.arrayElement(["remote", "hybrid", "onsite"]), // work_mode
          faker.datatype.boolean(0.2) // is_featured
        ]
      );
    }

    // 4. Create Applications
    console.log("Creating applications...");
    for (let i = 0; i < 30; i++) {
      try {
        const candidateId = faker.helpers.arrayElement(candidateIds);
        const jobId = faker.helpers.arrayElement(jobIds);
        const resumeId = candidateResumes[candidateId];

        await pool.query(
          `INSERT INTO applications (id, candidate_id, job_id, status, resume_id, cover_letter, rating)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            uuidv4(),
            candidateId,
            jobId,
            faker.helpers.arrayElement(["pending", "reviewing", "shortlisted", "rejected", "hired"]),
            resumeId,
            faker.lorem.paragraph(),
            faker.helpers.arrayElement([1, 2, 3, 4, 5, null]),
          ]
        );
      } catch (e) {
        // Ignore unique constraint violations
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
