"use client";

import { useState } from "react";
import Link from "next/link";
import { AppIcon, type AppIconName } from "@/components/AppIcon";

const navLinks: { id: string; label: string; icon: AppIconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "services", label: "Services", icon: "rebase_edit" },
  { id: "works", label: "Works", icon: "grid_view" },
  { id: "blog", label: "Blog", icon: "article" },
  { id: "contact", label: "Contact", icon: "mail" },
];

export default function HomeHeader({ fullName }: { fullName: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-max-width items-center justify-between px-margin-mobile md:px-margin-desktop">
          <Link href="/">
            <div className="flex items-center gap-1.5 md:-ml-12 md:gap-2">
              <AppIcon name="terminal" className="size-5 text-secondary md:size-7" />
              <span className="font-label-mono text-[10px] uppercase leading-tight tracking-widest text-secondary md:text-label-mono">
                {fullName}
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 md:-mr-14 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                className="font-label-mono text-caption uppercase tracking-wider text-on-surface transition-colors hover:text-secondary"
                href={`/#${link.id}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            className="cursor-pointer text-secondary active:opacity-70 md:hidden"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open navigation menu"
            type="button"
          >
            <AppIcon name="menu" className="size-5" />
          </button>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className={`fixed right-0 top-0 z-[60] flex h-full w-64 flex-col bg-surface-container-high p-5 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-headline-md text-lg uppercase text-on-surface">
            NAVIGATION
          </span>
          <button
            className="text-on-surface-variant"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
            type="button"
          >
            <AppIcon name="close" className="size-5" />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              className="flex items-center gap-3 rounded-lg p-3 font-label-mono text-[13px] text-on-surface-variant transition-colors hover:bg-surface-variant/50"
              href={`/#${link.id}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <AppIcon name={link.icon} className="size-5" />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
