import { faker } from "@faker-js/faker";
import { pool } from "../app/db";
import { randomUUID as uuidv4 } from "node:crypto";

faker.seed(12345);

const TARGETS = {
  CANDIDATES: 500,
  EMPLOYERS: 150,
  COMPANIES: 100,
  JOBS: 2500,
  APPLICATIONS: 10000,
};

import { JOB_TYPES, WORK_MODES, VISIBILITIES, randomDate, batchInsert } from "./seed-utils";

// --- Data Stores ---
const skillIds: string[] = [];
const languageIds: string[] = [];
const companyIds: string[] = [];
const candidateIds: string[] = [];
const employerIds: string[] = [];
const jobIds: string[] = [];
const candidateResumes: Record<string, string[]> = {};
let baseDate = new Date();
baseDate.setFullYear(baseDate.getFullYear() - 3); // Seed over the last 3 years

// --- Modules ---

async function createSkillsAndLanguages() {
  console.log("Generating Skills & Languages...");
  const skills = [
    "Rust", "Go", "TypeScript", "Java", "Kotlin", "Python", "C#", "C++", "Swift",
    "React", "Next.js", "Vue", "Angular", "Tailwind", "Svelte",
    "Hono", "Express", "NestJS", "Spring", "Django", "FastAPI",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "PyTorch", "TensorFlow", "LLM", "LangChain", "Vector Databases", "RAG",
    "Figma", "UI/UX", "Product Management", "Agile", "Scrum",
    "Cybersecurity", "Blockchain", "Solidity"
  ];

  const skillData = skills.map(s => {
    const id = uuidv4();
    skillIds.push(id);
    return [id, s];
  });
  await batchInsert("skills", ["id", "name"], skillData, "DO NOTHING");

  const languages = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Hindi", "Arabic", "Portuguese", "Russian"];
  const langData = languages.map(l => {
    const id = uuidv4();
    languageIds.push(id);
    return [id, l];
  });
  await batchInsert("languages", ["id", "name"], langData, "DO NOTHING");
}

async function createCompanies() {
  console.log(`Generating ${TARGETS.COMPANIES} Companies...`);
  const industries = ["Technology", "Healthcare", "Fintech", "E-commerce", "Education", "Manufacturing", "Gaming", "Cybersecurity", "Consulting", "Biotech", "AI"];
  
  const companyData = [];
  for (let i = 0; i < TARGETS.COMPANIES; i++) {
    const id = uuidv4();
    companyIds.push(id);
    const createdAt = randomDate(baseDate, new Date());
    companyData.push([
      id,
      faker.company.name(),
      faker.company.catchPhrase() + ". " + faker.lorem.paragraph(),
      faker.image.url(),
      faker.internet.url(),
      faker.helpers.arrayElement(industries),
      faker.helpers.arrayElement(["1-10", "11-50", "51-200", "201-500", "500+", "1000+"]),
      faker.location.city() + ", " + faker.location.country(),
      faker.datatype.boolean(0.7), // 70% verified
      createdAt,
      createdAt
    ]);
  }
  await batchInsert("companies", ["id", "name", "description", "logo_url", "website", "industry", "size", "location", "is_verified", "created_at", "updated_at"], companyData);
}

