export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Rules and guidelines for using CareerBridge.
          </p>
        </div>
      </div>
      <main className="flex-1 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 prose prose-slate">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on CareerBridge's website for personal, non-commercial transitory viewing only.</p>
        <h2>3. Disclaimer</h2>
        <p>The materials on CareerBridge's website are provided on an 'as is' basis. CareerBridge makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </main>
    </div>
  );
}
