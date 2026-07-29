import { faker } from "@faker-js/faker";
import { randomUUID as uuidv4 } from "node:crypto";
import { randomDate } from "./seed-utils";

// --- Types ---
export type IndustryData = {
  name: string;
  roles: string[];
  skills: string[];
  degrees: string[];
};

export type LocationData = {
  city: string;
  state: string;
  country: string;
};

// --- Dictionaries ---
export const INDUSTRIES: IndustryData[] = [
  {
    name: "Technology",
    roles: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Product Manager", "UX Designer"],
    skills: ["Rust", "Go", "TypeScript", "Java", "Kotlin", "Python", "C#", "C++", "Swift", "React", "Next.js", "Vue", "Angular", "Tailwind", "Svelte", "Hono", "Express", "NestJS", "Spring", "Django", "FastAPI", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "PyTorch", "TensorFlow", "LLM", "LangChain", "Vector Databases", "RAG", "Figma", "UI/UX", "Product Management", "Agile", "Scrum"],
    degrees: ["Computer Science", "Software Engineering", "Information Technology", "Mathematics", "Human-Computer Interaction"]
  },
  {
    name: "Healthcare",
    roles: ["Registered Nurse", "Medical Assistant", "Health Informatics Specialist", "Clinical Researcher", "Healthcare Administrator"],
    skills: ["HIPAA", "Nursing", "Medical Assistant", "Patient Care", "EHR/EMR Software", "Clinical Research", "Healthcare Administration"],
    degrees: ["Nursing", "Medicine", "Public Health", "Health Administration", "Biology"]
  },
  {
    name: "Fintech",
    roles: ["Financial Analyst", "Quantitative Analyst", "Blockchain Developer", "Risk Manager", "Compliance Officer"],
    skills: ["Payments", "Banking", "PCI DSS", "Financial Analysis", "Risk Management", "Blockchain", "Solidity", "Smart Contracts", "Compliance", "Python", "C++", "Data Analysis"],
    degrees: ["Finance", "Economics", "Mathematics", "Computer Science", "Business Administration"]
  },
  {
    name: "E-commerce",
    roles: ["E-commerce Manager", "Digital Marketer", "Supply Chain Analyst", "SEO Specialist", "Merchandiser"],
    skills: ["SEO", "Digital Marketing", "Supply Chain Management", "Merchandising", "Google Analytics", "Conversion Rate Optimization"],
    degrees: ["Marketing", "Business Administration", "Supply Chain Management", "Retail Management"]
  },
  {
    name: "Education",
    roles: ["Instructional Designer", "EdTech Product Manager", "Curriculum Developer", "Online Educator", "Academic Counselor"],
    skills: ["Instructional Design", "Curriculum Development", "E-Learning", "LMS", "Educational Technology", "Teaching", "Counseling"],
    degrees: ["Education", "Instructional Design", "Psychology", "Educational Leadership"]
  },
  {
    name: "Manufacturing",
    roles: ["Mechanical Engineer", "Quality Assurance Manager", "Production Supervisor", "Logistics Coordinator", "Industrial Engineer"],
    skills: ["Mechanical Engineering", "Quality Assurance", "Logistics", "Six Sigma", "Lean Manufacturing", "AutoCAD", "Supply Chain Management"],
    degrees: ["Mechanical Engineering", "Industrial Engineering", "Operations Management", "Supply Chain Management"]
  },
  {
    name: "Gaming",
    roles: ["Game Developer", "3D Artist", "Game Designer", "Level Designer", "Animation Specialist"],
    skills: ["Unity", "Unreal Engine", "C++", "C#", "3D Modeling", "Animation", "Game Design", "Level Design", "Blender", "Maya"],
    degrees: ["Computer Science", "Game Design", "Digital Arts", "Animation", "Software Engineering"]
  },
  {
    name: "Cybersecurity",
    roles: ["Security Analyst", "Penetration Tester", "Security Engineer", "CISO", "Incident Responder"],
    skills: ["Cybersecurity", "Penetration Testing", "Network Security", "Cryptography", "Incident Response", "SIEM", "Risk Assessment"],
    degrees: ["Cybersecurity", "Computer Science", "Information Security", "Network Engineering"]
  }
];

// --- Distributions ---

// 60% 0–5 YOE, 25% 5–10, 10% 10–20, 5% 20+
export const YOE_DISTRIBUTION = [
  { weight: 60, min: 0, max: 5 },
  { weight: 25, min: 6, max: 10 },
  { weight: 10, min: 11, max: 20 },
  { weight: 5, min: 21, max: 40 }
];

