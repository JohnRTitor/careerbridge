// instant = false is required here because requirePagePermission is blocking.
// We must verify the user's role before rendering the application form to prevent
// unauthorized access or flickering of authorized content.
export const instant = false;
import { notFound } from "next/navigation";
import { getJobByIdCached } from "@/features/jobs/api/server-cached";
import { JobApplicationForm } from "@/features/applications/components/job-application-form";
import type { Job } from "@/features/jobs/api/types";
import { requirePagePermission } from "@server/auth/utils";

export default async function JobApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePagePermission("application", "create");
  const { id } = await params;
  let job: Job | null = null;
  
  try {
    job = (await getJobByIdCached({ jobId: id })) as unknown as Job;
  } catch (err) {
    return notFound();
  }

  if (!job) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <div className="bg-background border-b border-border py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Apply for {job.title}
          </h1>
          <p className="text-muted-foreground mt-2">
            at {job.company_name}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <JobApplicationForm 
          jobId={job.id} 
          jobTitle={job.title} 
          companyName={job.company_name || "the company"} 
        />
      </div>
    </div>
  );
}