async function createUsers() {
  console.log(`Generating ${TARGETS.CANDIDATES} Candidates and ${TARGETS.EMPLOYERS} Employers...`);
  
  const userData = [];
  const profileData = [];
  const educationData = [];
  const experienceData = [];
  const certificationsData = [];
  const projectsData = [];
  const userSkillsData = [];
  const userLangsData = [];
  const socialLinksData = [];
  const jobPrefsData = [];
  const resumesData = [];
  const recruiterProfilesData = [];
  const companyMembersData = [];
  const followersData = [];

  const totalUsers = TARGETS.CANDIDATES + TARGETS.EMPLOYERS;
  
  for (let i = 0; i < totalUsers; i++) {
    const id = uuidv4();
    const isCandidate = i < TARGETS.CANDIDATES;
    if (isCandidate) candidateIds.push(id);
    else employerIds.push(id);

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const createdAt = randomDate(baseDate, new Date());
    
    // User Record
    userData.push([
      id,
      `${firstName} ${lastName}`,
      faker.internet.email({ firstName, lastName, provider: isCandidate ? 'gmail.com' : 'workmail.com' }) + uuidv4().slice(0, 4), // ensure unique
      true,
      faker.image.avatar(),
      createdAt,
      createdAt,
      isCandidate ? "candidate" : "employer",
      faker.datatype.boolean(0.02), // 2% banned
      null,
      null
    ]);

    if (isCandidate) {
      // Profile
      profileData.push([
        id,
        faker.person.jobTitle(),
        faker.lorem.paragraphs(2),
        firstName,
        lastName,
        faker.phone.number(),
        faker.date.birthdate({ min: 18, max: 65 }),
        faker.person.sex(),
        faker.location.country(),
        faker.location.state(),
        faker.location.city(),
        faker.location.streetAddress(),
        faker.location.zipCode(),
        faker.image.avatar(),
        faker.helpers.arrayElement(VISIBILITIES),
        faker.internet.url(),
        faker.internet.url(),
        faker.datatype.boolean(0.8), // 80% open to work
        faker.datatype.boolean(0.5), // 50% willing to relocate
        faker.number.int({ min: 40000, max: 150000 }), // expected salary
        faker.number.int({ min: 35000, max: 140000 }), // current salary
        faker.number.int({ min: 0, max: 20 }), // YOE
        createdAt,
        createdAt
      ]);

      // Education (1-3 records)
      const numEd = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < numEd; j++) {
        educationData.push([
          uuidv4(), id, faker.company.name() + " University", faker.helpers.arrayElement(["BSc", "MSc", "PhD", "Associate", "Diploma"]),
          faker.person.jobArea(), faker.date.past({ years: 10 }), faker.date.recent(), faker.lorem.sentences(2), createdAt, createdAt
        ]);
      }

      // Experience (0-4 records)
      const numExp = faker.number.int({ min: 0, max: 4 });
      for (let j = 0; j < numExp; j++) {
        experienceData.push([
          uuidv4(), id, faker.person.jobTitle(), faker.company.name(), faker.location.city(),
          faker.date.past({ years: 8 }), faker.datatype.boolean() ? faker.date.recent() : null, faker.lorem.paragraph(), createdAt, createdAt
        ]);
      }

      // Certifications
      if (faker.datatype.boolean()) {
        certificationsData.push([
          uuidv4(), id, faker.hacker.adjective() + " Certified " + faker.hacker.noun(), faker.company.name(),
          faker.date.past(), faker.date.future(), uuidv4(), faker.internet.url(), createdAt
        ]);
      }

      // Projects
      if (faker.datatype.boolean()) {
        projectsData.push([
          uuidv4(), id, faker.commerce.productName(), faker.lorem.paragraph(), faker.internet.url(), faker.internet.url(),
          faker.date.past(), faker.date.recent(), createdAt
        ]);
      }

      // Skills (3-10)
      const userSkills = faker.helpers.arrayElements(skillIds, faker.number.int({ min: 3, max: 10 }));
      for (const skillId of userSkills) {
        userSkillsData.push([id, skillId, faker.number.int({ min: 1, max: 10 }), faker.number.int({ min: 1, max: 5 })]);
      }

      // Languages (1-3)
      const userLangs = faker.helpers.arrayElements(languageIds, faker.number.int({ min: 1, max: 3 }));
      for (const langId of userLangs) {
        userLangsData.push([id, langId, faker.helpers.arrayElement(["Beginner", "Intermediate", "Advanced", "Native"])]);
      }

      // Social Links
      socialLinksData.push([uuidv4(), id, "LinkedIn", `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`]);
      socialLinksData.push([uuidv4(), id, "GitHub", `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`]);

      // Job Prefs
      jobPrefsData.push([
        id, faker.helpers.arrayElement(JOB_TYPES), faker.helpers.arrayElement(WORK_MODES), faker.location.city(),
        faker.number.int({ min: 50000, max: 200000 }), faker.number.int({ min: 0, max: 90 }), faker.datatype.boolean(), createdAt
      ]);

      // Resumes (1-3) - 95% of candidates have resumes, 5% edge case no resume
      if (faker.datatype.boolean(0.95)) {
        const numResumes = faker.number.int({ min: 1, max: 3 });
        candidateResumes[id] = [];
        for (let j = 0; j < numResumes; j++) {
          const resId = uuidv4();
          candidateResumes[id].push(resId);
          resumesData.push([
            resId, id, `${firstName}'s Resume v${j+1}`, faker.internet.url(), j === 0, createdAt
          ]);
        }
      }

      // Follows Companies
      const numFollows = faker.number.int({ min: 0, max: 5 });
      const followedCompanies = faker.helpers.arrayElements(companyIds, numFollows);
      for (const compId of followedCompanies) {
        followersData.push([id, compId, createdAt]);
      }

    } else {
      // Employer Profile
      const compId = faker.helpers.arrayElement(companyIds);
      recruiterProfilesData.push([
        id, compId, faker.person.jobTitle(), faker.phone.number(), faker.datatype.boolean(0.8), createdAt
      ]);
      companyMembersData.push([compId, id, faker.helpers.arrayElement(["admin", "recruiter", "viewer"])]);
    }
  }

  await batchInsert("user", ["id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires"], userData);
  await batchInsert("user_profile", ["user_id", "headline", "about", "first_name", "last_name", "phone", "date_of_birth", "gender", "country", "state", "city", "address", "postal_code", "avatar_url", "visibility", "portfolio_url", "resume_url", "open_to_work", "willing_to_relocate", "expected_salary", "current_salary", "years_of_experience", "created_at", "updated_at"], profileData);
  await batchInsert("education", ["id", "user_id", "institution", "degree", "field_of_study", "start_date", "end_date", "description", "created_at", "updated_at"], educationData);
  await batchInsert("experience", ["id", "user_id", "title", "company", "location", "start_date", "end_date", "description", "created_at", "updated_at"], experienceData);
  await batchInsert("certifications", ["id", "user_id", "name", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "created_at"], certificationsData);
  await batchInsert("projects", ["id", "user_id", "title", "description", "repository_url", "live_url", "start_date", "end_date", "created_at"], projectsData);
  
  // Handle DO NOTHING for composite primary keys just in case faker picked same skill twice
  await batchInsert("user_skills", ["user_id", "skill_id", "years_of_experience", "proficiency"], userSkillsData, "(user_id, skill_id) DO NOTHING");
  await batchInsert("user_languages", ["user_id", "language_id", "proficiency"], userLangsData, "(user_id, language_id) DO NOTHING");
  
  await batchInsert("social_links", ["id", "user_id", "platform", "url"], socialLinksData);
  await batchInsert("job_preferences", ["user_id", "preferred_job_type", "preferred_work_mode", "preferred_location", "expected_salary", "notice_period", "willing_to_relocate", "updated_at"], jobPrefsData);
  await batchInsert("resumes", ["id", "user_id", "title", "file_url", "is_default", "uploaded_at"], resumesData);
  await batchInsert("recruiter_profiles", ["user_id", "company_id", "designation", "phone", "verified", "created_at"], recruiterProfilesData);
  await batchInsert("company_members", ["company_id", "user_id", "role"], companyMembersData, "(company_id, user_id) DO NOTHING");
  await batchInsert("company_followers", ["user_id", "company_id", "followed_at"], followersData, "(user_id, company_id) DO NOTHING");
}