export const COMPANY_SIZE_DISTRIBUTION = [
  { weight: 40, size: "1-10", jobsMultiplier: 1, isEnterprise: false },
  { weight: 30, size: "11-50", jobsMultiplier: 3, isEnterprise: false },
  { weight: 15, size: "51-200", jobsMultiplier: 8, isEnterprise: false },
  { weight: 10, size: "201-500", jobsMultiplier: 15, isEnterprise: false },
  { weight: 4, size: "500+", jobsMultiplier: 30, isEnterprise: true },
  { weight: 1, size: "1000+", jobsMultiplier: 100, isEnterprise: true }
];

export function getWeightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = faker.number.int({ min: 1, max: totalWeight });
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return items[items.length - 1];
}

// Global Location Cache
const locationsCache: LocationData[] = [];
export function getRandomLocation(): LocationData {
  // Generate a pool of 200 random global locations to increase overlap between jobs and candidates
  if (locationsCache.length < 200) {
    const loc = {
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country()
    };
    locationsCache.push(loc);
    return loc;
  }
  return faker.helpers.arrayElement(locationsCache);
}

// --- Generators ---

export function generateUserIdentity(isCandidate: boolean) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.username({ firstName, lastName }).toLowerCase().replace(/[^a-z0-9_]/g, '');
  
  const provider = isCandidate ? faker.helpers.arrayElement(['gmail.com', 'outlook.com', 'yahoo.com']) : 'workmail.com';
  const email = `${username}${faker.string.numeric(2)}@${provider}`;
  
  return {
    firstName,
    lastName,
    username,
    email,
    linkedin: `https://linkedin.com/in/${username}`,
    github: `https://github.com/${username}`,
    portfolio: `https://${username}.dev`,
    avatarUrl: faker.image.personPortrait()
  };
}

export function generateCompanyContext() {
  const industry = faker.helpers.arrayElement(INDUSTRIES);
  const sizeCategory = getWeightedRandom(COMPANY_SIZE_DISTRIBUTION);
  const categories = ["business", "office", "technology", "startup", "meeting", "building"];
  const imageCategory = faker.helpers.arrayElement(categories);
  
  const logoUrl = faker.image.urlLoremFlickr({ width: 200, height: 200, category: imageCategory });
  
  return {
    industry,
    sizeCategory,
    logoUrl
  };
}

export function generateJobContext(industryName: string) {
  const industry = INDUSTRIES.find(i => i.name === industryName) || INDUSTRIES[0];
  const role = faker.helpers.arrayElement(industry.roles);
  
  const summary = `We are looking for a skilled ${role} to join our team. You will be working on exciting projects in the ${industry.name} space.`;
  const responsibilities = [
    faker.company.catchPhrase(),
    faker.company.catchPhrase(),
    faker.company.catchPhrase()
  ].map(r => `- ${r}`).join("\n");
  
  const reqs = faker.helpers.arrayElements(industry.skills, faker.number.int({ min: 2, max: 5 }));
  const requirements = reqs.map(r => `- Experience with ${r}`).join("\n");
  
  const nice = faker.helpers.arrayElements(industry.skills, faker.number.int({ min: 1, max: 3 }));
  const niceToHave = nice.map(r => `- Knowledge of ${r}`).join("\n");
  
  const benefitsList = ["Competitive salary", "Health insurance", "Remote work options", "Flexible hours", "Professional development budget"];
  const benefits = faker.helpers.arrayElements(benefitsList, faker.number.int({ min: 3, max: 5 })).map(b => `- ${b}`).join("\n");
  
  const description = `${summary}\n\n**Responsibilities:**\n${responsibilities}\n\n**Requirements:**\n${requirements}\n\n**Nice to Have:**\n${niceToHave}\n\n**Benefits:**\n${benefits}`;
  
  return {
    role,
    description,
    skills: reqs
  };
}

