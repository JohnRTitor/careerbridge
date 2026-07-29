import { faker } from "@faker-js/faker";
import { pool } from "../app/db";
import { randomUUID as uuidv4 } from "node:crypto";
import { JOB_TYPES, WORK_MODES, VISIBILITIES, randomDate, batchInsert } from "./seed-utils";
import { 
  INDUSTRIES, YOE_DISTRIBUTION, 
  getWeightedRandom, getRandomLocation, generateUserIdentity, 
  generateCompanyContext, generateJobContext, generateCareerTimeline, 
  calculateSalary 
} from "./seed-generators";

faker.seed(12345);

// --- Configuration ---
export type SeedConfig = {
  candidates: number;
  employers: number;
  companies: number;
  jobs: number;
  applications: number;
}

export const SeedProfiles: Record<string, SeedConfig> = {
  minimal: {
    candidates: 30,
    employers: 10,
    companies: 15,
    jobs: 50,
    applications: 200,
  },
  standard: {
    candidates: 500,
    employers: 100,
    companies: 100,
    jobs: 2500,
    applications: 10000,
  },
  large: {
    candidates: 1500,
    employers: 250,
    companies: 500,
    jobs: 15000,
    applications: 50000,
  },
};

// --- State ---
type SeedState = {
  skillIds: Record<string, string>;
  languageIds: string[];
  companies: { id: string, industry: any, sizeCategory: any, location: any }[];
  candidates: { id: string, location: any, industry: any, yoe: number, skills: string[] }[];
  employers: { id: string, companyId: string }[];
  jobs: { id: string, companyId: string | null, skills: string[], location: any, industry: any }[];
  candidateResumes: Record<string, string[]>;
  baseDate: Date;
}

// --- CLI Parsing ---
function getMode(): string {
  const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
  if (modeArg) {
    return modeArg.split("=")[1];
  }
  return "standard";
}

// --- Modules ---

async function createSkillsAndLanguages(config: SeedConfig, state: SeedState) {
  const skills = new Set<string>();
  for (const ind of INDUSTRIES) {
    for (const skill of ind.skills) {
      skills.add(skill);
    }
  }

  const skillData = [];
  for (const s of skills) {
    const id = uuidv4();
    state.skillIds[s] = id;
    skillData.push([id, s]);
  }
  await batchInsert("skills", ["id", "name"], skillData, "(LOWER(name)) DO NOTHING");

  const languages = [
    "English", "Spanish", "French", "German", "Mandarin", "Japanese", "Hindi", "Arabic", 
    "Portuguese", "Russian", "Bengali", "Punjabi", "Javanese", "Wu", "Telugu", "Marathi", 
    "Turkish", "Korean", "Vietnamese", "Tamil", "Italian", "Urdu", "Gujarati", "Polish", 
    "Ukrainian", "Persian", "Malayalam", "Kannada", "Oriya", "Sundanese", "Hausa", 
    "Romanian", "Dutch", "Thai", "Amharic", "Sindhi", "Greek", "Czech", "Swedish"
  ];
  const langData = languages.map((l) => {
    const id = uuidv4();
    state.languageIds.push(id);
    return [id, l];
  });
  await batchInsert("languages", ["id", "name"], langData, "DO NOTHING");
}

async function createCompanies(config: SeedConfig, state: SeedState) {
  const companyData = [];
  for (let i = 0; i < config.companies; i++) {
    const id = uuidv4();
    const createdAt = randomDate(state.baseDate, new Date());
    const context = generateCompanyContext();
    const location = getRandomLocation();
    
    state.companies.push({ id, industry: context.industry, sizeCategory: context.sizeCategory, location });

    companyData.push([
      id,
      faker.company.name(),
      faker.company.catchPhrase() + ". " + faker.lorem.paragraph(),
      context.logoUrl,
      faker.internet.url(),
      context.industry.name,
      context.sizeCategory.size,
      location.city + ", " + location.country,
      context.sizeCategory.isEnterprise || faker.datatype.boolean(0.5), // Enterprises verified, others 50%
      createdAt,
      createdAt
    ]);
  }
  await batchInsert("companies", ["id", "name", "description", "logo_url", "website", "industry", "size", "location", "is_verified", "created_at", "updated_at"], companyData);
}

