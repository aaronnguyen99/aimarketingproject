import React from "react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "7-day free trial included",
    features: [
      "10 AI prompts per month",
      "Basic visibility tracking",
      "Access to dashboard",
    ],
    cta: "Start Free Trial",
    bg: "bg-gray-100",
  },
  {
    name: "Pro",
    price: "$49/mo",
    description: "For small schools & departments",
    features: [
      "20 AI prompts",
      "Advanced visibility analytics",
      "Export reports",
      "Priority support",
    ],
    cta: "Get Pro",
    bg: "bg-sky-50",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for institutions & universities",
    features: [
      "Dedicated account manager",
      "Custom AI models",
      "Full API access",
      "Personalized onboarding",
    ],
    cta: "Request a Demo",
    bg: "bg-white",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 min-h-screen py-16 px-6 scroll-mt-16 px-5">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-gray-700 text-lg">
          Flexible pricing for schools and universities. Start with a free trial
          and scale up as needed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-lg shadow-md p-6 flex flex-col justify-between ${tier.bg}`}
          >
            <div>
              <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
              <p className="text-gray-600 mb-4">{tier.description}</p>
              <p className="text-3xl font-bold mb-6">{tier.price}</p>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-green-500 mr-2">✔</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {tier.name === "Enterprise" ? (
                <a
                  href="mailto:youremail@domain.com?subject=Request Enterprise Demo"
                  className="w-full block text-center px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
                >
                  {tier.cta}
                </a>
              ) : (
                <a
                  href="/dashboard"
                  className="w-full block text-center px-4 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition"
                >
                  {tier.cta}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}