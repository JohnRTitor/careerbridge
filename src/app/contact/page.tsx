import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Please fill out this form or get in touch.
          </p>
        </div>
      </div>
      <main className="flex-1 mx-auto max-w-2xl w-full px-4 py-16 sm:px-6 lg:px-8">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea placeholder="How can we help you?" rows={6} />
          </div>
          <Button type="button" className="w-full">Send Message</Button>
        </form>
      </main>
    </div>
  );
}
