"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyCard } from "@/features/companies/components/company-card";
import { useCompanies } from "@/features/companies/api/queries";
import { Skeleton } from "@/components/ui/skeleton";
import type { CompanyFilters } from "@/features/companies/api/types";

function CompaniesSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const filters: CompanyFilters = {
    query: searchParams.get("query") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
  };

  const { data, isLoading } = useCompanies(filters);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (query) params.set("query", query);
    else params.delete("query");
    
    params.set("page", "1");
    setPage(1);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setPage(newPage);
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#f8faff]">
      <div className="bg-primary px-4 py-12 sm:py-16 sm:px-6 lg:px-8 border-b border-primary/20">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Discover Great Workplaces
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto">
            Explore companies, read about their culture, and find your next dream team.
          </p>

          <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto mt-8">
            <div className="relative flex-1 flex items-center">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 size-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for companies by name or industry..." 
                className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 rounded-xl shrink-0">
              Search
            </Button>
          </form>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            {isLoading ? "Loading companies..." : (
              data?.pagination.total ? `${data.pagination.total} Companies` : "No companies found"
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-[200px] rounded-xl w-full" />
            ))}
          </div>
        ) : (
          <>
            {data && data.companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed rounded-2xl">
                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground mb-4">
                  <HugeiconsIcon icon={Search01Icon} className="size-8" />
                </div>
                <h3 className="text-xl font-semibold">No companies found</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  We couldn't find any companies matching your search. Try adjusting your query.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => {
                  setQuery("");
                  router.push(pathname);
                }}>
                  Clear Search
                </Button>
              </div>
            )}

            {data && data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <Button 
                  variant="outline" 
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
                    <Button 
                      key={i} 
                      variant={page === i + 1 ? "default" : "ghost"} 
                      size="icon"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  disabled={page === data.pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Skeleton className="size-12 rounded-full" /></div>}>
      <CompaniesSearchContent />
    </Suspense>
  );
}
