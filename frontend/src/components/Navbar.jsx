import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo_transparent.png";
import { Home, Star, DollarSign, Mail, LogIn, Menu, X } from "lucide-react";
import SignupModal from "../pages/signUpModal";
import LoginModal from "../pages/LoginModal";

export default function Navbar() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // modal states
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupPlan, setSignupPlan] = useState("starter");

  // helpers to open the right modal (and close the other)
  const openLogin = () => {
    setSignupOpen(false);
    setLoginOpen(true);
  };
  const openSignup = (plan = "starter") => {
    setLoginOpen(false);
    setSignupPlan(plan);
    setSignupOpen(true);
  };

  const navLinks = [
    { name: "Home", href: "#home", icon: Home, id: "home" },
    { name: "Features", href: "#features", icon: Star, id: "features" },
    { name: "Pricing", href: "#pricing", icon: DollarSign, id: "pricing" },
    { name: "Contact", href: "#contact", icon: Mail, id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      let current = "home";
      navLinks.forEach((link) => {
        const section = document.querySelector(link.href);
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) current = link.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-open signup when redirected with ?showSignup=1
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    if (sp.get("showSignup") === "1") {
      openSignup("starter");
      // clean the query (optional)
      window.history.replaceState({}, "", location.pathname);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  const signupBtnClass = isScrolled
    ? "inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors"
    : "inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 text-white font-medium ring-1 ring-white/30 hover:bg-white/20 transition-colors";

  const loginBtnClass = isScrolled
    ? "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors"
    : "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-medium ring-1 ring-white/30 hover:bg-white/20 transition-colors";

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3">
              <img src={logo} alt="Servix Logo" className="w-24 h-auto object-contain" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                const linkColor = isScrolled
                  ? isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                  : isActive
                  ? "text-white"
                  : "text-white/90 hover:text-white";
                const underlineColor = isScrolled ? "bg-blue-600" : "bg-white/90";

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative group text-[15px] font-medium ${linkColor}`}
                  >
                    <link.icon className="h-4 w-4 md:hidden inline-block mr-2" />
                    {link.name}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300 ${underlineColor} ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={openLogin} className={loginBtnClass}>
                <LogIn className="h-5 w-5" />
                Log in
              </button>
              <button onClick={() => openSignup("starter")} className={signupBtnClass}>
                Sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                isScrolled ? "text-slate-700 hover:bg-slate-200" : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-slate-100">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 transition-colors ${
                    activeSection === link.id ? "text-blue-600 font-medium" : "text-slate-700 hover:text-blue-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </a>
              ))}

              <button
                onClick={() => {
                  setIsOpen(false);
                  openLogin();
                }}
                className="flex items-center gap-2 justify-center rounded-lg bg-slate-100 text-slate-800 py-2 hover:bg-slate-200 transition-colors w-full"
              >
                <LogIn className="h-5 w-5" />
                Log in
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  openSignup("starter");
                }}
                className="flex items-center gap-2 justify-center rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors w-full"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Modals rendered once with switch callbacks */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={(plan) => openSignup(plan || "starter")}
      />
      <SignupModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        defaultPlan={signupPlan}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}
