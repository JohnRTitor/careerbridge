import { Suspense } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import SplitText from "@/components/SplitText";
import DecryptedText from "@/components/DecryptedText";
import FadeContent from "@/components/FadeContent";
import { CompanyCard } from "@/features/companies/components/company-card";
import type { CompanyFilters } from "@/features/companies/api/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from "@/lib/utils";
import { companiesService } from "../../../../server/features/companies/companies.service";
import { CompaniesSearchForm } from "@/features/companies/components/companies-search-form";
import type { Company } from "@/features/companies/api/types";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const filters: CompanyFilters = {
    query: typeof resolvedParams.query === "string" ? resolvedParams.query : undefined,
    page: typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: 12,
  };

  let data = null;
  try {
    data = await companiesService.listCompanies(filters);
  } catch (err) {
    console.error("Failed to fetch companies", err);
  }

  const page = filters.page || 1;

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
    params.set("page", newPage.toString());
    return `/companies?${params.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <div className="bg-primary px-4 py-12 sm:py-16 sm:px-6 lg:px-8 border-b border-primary/20">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <SplitText
            text="Discover Great Workplaces"
            className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
            delay={40}
            from={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
            to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          />
          <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto">
            Explore companies, read about their culture, and find your next dream team.
          </p>

          <CompaniesSearchForm />
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            {data?.pagination.total ? `${data.pagination.total} Companies` : "No companies found"}
          </h2>
        </div>

        {data && data.companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.companies.map((company: Company, index: number) => (
              <FadeContent key={company.id} delay={index * 100} blur duration={800} ease="power3.out" className="h-full">
                <CompanyCard company={company} />
              </FadeContent>
            ))}
          </div>
        ) : (
          <Empty className="bg-background border-dashed rounded-2xl p-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Search01Icon} className="size-8" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">
                <DecryptedText text="No companies found" speed={60} maxIterations={15} animateOn="view" />
              </EmptyTitle>
              <EmptyDescription className="max-w-sm mt-2">
                We couldn&apos;t find any companies matching your search. Try adjusting your query.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" className="mt-4" render={<Link href="/companies">Clear Search</Link>} nativeButton={false} />
            </EmptyContent>
          </Empty>
        )}

        {data && data.pagination.totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href={page > 1 ? createPageUrl(page - 1) : "#"}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {generatePagination(page, data.pagination.totalPages).map((p, i) => (
                <PaginationItem key={i}>
                  {p === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink 
                      href={createPageUrl(p as number)}
                      isActive={page === p}
                    >
                      {p}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  href={page < data.pagination.totalPages ? createPageUrl(page + 1) : "#"}
                  className={page === data.pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
