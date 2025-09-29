import {
  Wrench,
  ClipboardCheck,
  Bell,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      name: "Preventive Maintenance",
      description:
        "Define service intervals by mileage, engine hours, or dates and auto-schedule work before failures happen.",
      icon: Wrench,
      bullets: ["Custom intervals per vehicle type", "Parts & labor cost capture"],
    },
    {
      name: "Driver Inspections",
      description:
        "Mobile daily checklists that work offline. Submit defects with photos in under a minute.",
      icon: ClipboardCheck,
      bullets: ["Works on any device", "Clear pass/fail history"],
    },
    {
      name: "Real-Time Alerts",
      description:
        "Instant notifications when a service is due, a defect is logged, or inventory runs low.",
      icon: Bell,
      bullets: ["Email & in-app summaries", "Role-based recipients"],
    },
    {
      name: "Analytics & Reports",
      description:
        "Track downtime, cost per km/hour, and technician productivity to drive smarter decisions.",
      icon: BarChart3,
      bullets: ["Export to CSV", "Executive dashboards"],
    },
  ];

  return (
   <section id="features" className="scroll-mt-24 bg-slate-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2
            id="features-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"
          >
            Everything you need to run a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              healthy fleet
            </span>
          </h2>
          <p className="mt-4 text-slate-600">
            Servix brings maintenance scheduling, inspections, alerts, and reporting
            together in one streamlined platform.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ name, description, icon: Icon, bullets }) => (
            <article
              key={name}
              className="reveal group relative rounded-2xl border border-slate-200 bg-white p-6
                         shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1
                         focus-within:ring-4 ring-blue-200"
            >
              {/* Icon badge */}
              <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition group-hover:bg-blue-600 group-hover:text-white">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>

              <ul className="mt-4 space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-[2px] h-4 w-4 text-blue-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Focus outline target */}
              <span className="absolute inset-0 rounded-2xl ring-0 focus:outline-none" />
            </article>
          ))}
        </div>

        {/* CTA under grid */}
        <div className="mt-12 text-center">
          <a
            href="#learn-more"
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-blue-700
                       ring-1 ring-inset ring-blue-200 hover:bg-blue-50
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Explore all features
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
