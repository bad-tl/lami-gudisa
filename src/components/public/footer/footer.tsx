import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

import {
  SiFacebook,
  SiTelegram,
  SiInstagram,
} from "react-icons/si";

import { FaLinkedinIn } from "react-icons/fa";

type FooterProps = {
  data: {
    contact: {
      email: string;
      phone: string;
      location: string;
      availability: string;
      description: string;
    } | null;
    social: {
      facebook: string;
      telegram: string;
      instagram: string;
      linkedin: string;
    };
  };
};

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "Skills", href: "/#skills" },
  { label: "Gallery", href: "/gallery" },
  { label: "Certificates", href: "/certificates" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer({ data }: FooterProps) {
  const contact = data.contact;

  const socials = [
    {
      name: "Facebook",
      url: data.social.facebook,
      icon: SiFacebook,
    },
    {
      name: "Telegram",
      url: data.social.telegram,
      icon: SiTelegram,
    },
    {
      name: "Instagram",
      url: data.social.instagram,
      icon: SiInstagram,
    },
    {
      name: "LinkedIn",
      url: data.social.linkedin,
      icon: FaLinkedinIn,
    },
  ].filter((social) => social.url);

  return (
    <footer className="relative overflow-hidden bg-[#0B0F0E] text-[#F5F3ED]">
      {/* Subtle emerald atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(700px,100%)] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <div className="flex flex-col items-center pt-16 text-center sm:pt-20">
          <p className="font-serif text-4xl font-medium tracking-[0.04em] sm:text-2xl lg:text-3xl">
            LAMI GUDISA
          </p>

          <p className="mt-3 text-xs font-medium tracking-[0.12em] text-white/60 sm:text-sm sm:tracking-[0.16em]">
            Accountant &amp; Controller Officer
          </p>

          <span
            aria-hidden="true"
            className="mt-6 h-px w-16 bg-emerald-400"
          />
        </div>

        {/* Quick links */}
        <nav
          aria-label="Footer navigation"
          className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:gap-x-7 lg:gap-x-9"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-white/65 transition-colors duration-200 hover:text-emerald-300 sm:text-sm"
            >
              {item.label}
              <ArrowUpRight
                aria-hidden="true"
                className="h-3 w-3 -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="mt-10 h-px bg-white/10" />

        {/* Social links */}
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-5 py-8 sm:gap-x-10">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Lami Gudisa on ${social.name}`}
                className="group inline-flex items-center gap-2 text-xs text-white/65 transition-colors duration-200 hover:text-emerald-300 sm:text-sm"
              >
                <Icon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                />
                <span>{social.name}</span>
              </a>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Contact details */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 py-8 sm:gap-x-10">
          {contact?.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 text-xs text-white/65 transition-colors hover:text-emerald-300 sm:text-sm"
            >
              <Mail
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-emerald-400"
              />
              <span className="break-all">{contact.email}</span>
            </a>
          )}

          {contact?.phone && (
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 text-xs text-white/65 transition-colors hover:text-emerald-300 sm:text-sm"
            >
              <Phone
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-emerald-400"
              />
              <span>{contact.phone}</span>
            </a>
          )}

          {contact?.location && (
            <span className="inline-flex items-center gap-2 text-xs text-white/65 sm:text-sm">
              <MapPin
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-emerald-400"
              />
              <span>{contact.location}</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Copyright */}
        <div className="flex justify-center py-6 text-center">
          <p className="text-[10px] font-medium tracking-[0.16em] text-white/40 sm:text-xs">
            © {new Date().getFullYear()} LAMI GUDISA
          </p>
        </div>
      </div>
    </footer>
  );
}