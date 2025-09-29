import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, ok: false, error: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Please enter a valid email address.";
    if (!values.message.trim() || values.message.trim().length < 10)
      next.message = "Message should be at least 10 characters.";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setStatus({ loading: true, ok: false, error: "" });
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 800));
      setStatus({ loading: false, ok: true, error: "" });
      setValues({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus({ loading: false, ok: false, error: "Something went wrong. Please try again." });
    }
  };

  return (
  <section id="contact" className="scroll-mt-24 bg-slate-50 py-24">
      {/* Decorative gradient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-10 -z-10 overflow-hidden blur-3xl">
        <div
          className="mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-[#93c5fd] to-[#a78bfa] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header (badge removed for cleaner look) */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Let’s talk about your fleet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Questions, demos, or custom needs—send us a message and our team will get back to you shortly.
          </p>
        </div>

        {/* Info + form */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Info panel */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Get in touch</h3>
            <p className="mt-2 text-sm text-slate-600">Reach out through the form or use the details below.</p>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Email</p>
                  <a className="text-slate-600 hover:text-blue-600" href="mailto:support@servix.app">
                    support@servix.app
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Phone</p>
                  <a className="text-slate-600 hover:text-blue-600" href="tel:+10000000000">
                    +1 (000) 000-0000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Office</p>
                  <p className="text-slate-600">Beirut, Lebanon</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">Hours</p>
                  <p className="text-slate-600">Mon–Fri, 9:00–18:00</p>
                </div>
              </li>
            </ul>
          </aside>

          {/* Form */}
          <div className="lg:col-span-2">
            {status.ok && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-800 ring-1 ring-inset ring-green-200">
                <CheckCircle2 className="h-5 w-5" />
                <p>Your message has been sent. We’ll get back to you soon.</p>
              </div>
            )}
            {status.error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-800 ring-1 ring-inset ring-red-200">
                <AlertCircle className="h-5 w-5" />
                <p>{status.error}</p>
              </div>
            )}

            <form
              noValidate
              onSubmit={onSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={onChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`mt-2 block w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-300 ring-1 ring-red-200" : "border-slate-300"
                    }`}
                    placeholder="Jane Doe"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={onChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`mt-2 block w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-300 ring-1 ring-red-200" : "border-slate-300"
                    }`}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-slate-900">
                    Company (optional)
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={values.company}
                    onChange={onChange}
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Servix LLC"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-900">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={onChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`mt-2 block w-full resize-y rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.message ? "border-red-300 ring-1 ring-red-200" : "border-slate-300"
                    }`}
                    placeholder="Tell us about your fleet and what you’d like to achieve."
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={status.loading}
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    status.loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {status.loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" d="M4 12a8 8 0 018-8v4" stroke="currentColor" strokeWidth="4" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
