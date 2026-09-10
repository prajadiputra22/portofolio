"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNav = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "person", label: "Manage Profile", href: "/dashboard/profile" },
  { icon: "work", label: "Manage Works", href: "/dashboard/works" },
  { icon: "psychology", label: "Manage Skills", href: "/dashboard/skills" },
  { icon: "rss_feed", label: "Manage Blog", href: "/dashboard/blog" },
];

function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="h-20 flex items-center px-6 border-b border-outline-variant/30 shrink-0">
        <div className="font-headline-md text-[20px] font-bold text-on-surface tracking-tight">
          ARCHITECT.DEV
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        {sidebarNav.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-3 px-6 py-3 bg-secondary/10 text-secondary font-semibold transition-colors"
                  : "flex items-center gap-3 px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-colors"
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="font-body-md text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {mobile ? null : (
        <div className="p-6 border-t border-outline-variant/30 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold cursor-pointer active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            View Live Site
          </a>
        </div>
      )}
    </>
  );
}

export default function DashboardShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full bg-background text-on-background font-body-md overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Drawer + Overlay */}
      <div
        className={`fixed inset-0 z-[70] md:hidden transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 shadow-2xl transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-6 right-4 text-on-surface-variant hover:text-on-surface"
            onClick={() => setIsDrawerOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <Sidebar mobile onNavigate={() => setIsDrawerOpen(false)} />
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar (mobile only) */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-4 px-6 h-16 border-b border-outline-variant/30 bg-background/80 backdrop-blur-xl shrink-0">
          <div className="font-headline-md text-body-lg font-bold text-on-surface">
            {title}
          </div>
          <button
            className="flex items-center justify-center rounded h-9 w-9 text-on-surface"
            onClick={() => setIsDrawerOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </header>

        <main className="flex flex-col gap-8 p-4 md:p-8 max-w-[1400px] mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}