export function generateCareerTimeline(userId: string, yoe: number, industry: IndustryData, baseDate: Date, createdAt: Date) {
  const educationData: unknown[][] = [];
  const experienceData: unknown[][] = [];
  
  const age = 22 + yoe + faker.number.int({ min: 0, max: 5 });
  const dob = new Date(baseDate);
  dob.setFullYear(dob.getFullYear() - age);
  
  // Education
  const gradYear = baseDate.getFullYear() - yoe;
  const startEduDate = new Date(gradYear - 4, 8, 1); // September
  const endEduDate = new Date(gradYear, 5, 15); // June
  
  educationData.push([
    uuidv4(), userId, faker.company.name() + " University", "Bachelor's",
    faker.helpers.arrayElement(industry.degrees), startEduDate, endEduDate, null, createdAt, createdAt
  ]);
  
  if (faker.datatype.boolean(0.2) && yoe > 2) {
    // Master's
    const startMsc = new Date(gradYear, 8, 1);
    const endMsc = new Date(gradYear + 2, 5, 15);
    educationData.push([
      uuidv4(), userId, faker.company.name() + " Institute", "Master's",
      faker.helpers.arrayElement(industry.degrees), startMsc, endMsc, null, createdAt, createdAt
    ]);
  }
  
  // Experience Timeline
  let currentStart = new Date(endEduDate);
  currentStart.setMonth(currentStart.getMonth() + 1); // Start working a month after grad
  
  const progression = ["Intern", "Junior " + faker.helpers.arrayElement(industry.roles), faker.helpers.arrayElement(industry.roles), "Senior " + faker.helpers.arrayElement(industry.roles), "Lead " + faker.helpers.arrayElement(industry.roles)];
  
  let remainingYoe = yoe;
  let roleIndex = 0;
  
  if (yoe > 0) {
    // Determine how many jobs based on YOE
    let numJobs = 1;
    if (yoe > 2) numJobs = 2;
    if (yoe > 5) numJobs = faker.number.int({ min: 2, max: 4 });
    if (yoe > 10) numJobs = faker.number.int({ min: 3, max: 6 });
    
    // Calculate average duration per job in months
    const avgDurationMonths = Math.floor((yoe * 12) / numJobs);
    
    for (let i = 0; i < numJobs; i++) {
      if (currentStart >= baseDate) break;
      
      const duration = (i === numJobs - 1) ? remainingYoe * 12 : faker.number.int({ min: avgDurationMonths * 0.7, max: avgDurationMonths * 1.3 });
      remainingYoe -= (duration / 12);
      
      let endExpDate = new Date(currentStart);
      endExpDate.setMonth(endExpDate.getMonth() + duration);
      
      if (endExpDate > baseDate) endExpDate = new Date(baseDate); // cap at current date
      
      // Determine title based on how long they've worked in total (yoe - remainingYoe)
      const experienceSoFar = yoe - Math.max(0, remainingYoe);
      if (experienceSoFar <= 1) roleIndex = 0;
      else if (experienceSoFar <= 3) roleIndex = 1;
      else if (experienceSoFar <= 7) roleIndex = 2;
      else if (experienceSoFar <= 12) roleIndex = 3;
      else roleIndex = 4;
      
      const title = progression[roleIndex];
      const isCurrentJob = (i === numJobs - 1);
      
      experienceData.push([
        uuidv4(), userId, title, faker.company.name(), faker.location.city(),
        new Date(currentStart), isCurrentJob ? null : new Date(endExpDate), 
        `- Developed features for ${faker.commerce.productName()}\n- Collaborated with cross-functional teams\n- Used ${faker.helpers.arrayElement(industry.skills)}`, 
        createdAt, createdAt
      ]);
      
      // Advance currentStart for next job
      currentStart = new Date(endExpDate);
      currentStart.setMonth(currentStart.getMonth() + faker.number.int({ min: 0, max: 2 })); // Gap between jobs
    }
  }

  return { educationData, experienceData, dob, title: yoe > 0 ? progression[roleIndex] : "Student / Recent Graduate" };
}

export function calculateSalary(yoe: number, location: string, isEnterprise: boolean) {
  // Base salary logic
  let base = 50000;
  if (yoe > 2) base = 70000;
  if (yoe > 5) base = 100000;
  if (yoe > 10) base = 140000;
  if (yoe > 15) base = 180000;
  
  if (isEnterprise) base *= 1.2;
  
  // Random variance
  const expected = Math.floor(base * faker.number.float({ min: 0.9, max: 1.2 }) / 1000) * 1000;
  const current = Math.floor(expected * faker.number.float({ min: 0.8, max: 0.95 }) / 1000) * 1000;
  
  const jobMin = Math.floor(base * 0.9 / 1000) * 1000;
  const jobMax = Math.floor(base * 1.3 / 1000) * 1000;
  
  return { expected, current, jobMin, jobMax };
}
