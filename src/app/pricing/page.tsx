"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small teams and startups just getting started.",
    features: [
      "Up to 3 active job postings",
      "Basic candidate filtering",
      "Standard support",
      "Company profile",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    description: "Ideal for growing companies with regular hiring needs.",
    features: [
      "Unlimited job postings",
      "Advanced candidate matching",
      "Priority email support",
      "Featured company profile",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations needing custom workflows and dedicated support.",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom API integrations",
      "SLA guarantee",
      "Custom contract terms",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#f8faff]">
      <div className="bg-primary px-4 py-16 sm:py-24 sm:px-6 lg:px-8 border-b border-primary/20">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Find the perfect plan for your team's hiring needs. No hidden fees.
          </p>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 -mt-12">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`flex flex-col relative bg-white ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-border shadow-md'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="pt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="my-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/register">
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
