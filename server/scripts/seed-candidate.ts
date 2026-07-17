import { parseArgs } from "node:util";
import { faker } from "@faker-js/faker";
import { pool } from "../app/db";
import { randomUUID as uuidv4 } from "node:crypto";
import { JOB_TYPES, WORK_MODES, VISIBILITIES, randomDate, batchInsert } from "./seed-utils";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      user: { type: "string" },
      applications: { type: "string", default: "50" },
      seed: { type: "string" },
      "dry-run": { type: "boolean" },
      verbose: { type: "boolean" },
    },
  });

  if (!values.user) {
    console.error("Usage: pnpm seed:candidate --user=<id> [--applications=50] [--seed=123]");
    process.exit(1);
  }

  const userId = values.user;
  const numApplications = parseInt(values.applications as string, 10);

  if (values.seed) {
    faker.seed(parseInt(values.seed as string, 10));
  }

  try {
    // 1. Verify User
    const userRes = await pool.query('SELECT * FROM "user" WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      console.error(`User with ID ${userId} not found.`);
      process.exit(1);
    }
    const user = userRes.rows[0];
    if (user.role !== "candidate") {
      console.error(`User with ID ${userId} is not a candidate (role: ${user.role}).`);
      process.exit(1);
    }
    const firstName = user.name.split(" ")[0] || "Test";
    const lastName = user.name.split(" ").slice(1).join(" ") || "User";

    // 2. Ensure Profile Exists
    const profileRes = await pool.query('SELECT * FROM "user_profile" WHERE user_id = $1', [userId]);
    if (profileRes.rows.length === 0) {
      if (values.verbose) console.log("Creating missing candidate profile...");
      await pool.query(
        `INSERT INTO user_profile (user_id, headline, about, first_name, last_name, avatar_url, visibility, open_to_work) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
        [userId, faker.person.jobTitle(), faker.lorem.paragraphs(2), firstName, lastName, faker.image.avatar(), 'public']
      );
    }

    // Ensure at least one resume exists
    const resumeRes = await pool.query('SELECT id FROM resumes WHERE user_id = $1', [userId]);
    let resumeId;
    if (resumeRes.rows.length === 0) {
      resumeId = uuidv4();
      await pool.query(
        `INSERT INTO resumes (id, user_id, title, file_url, is_default) VALUES ($1, $2, $3, $4, true)`,
        [resumeId, userId, `${firstName}'s Resume`, faker.internet.url()]
      );
    } else {
      resumeId = resumeRes.rows[0].id;
    }

    // 3. Find Open Jobs & Employers
    const openJobsRes = await pool.query("SELECT id FROM jobs WHERE status = 'open'");
    let jobIds = openJobsRes.rows.map((r: any) => r.id);

    // Get an employer and company for mock jobs if we need more
    if (jobIds.length < numApplications) {
      if (values.verbose) console.log(`Need ${numApplications} jobs, but only found ${jobIds.length}. Creating mock jobs...`);
      const employersRes = await pool.query("SELECT id FROM \"user\" WHERE role = 'employer' LIMIT 50");
      if (employersRes.rows.length === 0) {
         console.error("No employers found in the database. Please run the main db:seed script first.");
         process.exit(1);
      }
      const employers = employersRes.rows;
      
      const companiesRes = await pool.query("SELECT id FROM companies LIMIT 50");
      const companyIds = companiesRes.rows.map((r: any) => r.id);

      const newJobsData = [];
      const neededJobs = numApplications - jobIds.length;
      for (let i = 0; i < neededJobs; i++) {
        const id = uuidv4();
        const createdAt = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
        jobIds.push(id);
        const empId = faker.helpers.arrayElement(employers).id;
        const compId = companyIds.length > 0 ? faker.helpers.arrayElement(companyIds) : null;
        newJobsData.push([
          id, faker.person.jobTitle(), faker.lorem.paragraphs(3), empId, compId, faker.location.city(),
          faker.helpers.arrayElement(JOB_TYPES), 'open', faker.helpers.arrayElement(WORK_MODES),
          faker.number.int({ min: 50000, max: 150000 }), faker.number.int({ min: 60000, max: 200000 }), "USD",
          faker.number.int({ min: 0, max: 3 }), faker.number.int({ min: 5, max: 10 }), "Bachelor's",
          faker.date.future(), 1, false, createdAt, createdAt
        ]);
      }
      if (!values["dry-run"]) {
        await batchInsert("jobs", ["id", "title", "description", "created_by", "company_id", "location", "type", "status", "work_mode", "minimum_salary", "maximum_salary", "currency", "experience_min", "experience_max", "education_level", "application_deadline", "vacancies", "is_featured", "created_at", "updated_at"], newJobsData);
      }
    }

    // 4. Submit Applications
    const selectedJobIds = faker.helpers.arrayElements(jobIds, numApplications);
    const existingAppsRes = await pool.query("SELECT job_id FROM applications WHERE candidate_id = $1", [userId]);
    const existingJobIds = new Set(existingAppsRes.rows.map((r: any) => r.job_id));

    const appsData = [];
    const savedJobsData = [];
    const auditLogsData = [];
    
    let baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - 6);

    let insertedCount = 0;
    
    for (const jobId of selectedJobIds) {
      if (existingJobIds.has(jobId)) continue;
      existingJobIds.add(jobId);

      const rand = Math.random();
      let status = "pending";
      if (rand > 0.98) status = "hired";
      else if (rand > 0.90) status = "rejected";
      else if (rand > 0.80) status = "shortlisted";
      else if (rand > 0.60) status = "reviewing";

      const appliedAt = randomDate(baseDate, new Date());
      let reviewedAt = null;
      let rating = null;

      if (status !== "pending") {
         reviewedAt = randomDate(appliedAt, new Date());
         rating = status === "hired" ? 5 : (status === "rejected" ? faker.helpers.arrayElement([1, 2]) : faker.helpers.arrayElement([3, 4]));
      }

      appsData.push([
        uuidv4(), jobId, userId, status, resumeId,
        faker.datatype.boolean(0.5) ? faker.lorem.paragraph() : null,
        status !== "pending" ? faker.lorem.sentence() : null,
        null,
        reviewedAt, rating, appliedAt, appliedAt
      ]);

      insertedCount++;

      if (faker.datatype.boolean(0.2)) {
         savedJobsData.push([userId, jobId, randomDate(baseDate, appliedAt)]);
      }

      auditLogsData.push([uuidv4(), userId, "application_submitted", "job", jobId, JSON.stringify({ status: "pending", source: "web" }), appliedAt]);
      
      if (status === "reviewing" || status === "shortlisted" || status === "hired" || status === "rejected") {
         auditLogsData.push([uuidv4(), null, "application_status_updated", "application", jobId, JSON.stringify({ old_status: "pending", new_status: status }), reviewedAt]);
      }
      
      if (status === "shortlisted") {
         auditLogsData.push([uuidv4(), null, "interview_scheduled", "application", jobId, JSON.stringify({ type: "video", date: faker.date.soon({ days: 7, refDate: reviewedAt }) }), reviewedAt]);
      }
    }

    if (values["dry-run"]) {
       console.log(`[Dry Run] Would insert ${insertedCount} applications.`);
    } else {
      await batchInsert("applications", ["id", "job_id", "candidate_id", "status", "resume_id", "cover_letter", "recruiter_notes", "reviewed_by", "reviewed_at", "rating", "applied_at", "updated_at"], appsData);
      await batchInsert("saved_jobs", ["user_id", "job_id", "saved_at"], savedJobsData, "(user_id, job_id) DO NOTHING");
      await batchInsert("audit_logs", ["id", "actor_id", "action", "target_type", "target_id", "details", "created_at"], auditLogsData);
      console.log(`✅ Successfully seeded ${insertedCount} applications for candidate ${userId}`);
    }

  } catch (err) {
    console.error("Error running candidate seed script:", err);
  } finally {
    await pool.end();
  }
}

main();
