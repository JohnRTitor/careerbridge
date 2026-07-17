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
      jobs: { type: "string", default: "25" },
      applications: { type: "string" }, // if not set, random 20-100 per job
      seed: { type: "string" },
      "dry-run": { type: "boolean" },
      verbose: { type: "boolean" },
    },
  });

  if (!values.user) {
    console.error("Usage: pnpm seed:recruiter --user=<id> [--jobs=25] [--applications=50] [--seed=123]");
    process.exit(1);
  }

  const userId = values.user;
  const numJobs = parseInt(values.jobs as string, 10);
  const fixedApps = values.applications ? parseInt(values.applications as string, 10) : null;

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
    if (user.role !== "recruiter") {
      console.error(`User with ID ${userId} is not a recruiter (role: ${user.role}).`);
      process.exit(1);
    }

    // Get Recruiter Profile for Company ID
    const rpRes = await pool.query('SELECT company_id FROM recruiter_profiles WHERE user_id = $1', [userId]);
    const companyId = rpRes.rows.length > 0 ? rpRes.rows[0].company_id : null;
    
    // 2. Generate Jobs
    const jobsData = [];
    const generatedJobIds = [];
    let baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - 12); // jobs over the last year

    for (let i = 0; i < numJobs; i++) {
      const id = uuidv4();
      generatedJobIds.push(id);
      const createdAt = randomDate(baseDate, new Date());
      
      // Determine status based on age
      const ageMs = Date.now() - createdAt.getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      
      let status = "open";
      if (ageDays > 90) {
         status = faker.datatype.boolean(0.8) ? "closed" : "open"; 
      } else if (ageDays < 5 && faker.datatype.boolean(0.2)) {
         status = "draft";
      }

      jobsData.push([
        id, faker.person.jobTitle(), faker.lorem.paragraphs(4), userId, companyId, faker.location.city(),
        faker.helpers.arrayElement(JOB_TYPES), status, faker.helpers.arrayElement(WORK_MODES),
        faker.number.int({ min: 40000, max: 100000 }), faker.number.int({ min: 60000, max: 180000 }), "USD",
        faker.number.int({ min: 0, max: 5 }), faker.number.int({ min: 5, max: 15 }), faker.helpers.arrayElement(["High School", "Bachelor's", "Master's"]),
        faker.date.future({ years: 1, refDate: createdAt }), faker.number.int({ min: 1, max: 5 }), false, createdAt, createdAt
      ]);
    }

    if (!values["dry-run"]) {
      await batchInsert("jobs", ["id", "title", "description", "created_by", "company_id", "location", "type", "status", "work_mode", "minimum_salary", "maximum_salary", "currency", "experience_min", "experience_max", "education_level", "application_deadline", "vacancies", "is_featured", "created_at", "updated_at"], jobsData);
      if (values.verbose) console.log(`Created ${numJobs} jobs for recruiter.`);
    }

    // 3. Generate Applicants for each Job
    const candidateRes = await pool.query('SELECT id FROM "user" WHERE role = \'candidate\'');
    let candidateIds = candidateRes.rows.map((r: any) => r.id);

    // If not enough candidates, well, we just reuse them, but we must respect UNIQUE(job_id, candidate_id)
    // We have candidates, we just pick subset per job.

    const appsData = [];
    const auditLogsData = [];

    let totalAppsInserted = 0;

    for (let i = 0; i < generatedJobIds.length; i++) {
       const jobId = generatedJobIds[i];
       const jobAge = jobsData[i][18] as Date;
       const jobStatus = jobsData[i][7] as string;

       if (jobStatus === "draft") continue; // No apps for draft

       const numApps = fixedApps || faker.number.int({ min: 20, max: Math.min(100, candidateIds.length) });
       
       // Pick candidates uniquely for this job
       const jobCandidates = faker.helpers.arrayElements(candidateIds, Math.min(numApps, candidateIds.length));

       for (const candidateId of jobCandidates) {
          // Status distribution depends on job age and status
          // Newer jobs -> more pending/reviewing
          // Older jobs / closed -> more hired/rejected/shortlisted
          let statusProb = Math.random();
          let status = "pending";
          
          if (jobStatus === "closed") {
             if (statusProb > 0.95) status = "hired";
             else if (statusProb > 0.85) status = "shortlisted"; // never hired, but was shortlisted
             else status = "rejected";
          } else {
             const ageDays = (Date.now() - jobAge.getTime()) / (1000 * 60 * 60 * 24);
             if (ageDays < 7) {
                // very new, mostly pending
                if (statusProb > 0.90) status = "reviewing";
             } else if (ageDays < 30) {
                if (statusProb > 0.98) status = "hired"; // very fast
                else if (statusProb > 0.85) status = "shortlisted";
                else if (statusProb > 0.50) status = "reviewing";
             } else {
                if (statusProb > 0.95) status = "hired";
                else if (statusProb > 0.70) status = "rejected";
                else if (statusProb > 0.40) status = "shortlisted";
                else status = "reviewing"; // lingering
             }
          }

          const appliedAt = randomDate(jobAge, new Date());
          let reviewedAt = null;
          let rating = null;

          if (status !== "pending") {
             reviewedAt = randomDate(appliedAt, new Date());
             rating = status === "hired" ? 5 : (status === "rejected" ? faker.helpers.arrayElement([1, 2]) : faker.helpers.arrayElement([3, 4]));
          }

          appsData.push([
            uuidv4(), jobId, candidateId, status, null, // omit resume ID for simplicity
            faker.datatype.boolean(0.3) ? faker.lorem.paragraph() : null,
            status !== "pending" ? faker.lorem.sentence() : null,
            status !== "pending" ? userId : null,
            reviewedAt, rating, appliedAt, appliedAt
          ]);

          totalAppsInserted++;

          auditLogsData.push([uuidv4(), candidateId, "application_submitted", "job", jobId, JSON.stringify({ status: "pending", source: "web" }), appliedAt]);
          
          if (status !== "pending") {
             auditLogsData.push([uuidv4(), userId, "application_reviewed", "application", jobId, JSON.stringify({ new_status: status }), reviewedAt]);
          }
       }
    }

    if (values["dry-run"]) {
       console.log(`[Dry Run] Would insert ${numJobs} jobs and ${totalAppsInserted} applications.`);
    } else {
      await batchInsert("applications", ["id", "job_id", "candidate_id", "status", "resume_id", "cover_letter", "recruiter_notes", "reviewed_by", "reviewed_at", "rating", "applied_at", "updated_at"], appsData);
      await batchInsert("audit_logs", ["id", "actor_id", "action", "target_type", "target_id", "details", "created_at"], auditLogsData);
      console.log(`✅ Successfully seeded ${numJobs} jobs with ${totalAppsInserted} total applications for recruiter ${userId}`);
    }

  } catch (err) {
    console.error("Error running recruiter seed script:", err);
  } finally {
    await pool.end();
  }
}

main();
