export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            About CareerBridge
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Connecting top talent with the world's most innovative companies.
          </p>
        </div>
      </div>
      <main className="flex-1 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 prose prose-slate">
        <h2>Our Mission</h2>
        <p>
          At CareerBridge, we believe that finding the right job or the perfect candidate shouldn't be a tedious process. Our mission is to bridge the gap between talented professionals and forward-thinking employers through a seamless, intuitive, and modern platform.
        </p>
        <h2>What We Do</h2>
        <p>
          We provide a comprehensive ecosystem for career development and talent acquisition. For job seekers, we offer tools to build standout profiles, discover matching opportunities, and track applications effortlessly. For employers, we deliver a streamlined pipeline to post jobs, review candidates, and manage the hiring lifecycle.
        </p>
        <h2>Our Values</h2>
        <ul>
          <li><strong>Transparency:</strong> Clear communication in every interaction.</li>
          <li><strong>Innovation:</strong> Constantly evolving our platform to serve you better.</li>
          <li><strong>Community:</strong> Building a network of professionals who support each other.</li>
        </ul>
      </main>
    </div>
  );
}
