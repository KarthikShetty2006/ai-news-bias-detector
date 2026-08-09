import { NavLink } from "react-router-dom";
import { Newspaper } from "lucide-react";
import Container from "./Container";
import Button from "../ui/Button";

const navItems = [
  {
    label: "All News",
    path: "/news",
  },
  {
    label: "Analyzed",
    path: "/analyzed",
  },
  {
    label: "Analyze",
    path: "/analyze",
  },
  {
    label: "Dashboard",
    path: "/dashboard",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-8">

          {/* Logo */}
          <NavLink
            to="/news"
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--button-gradient)] shadow-sm">
              <Newspaper
                size={20}
                strokeWidth={2}
                className="text-white"
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-base font-semibold leading-tight text-slate-900">
                AI News Bias Detector
              </h1>

              <p className="mt-0.5 text-xs text-slate-500">
                Understand news with AI
              </p>
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "relative py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-950",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Login */}
          <Button
            className="h-11 min-w-[108px] shrink-0 px-6"
          >
            Login
          </Button>
        </div>
      </Container>
    </header>
  );
}