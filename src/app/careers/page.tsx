import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Careers at CareerBridge
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Help us build the future of hiring.
          </p>
        </div>
      </div>
      <main className="flex-1 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
        <p className="text-muted-foreground mb-8">
          We are not actively hiring at the moment, but we are always looking for great talent. 
          Check back later or send us your resume.
        </p>
        <Button asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </main>
    </div>
  );
}