async function createUsers(config: SeedConfig, state: SeedState) {
  const userData = [];
  const profileData = [];
  const educationData: any[] = [];
  const experienceData: any[] = [];
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

  const totalUsers = config.candidates + config.employers;
  
  for (let i = 0; i < totalUsers; i++) {
    const id = uuidv4();
    const isCandidate = i < config.candidates;
    const identity = generateUserIdentity(isCandidate);
    const createdAt = randomDate(state.baseDate, new Date());
    
    // User Record
    userData.push([
      id,
      `${identity.firstName} ${identity.lastName}`,
      identity.email + uuidv4().slice(0, 4), // ensure unique
      true,
      identity.avatarUrl,
      createdAt,
      createdAt,
      isCandidate ? "candidate" : "employer",
      faker.datatype.boolean(0.02), // 2% banned
      null,
      null
    ]);

    if (isCandidate) {
      const yoeConfig = getWeightedRandom(YOE_DISTRIBUTION);
      const yoe = faker.number.int({ min: yoeConfig.min, max: yoeConfig.max });
      const industry = faker.helpers.arrayElement(INDUSTRIES);
      const location = getRandomLocation();
      const salary = calculateSalary(yoe, location.city, false);
      const timeline = generateCareerTimeline(id, yoe, industry, state.baseDate, createdAt);
      
      const candidateSkills = faker.helpers.arrayElements(industry.skills, faker.number.int({ min: 3, max: 10 }));
      
      state.candidates.push({ id, location, industry, yoe, skills: candidateSkills });
      
      // Profile
      profileData.push([
        id,
        timeline.title,
        faker.lorem.paragraphs(2),
        identity.firstName,
        identity.lastName,
        faker.phone.number(),
        timeline.dob,
        faker.person.sex(),
        location.country,
        location.state,
        location.city,
        faker.location.streetAddress(),
        faker.location.zipCode(),
        identity.avatarUrl,
        faker.helpers.arrayElement(VISIBILITIES),
        identity.portfolio,
        faker.internet.url(), // resume_url
        faker.datatype.boolean(0.8), // 80% open to work
        faker.datatype.boolean(0.5), // 50% willing to relocate
        salary.expected,
        salary.current,
        yoe,
        createdAt,
        createdAt
      ]);

      educationData.push(...timeline.educationData);
      experienceData.push(...timeline.experienceData);

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

      // Skills
      for (const skill of candidateSkills) {
        if (state.skillIds[skill]) {
          userSkillsData.push([id, state.skillIds[skill], faker.number.int({ min: 1, max: yoe || 1 }), faker.number.int({ min: 1, max: 5 })]);
        }
      }

      // Languages
      const userLangs = faker.helpers.arrayElements(state.languageIds, faker.number.int({ min: 1, max: 3 }));
      for (const langId of userLangs) {
        userLangsData.push([id, langId, faker.helpers.arrayElement(["Beginner", "Intermediate", "Advanced", "Native"])]);
      }

      // Social Links
      socialLinksData.push([uuidv4(), id, "LinkedIn", identity.linkedin]);
      socialLinksData.push([uuidv4(), id, "GitHub", identity.github]);

      // Job Prefs
      jobPrefsData.push([
        id, faker.helpers.arrayElement(JOB_TYPES), faker.helpers.arrayElement(WORK_MODES), location.city,
        salary.expected, faker.number.int({ min: 0, max: 90 }), faker.datatype.boolean(), createdAt
      ]);

      // Resumes
      if (faker.datatype.boolean(0.95)) {
        const numResumes = faker.number.int({ min: 1, max: 2 });
        state.candidateResumes[id] = [];
        for (let j = 0; j < numResumes; j++) {
          const resId = uuidv4();
          state.candidateResumes[id].push(resId);
          resumesData.push([
            resId, id, `${identity.firstName}'s Resume v${j+1}`, faker.internet.url(), j === 0, createdAt
          ]);
        }
      }

      // Follows Companies
      const numFollows = faker.number.int({ min: 0, max: 5 });
      const followedCompanies = faker.helpers.arrayElements(state.companies, numFollows);
      for (const comp of followedCompanies) {
        followersData.push([id, comp.id, createdAt]);
      }

    } else {
      // Employer Profile
      const company = faker.helpers.arrayElement(state.companies);
      state.employers.push({ id, companyId: company.id });
      
      recruiterProfilesData.push([
        id, company.id, faker.person.jobTitle(), faker.phone.number(), company.sizeCategory.isEnterprise || faker.datatype.boolean(0.8), createdAt
      ]);
      companyMembersData.push([company.id, id, faker.helpers.arrayElement(["admin", "recruiter", "viewer"])]);
    }
  }

  await batchInsert("user", ["id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires"], userData);
  await batchInsert("user_profile", ["user_id", "headline", "about", "first_name", "last_name", "phone", "date_of_birth", "gender", "country", "state", "city", "address", "postal_code", "avatar_url", "visibility", "portfolio_url", "resume_url", "open_to_work", "willing_to_relocate", "expected_salary", "current_salary", "years_of_experience", "created_at", "updated_at"], profileData);
  await batchInsert("education", ["id", "user_id", "institution", "degree", "field_of_study", "start_date", "end_date", "description", "created_at", "updated_at"], educationData);
  await batchInsert("experience", ["id", "user_id", "title", "company", "location", "start_date", "end_date", "description", "created_at", "updated_at"], experienceData);
  await batchInsert("certifications", ["id", "user_id", "name", "issuer", "issue_date", "expiry_date", "credential_id", "credential_url", "created_at"], certificationsData);
  await batchInsert("projects", ["id", "user_id", "title", "description", "repository_url", "live_url", "start_date", "end_date", "created_at"], projectsData);
  
  await batchInsert("user_skills", ["user_id", "skill_id", "years_of_experience", "proficiency"], userSkillsData, "(user_id, skill_id) DO NOTHING");
  await batchInsert("user_languages", ["user_id", "language_id", "proficiency"], userLangsData, "(user_id, language_id) DO NOTHING");
  
  await batchInsert("social_links", ["id", "user_id", "platform", "url"], socialLinksData);
  await batchInsert("job_preferences", ["user_id", "preferred_job_type", "preferred_work_mode", "preferred_location", "expected_salary", "notice_period", "willing_to_relocate", "updated_at"], jobPrefsData);
  await batchInsert("resumes", ["id", "user_id", "title", "file_url", "is_default", "uploaded_at"], resumesData);
  await batchInsert("recruiter_profiles", ["user_id", "company_id", "designation", "phone", "verified", "created_at"], recruiterProfilesData);
  await batchInsert("company_members", ["company_id", "user_id", "role"], companyMembersData, "(company_id, user_id) DO NOTHING");
  await batchInsert("company_followers", ["user_id", "company_id", "followed_at"], followersData, "(user_id, company_id) DO NOTHING");
}

