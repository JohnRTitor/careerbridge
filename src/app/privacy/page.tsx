export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            How we collect, use, and protect your data.
          </p>
        </div>
      </div>
      <main className="flex-1 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 prose prose-slate">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We may use the information we collect about you to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.</p>
        <h2>3. Sharing of Information</h2>
        <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing.</p>
      </main>
    </div>
  );
}