async function createJobs() {
  console.log(`Generating ${TARGETS.JOBS} Jobs...`);
  const jobsData = [];
  
  for (let i = 0; i < TARGETS.JOBS; i++) {
    const id = uuidv4();
    jobIds.push(id);
    const createdAt = randomDate(baseDate, new Date());
    
    // Mix of realistic distributions
    const isDraft = faker.datatype.boolean(0.05); // 5% draft
    const isClosed = faker.datatype.boolean(0.15); // 15% closed
    const status = isDraft ? "draft" : (isClosed ? "closed" : "open");

    const minSalary = faker.number.int({ min: 40000, max: 120000 });
    const maxSalary = minSalary + faker.number.int({ min: 10000, max: 50000 });

    jobsData.push([
      id,
      faker.person.jobTitle(),
      faker.lorem.paragraphs(4) + "\n\nRequirements:\n- " + faker.lorem.sentences(3) + "\n\nBenefits:\n- " + faker.lorem.sentences(2),
      faker.helpers.arrayElement(employerIds), // created_by
      faker.datatype.boolean(0.95) ? faker.helpers.arrayElement(companyIds) : null, // company_id (5% edge case no company)
      faker.location.city(),
      faker.helpers.arrayElement(JOB_TYPES),
      status,
      faker.helpers.arrayElement(WORK_MODES),
      minSalary,
      maxSalary,
      "USD",
      faker.number.int({ min: 0, max: 3 }), // min exp
      faker.number.int({ min: 5, max: 15 }), // max exp
      faker.helpers.arrayElement(["High School", "Bachelor's", "Master's", "PhD"]),
      faker.date.future(), // deadline
      faker.number.int({ min: 1, max: 10 }), // vacancies
      faker.datatype.boolean(0.1), // 10% featured
      createdAt,
      createdAt
    ]);
  }

  await batchInsert("jobs", ["id", "title", "description", "created_by", "company_id", "location", "type", "status", "work_mode", "minimum_salary", "maximum_salary", "currency", "experience_min", "experience_max", "education_level", "application_deadline", "vacancies", "is_featured", "created_at", "updated_at"], jobsData);
}

