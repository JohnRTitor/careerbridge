import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Aurora from "@/components/react-bits/Aurora";
import DecryptedText from "@/components/react-bits/DecryptedText";
import FadeContent from "@/components/react-bits/FadeContent";

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <div className="relative overflow-hidden bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <Aurora 
            colorStops={['#3B82F6', '#8B5CF6', '#EC4899']} 
            speed={0.5} 
            amplitude={1.5} 
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            <DecryptedText text="Careers at CareerBridge" speed={70} maxIterations={15} />
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Help us build the future of hiring.
          </p>
        </div>
      </div>
      <FadeContent blur={true} duration={1000} ease="ease-out" initialOpacity={0}>
        <main className="flex-1 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
          <p className="text-muted-foreground mb-8">
            We are not actively hiring at the moment, but we are always looking for great talent. 
            Check back later or send us your resume.
          </p>
          <Link href="/contact" className={buttonVariants()}>Get in Touch</Link>
        </main>
      </FadeContent>
    </div>
  );
}
