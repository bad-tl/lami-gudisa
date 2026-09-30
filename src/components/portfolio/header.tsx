
"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

const navigation = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Skills", href: "#skills" },
  { name: "Gallery", href: "#gallery" },
  { name: "Certificates", href: "#certificates" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/70 bg-[#f7f7f4]/85 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-[#07111a]/85"
          : "bg-transparent"
      }`}
    >
      <div className="container-portfolio">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={closeMenu}
            className="group relative z-50 flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-slate-900 transition-colors dark:text-white"
          >
            <span>LAMI GUDISA</span>

            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-emerald-600 transition-transform duration-300 group-hover:scale-150 dark:bg-emerald-400"
            />
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 xl:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative py-2 text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                {item.name}

                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 mx-auto h-px w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full dark:bg-emerald-400"
                />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 xl:flex">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-950/40 dark:hover:text-white"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <a
              href="#contact"
              className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-900/10 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
            >
              Contact
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="relative z-50 flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-600 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-950/40 dark:hover:text-white"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={
                isMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={isMenuOpen}
              className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-900 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:hover:border-emerald-400/40 dark:hover:bg-emerald-950/40"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-x-0 top-0 -z-10 bg-[#f7f7f4]/98 backdrop-blur-2xl transition-all duration-300 dark:bg-[#07111a]/98 xl:hidden ${
          isMenuOpen
            ? "pointer-events-auto min-h-screen opacity-100"
            : "pointer-events-none h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="container-portfolio flex min-h-screen flex-col pt-28">
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col"
          >
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-slate-200/80 py-4 text-xl font-semibold text-slate-900 transition-all duration-300 hover:pl-2 hover:text-emerald-700 dark:border-slate-700/70 dark:text-white dark:hover:text-emerald-400 sm:py-5 sm:text-2xl"
                style={{
                  transitionDelay: isMenuOpen
                    ? `${index * 35}ms`
                    : "0ms",
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={closeMenu}
            className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-900/10 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            Contact Me
          </a>
        </div>
      </div>
    </header>
  );
}