async function createApplications() {
  console.log(`Generating ${TARGETS.APPLICATIONS} Applications...`);
  const appsData = [];
  const savedJobsData = [];
  const auditLogsData = [];

  // Track applied jobs per candidate to avoid unique constraint violations
  const candidateApplications = new Map<string, Set<string>>();

  for (let i = 0; i < TARGETS.APPLICATIONS; i++) {
    const candidateId = faker.helpers.arrayElement(candidateIds);
    const jobId = faker.helpers.arrayElement(jobIds);

    if (!candidateApplications.has(candidateId)) {
      candidateApplications.set(candidateId, new Set());
    }
    const appliedJobs = candidateApplications.get(candidateId)!;

    if (appliedJobs.has(jobId)) continue; // skip duplicates
    appliedJobs.add(jobId);

    const createdAt = randomDate(baseDate, new Date());
    
    // Funnel distribution
    const rand = Math.random();
    let status = "pending";
    if (rand > 0.98) status = "hired"; // 2%
    else if (rand > 0.90) status = "rejected"; // 8%
    else if (rand > 0.80) status = "shortlisted"; // 10%
    else if (rand > 0.55) status = "reviewing"; // 25%
    // 55% pending

    const candidateRes = candidateResumes[candidateId] || [];
    const resumeId = candidateRes.length > 0 ? faker.helpers.arrayElement(candidateRes) : null;
    const reviewedBy = status !== "pending" ? faker.helpers.arrayElement(employerIds) : null;

    appsData.push([
      uuidv4(),
      jobId,
      candidateId,
      status,
      resumeId,
      faker.datatype.boolean(0.4) ? faker.lorem.paragraph() : null, // 40% cover letter
      status !== "pending" ? faker.lorem.sentence() : null, // recruiter notes
      reviewedBy,
      status !== "pending" ? randomDate(createdAt, new Date()) : null,
      status === "hired" ? 5 : (status === "rejected" ? faker.helpers.arrayElement([1, 2]) : faker.helpers.arrayElement([3, 4, null])),
      createdAt,
      createdAt
    ]);

    // Also simulate saving some jobs
    if (faker.datatype.boolean(0.2)) {
      const savedJobId = faker.helpers.arrayElement(jobIds);
      savedJobsData.push([candidateId, savedJobId, randomDate(baseDate, new Date())]);
    }

    // Occasional audit log
    if (faker.datatype.boolean(0.05)) {
      auditLogsData.push([
        uuidv4(),
        candidateId,
        "application_submitted",
        "job",
        jobId,
        JSON.stringify({ status: "pending", source: "web" }),
        createdAt
      ]);
    }
  }

  await batchInsert("applications", ["id", "job_id", "candidate_id", "status", "resume_id", "cover_letter", "recruiter_notes", "reviewed_by", "reviewed_at", "rating", "applied_at", "updated_at"], appsData, "(job_id, candidate_id) DO NOTHING");
  await batchInsert("saved_jobs", ["user_id", "job_id", "saved_at"], savedJobsData, "(user_id, job_id) DO NOTHING");
  await batchInsert("audit_logs", ["id", "actor_id", "action", "target_type", "target_id", "details", "created_at"], auditLogsData);
}

async function verifyCounts() {
  const tables = [
    "user", "user_profile", "companies", "jobs", "applications", "skills", "languages", 
    "resumes", "education", "experience", "saved_jobs", "audit_logs"
  ];
  
  console.log("\n📊 Seed Summary:");
  for (const table of tables) {
    const res = await pool.query(`SELECT COUNT(*) FROM "${table}"`);
    console.log(`- ${table}: ${res.rows[0].count}`);
  }
}

async function seed() {
  console.log("🌱 Starting database seeding...");
  const startTime = Date.now();

  try {
    await createSkillsAndLanguages();
    await createCompanies();
    await createUsers();
    await createJobs();
    await createApplications();
    await verifyCounts();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Seeding complete in ${duration}s!`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
