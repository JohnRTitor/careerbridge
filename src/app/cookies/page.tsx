export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Information about how we use cookies and similar technologies.
          </p>
        </div>
      </div>
      <main className="flex-1 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 prose prose-slate">
        <h2>What are cookies?</h2>
        <p>Cookies are simple text files that are stored on your computer or mobile device by a website's server. Each cookie is unique to your web browser. It will contain some anonymous information such as a unique identifier, website's domain name, and some digits and numbers.</p>
        <h2>What types of cookies do we use?</h2>
        <h3>Necessary cookies</h3>
        <p>Necessary cookies allow us to offer you the best possible experience when accessing and navigating through our website and using its features. For example, these cookies let us recognize that you have created an account and have logged into that account.</p>
        <h3>Functionality cookies</h3>
        <p>Functionality cookies let us operate the site in accordance with the choices you make. For example, we will recognize your username and remember how you customized the site during future visits.</p>
        <h3>Analytical cookies</h3>
        <p>These cookies enable us and third-party services to collect aggregated data for statistical purposes on how our visitors use the website. These cookies do not contain personal information such as names and email addresses and are used to help us improve your user experience of the website.</p>
      </main>
    </div>
  );
}