async function createJobs(config: SeedConfig, state: SeedState) {
  const jobsData = [];
  
  for (let i = 0; i < config.jobs; i++) {
    const id = uuidv4();
    const createdAt = randomDate(state.baseDate, new Date());
    
    // Choose a company randomly, but weighted by their multiplier
    const company = getWeightedRandom(state.companies.map(c => ({ ...c, weight: c.sizeCategory.jobsMultiplier })));
    
    // Find employers for this company
    const companyEmployers = state.employers.filter(e => e.companyId === company.id);
    const employer = companyEmployers.length > 0 ? faker.helpers.arrayElement(companyEmployers) : faker.helpers.arrayElement(state.employers);
    
    const isDraft = faker.datatype.boolean(0.05); // 5% draft
    const isClosed = faker.datatype.boolean(0.15); // 15% closed
    const status = isDraft ? "draft" : (isClosed ? "closed" : "open");

    const experienceMin = faker.number.int({ min: 0, max: 7 });
    const salary = calculateSalary(experienceMin + 2, company.location.city, company.sizeCategory.isEnterprise);
    const jobContext = generateJobContext(company.industry.name);
    
    state.jobs.push({ id, companyId: company.id, skills: jobContext.skills, location: company.location, industry: company.industry });

    jobsData.push([
      id,
      jobContext.role,
      jobContext.description,
      employer.id,
      faker.datatype.boolean(0.95) ? company.id : null,
      company.location.city + ", " + company.location.country,
      faker.helpers.arrayElement(JOB_TYPES),
      status,
      faker.helpers.arrayElement(WORK_MODES),
      salary.jobMin,
      salary.jobMax,
      "USD",
      experienceMin,
      experienceMin + faker.number.int({ min: 2, max: 5 }), // max exp
      faker.helpers.arrayElement(["High School", "Bachelor's", "Master's", "PhD"]),
      faker.date.future(), // deadline
      faker.number.int({ min: 1, max: company.sizeCategory.isEnterprise ? 10 : 3 }), // vacancies
      faker.datatype.boolean(company.sizeCategory.isEnterprise ? 0.3 : 0.05), // featured
      createdAt,
      createdAt
    ]);
  }

  await batchInsert("jobs", ["id", "title", "description", "created_by", "company_id", "location", "type", "status", "work_mode", "minimum_salary", "maximum_salary", "currency", "experience_min", "experience_max", "education_level", "application_deadline", "vacancies", "is_featured", "created_at", "updated_at"], jobsData);
}

