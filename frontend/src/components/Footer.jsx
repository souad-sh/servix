import logo from "../assets/logo_transparent.png";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Instagram,   // ⬅️ add this
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const productLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  const companyLinks = [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Status", href: "#" },
    { name: "Support", href: "#contact" },
  ];

 const social = [
  { name: "Twitter", href: "#", Icon: Twitter },
  { name: "Instagram", href: "#", Icon: Instagram }, // ⬅️ new
  { name: "LinkedIn", href: "#", Icon: Linkedin },
  { name: "GitHub", href: "#", Icon: Github },
];

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      role="contentinfo"
      className="
        relative mt-12
        bg-gradient-to-b from-[#f7fbff] via-[#eef4ff] to-white
        text-slate-600
        border-t border-slate-200
      "
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#home" className="inline-flex items-center gap-3">
              <img src={logo} alt="Servix" className="h-9 w-auto object-contain" />
              <span className="sr-only">Servix</span>
            </a>
            <p className="mt-4 max-w-md text-sm text-slate-700">
              Smart fleet maintenance &amp; inspection software for modern
              operators. Reduce downtime, control costs, and keep vehicles safe.
            </p>

            {/* Social */}
            <ul className="mt-6 flex items-center gap-4" aria-label="Social links">
              {social.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    aria-label={name}
                    className="
                      inline-flex h-9 w-9 items-center justify-center rounded-md
                      bg-white text-slate-600 ring-1 ring-slate-200
                      hover:text-blue-600 hover:ring-blue-200 transition
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product links */}
          <nav aria-label="Product">
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {productLinks.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    className="text-slate-600 hover:text-blue-700 transition"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company + Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {companyLinks.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    className="text-slate-600 hover:text-blue-700 transition"
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-sm font-semibold text-slate-900">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-blue-600" />
                <a
                  href="mailto:support@servix.app"
                  className="hover:text-blue-700 transition"
                >
                  support@servix.app
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-blue-600" />
                <a href="tel:+10000000000" className="hover:text-blue-700 transition">
                  +1 (000) 000-0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-600" />
                <span>Beirut, Lebanon</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & bottom bar */}
        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
          <p className="text-xs text-slate-500">© {year} Servix. All rights reserved.</p>

          <div className="flex items-center gap-6 text-xs">
            <a href="#" className="text-slate-500 hover:text-blue-700 transition">
              Privacy
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-700 transition">
              Terms
            </a>

            <button
              onClick={scrollTop}
              className="
                inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5
                text-slate-700 ring-1 ring-slate-200
                hover:ring-blue-200 hover:text-blue-700 transition
              "
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
