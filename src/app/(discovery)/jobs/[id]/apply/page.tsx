import { notFound } from "next/navigation";
import { jobsService } from "@server/features/jobs/jobs.service";
import { JobApplicationForm } from "@/features/applications/components/job-application-form";
import { requirePagePermission } from "@server/auth/utils";

export default async function ApplyForJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePagePermission("application", "create");
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let job = null;
  try {
    job = await jobsService.getJobById({ jobId: id });
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