async function createApplications(config: SeedConfig, state: SeedState) {
  const appsData = [];
  const savedJobsData = [];
  const auditLogsData = [];

  const candidateApplications = new Map<string, Set<string>>();

  // Cache candidates by industry to optimize application matching
  const candidatesByIndustry: Record<string, typeof state.candidates> = {};
  for (const c of state.candidates) {
    if (!candidatesByIndustry[c.industry.name]) candidatesByIndustry[c.industry.name] = [];
    candidatesByIndustry[c.industry.name].push(c);
  }

  for (let i = 0; i < config.applications; i++) {
    // Pick a random job
    const job = faker.helpers.arrayElement(state.jobs);
    
    // Pick candidates from the same industry, or fall back to any candidate
    const industryCandidates = candidatesByIndustry[job.industry.name] || state.candidates;
    
    // Try to find a candidate that hasn't applied to this job yet
    let candidate = null;
    for (let attempts = 0; attempts < 10; attempts++) {
      const c = faker.helpers.arrayElement(industryCandidates);
      if (!candidateApplications.has(c.id)) {
        candidateApplications.set(c.id, new Set());
      }
      if (!candidateApplications.get(c.id)!.has(job.id)) {
        candidate = c;
        break;
      }
    }
    
    if (!candidate) continue; // Skip if we couldn't find a unique candidate
    
    candidateApplications.get(candidate.id)!.add(job.id);

    const createdAt = randomDate(state.baseDate, new Date());
    
    const rand = Math.random();
    let status = "pending";
    if (rand > 0.98) status = "hired"; // 2%
    else if (rand > 0.90) status = "rejected"; // 8%
    else if (rand > 0.80) status = "shortlisted"; // 10%
    else if (rand > 0.55) status = "reviewing"; // 25%

    const candidateRes = state.candidateResumes[candidate.id] || [];
    const resumeId = candidateRes.length > 0 ? faker.helpers.arrayElement(candidateRes) : null;
    
    const companyEmployers = state.employers.filter(e => e.companyId === job.companyId);
    const reviewedBy = status !== "pending" ? (companyEmployers.length > 0 ? faker.helpers.arrayElement(companyEmployers).id : null) : null;

    appsData.push([
      uuidv4(),
      job.id,
      candidate.id,
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

    if (faker.datatype.boolean(0.2)) {
      const savedJob = faker.helpers.arrayElement(state.jobs);
      savedJobsData.push([candidate.id, savedJob.id, randomDate(state.baseDate, new Date())]);
    }

    if (faker.datatype.boolean(0.05)) {
      auditLogsData.push([
        uuidv4(),
        candidate.id,
        "application_submitted",
        "job",
        job.id,
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
  const mode = getMode();
  const config = SeedProfiles[mode];

  if (!config) {
    console.error(`❌ Invalid mode: ${mode}. Available modes: ${Object.keys(SeedProfiles).join(", ")}`);
    process.exit(1);
  }

  const baseDate = new Date();
  baseDate.setFullYear(baseDate.getFullYear() - 3);

  const state: SeedState = {
    skillIds: {},
    languageIds: [],
    companies: [],
    candidates: [],
    employers: [],
    jobs: [],
    candidateResumes: {},
    baseDate,
  };

  console.log(`🌱 Starting database seeding...`);
  console.log(`📦 Mode: ${mode.toUpperCase()}`);
  console.log(`- Candidates: ${config.candidates}`);
  console.log(`- Employers: ${config.employers}`);
  console.log(`- Companies: ${config.companies}`);
  console.log(`- Jobs: ${config.jobs}`);
  console.log(`- Applications: ${config.applications}\n`);

  const startTime = Date.now();

  try {
    const isRefOnly = process.argv.includes("--ref-only");

    console.log("Generating Skills & Languages...");
    await createSkillsAndLanguages(config, state);
    
    if (!isRefOnly) {
      console.log(`Generating ${config.companies} Companies...`);
      await createCompanies(config, state);
      console.log(`Generating ${config.candidates} Candidates and ${config.employers} Employers...`);
      await createUsers(config, state);
      console.log(`Generating ${config.jobs} Jobs...`);
      await createJobs(config, state);
      console.log(`Generating ${config.applications} Applications...`);
      await createApplications(config, state);
    }
    
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
