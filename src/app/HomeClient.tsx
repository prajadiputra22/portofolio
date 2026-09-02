"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect, useRef, useState } from "react";

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  projectUrl: string | null;
  repoUrl: string | null;
  tags: string[];
};

const navLinks = [
  { id: "home", label: "Home", icon: "home" },
  { id: "services", label: "Services", icon: "rebase_edit" },
  { id: "works", label: "Works", icon: "grid_view" },
  // { id: "blog", label: "Blog", icon: "article" },
  { id: "contact", label: "Contact", icon: "mail" },
];

const services = [
  {
    icon: "web",
    title: "Front End Developer",
    description:
      "Crafting responsive, pixel-perfect interfaces using modern frameworks like React and Next.js, with a focus on performance and user-centric design.",
    points: ["UI/UX Translation", "Interactive Components", "Responsive Layouts"],
  },
  {
    icon: "dns",
    title: "Backend Developer",
    description:
      "Building robust server-side logic and database architectures. Experienced in API design, authentication, and secure data management systems.",
    points: ["API Development", "Database Design", "Server Management"],
  },
  {
    icon: "integration_instructions",
    title: "Fullstack Developer",
    description:
      "Delivering end-to-end solutions by bridging the gap between design and data. Mastery of the entire development lifecycle from concept to deployment.",
    points: ["System Integration", "DevOps Workflows", "Scalable Solutions"],
  },
];

const skillTags = [
  { name: "Python", icon: "https://cdn.simpleicons.org/python/e0e3e5" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/e0e3e5" },
  { name: "Node.Js", icon: "https://cdn.simpleicons.org/nodedotjs/e0e3e5" },
  { name: "Next.Js", icon: "https://cdn.simpleicons.org/nextdotjs/e0e3e5" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/e0e3e5" },
  { name: "JavaScript", icon: "https://cdn.simpleicons.org/javascript/e0e3e5" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/e0e3e5" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/e0e3e5" },
  { name: "PHP", icon: "https://cdn.simpleicons.org/php/e0e3e5" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/e0e3e5" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/e0e3e5" },
  { name: "Github", icon: "https://cdn.simpleicons.org/github/e0e3e5" },
  { name: "Linux", icon: "https://cdn.simpleicons.org/linux/e0e3e5" },
  { name: "Mikrotik", icon: "https://cdn.simpleicons.org/mikrotik/e0e3e5" },
];

const blogPosts = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBsn6CHLDd6FlJR09XLnE4aa1h8xrDKfmM8O730UiMhHB1zFAUbGH6yUmGRI-Pvvnd2Zfp0kztFkNgP19VjiTiN0sVFPrJlvq8nW0Kcby0BeR-REORwGrRg2wCYn8TuYKeOnmxkVModvQDrX_zxDZv9YjicdPGvri9yEhJdA9guk1IC1hRO0pzdLRQ75YAIQ7NNiKmp8nRPGxb7d8mfS-7OgOFjpkNZupMGFbERiR5c51Sr3aTOXsMUcxLED4sYB3A2mLZa73iGPooy",
    alt: "Next.js visualization",
    category: "Web Development",
    title: "Exploring the Future of Next.js",
    description:
      "An in-depth look at the evolution of server components and the impact on modern web architecture.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMixXsyDKiCs3-ynrZBczKh43QA6TCgzUyqq4fmuzxtUttzES4LDCKd8oCzfd9taOfYEu2y9tTNczoOVpWNJGDjvFz1HxDr9HV4SqNeqTtPyw7aV7TFg0BbhFPbYSv2cCrc4DU2jLYisfSHthnd9QpjMkN2sCLRbV_GB2FmGhMTA4Ar5teHtTqm6EVTkgpgtp6EtuLjgcZ0spsMqEkfJd1CSXMAuWza5AJqk8e9IF6iZ3gzgnqyDhSYFzIYCofzI7VU34J43bRaKK5",
    alt: "Tailwind CSS code",
    category: "Tutorial",
    title: "Mastering Tailwind CSS Grids",
    description:
      "Building complex, responsive layouts with precision using Tailwind's powerful grid utility system.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCej5p3leN5LBjH2MG09PDLOThMM2a0X29nTVKrQbosYx4KKDtGmUeXH2u44RuartbnR0hVtanepNMZN9F_5EqGQU0VbipWSm5GAKm9p5pvkT8i19uieICO9_imWmtfxL-NnnyoEr1_VpA3IOaVLqAaU8Ih05I3-WOnZ2cOkOWhVWqqFBE73mzzeZlXes4pOeY7J3JKm9cVo_vsOJxJS92E21NDhE4PjV4HoOQRY5wWY8BpDhuyUwhTJJA80b-OZFGW7g9yjW86IfTp",
    alt: "Clean code on screen",
    category: "Architecture",
    title: "Clean Code in Backend Logic",
    description:
      "Strategies for maintaining scalable and readable server-side codebases in high-traffic applications.",
  },
];

// Komponen reveal generik: elemen slide masuk saat pertama kali terlihat di viewport.
// direction "up" = slide dari bawah (default), "left" = slide dari kanan ke kiri.
function Reveal({
  children,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform = direction === "left" ? "translate-x-16" : "translate-y-12";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${hiddenTransform}`
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function HomeClient({ works }: { works: WorkItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("id") || "home");
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* TopAppBar Shell */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <Link href="/">
          <div className="flex items-center gap-1.5 md:gap-2 md:-ml-12">
            <span className="material-symbols-outlined text-secondary text-lg md:text-2xl" data-icon="terminal">
              terminal
            </span>
            <span className="font-label-mono text-[10px] md:text-label-mono tracking-widest text-secondary uppercase leading-tight">
              DARMAWAN Suka Prajadiputra
            </span>
          </div>
          </Link>
          {/* Desktop Menu */}
          <nav className="hidden md:flex md:-mr-14 items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                className={`font-label-mono text-caption uppercase tracking-wider transition-colors ${
                  activeSection === link.id
                    ? "text-secondary"
                    : "text-on-surface hover:text-secondary"
                }`}
                href={`#${link.id}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            className="md:hidden cursor-pointer active:opacity-70 text-secondary"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="material-symbols-outlined" data-icon="menu">
              menu
            </span>
          </button>
        </div>
      </header>

      {/* Navigation Drawer (Mobile) */}
      <nav
        className={`fixed right-0 top-0 h-full z-[60] flex flex-col p-5 bg-surface-container-high dark:bg-surface-container-high w-64 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="font-headline-md text-lg text-on-surface uppercase">
            NAVIGATION
          </span>
          <button className="text-on-surface-variant" onClick={() => setIsMenuOpen(false)}>
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.id}
              className={`flex items-center gap-3 p-3 rounded-lg font-label-mono text-[13px] transition-all ${
                activeSection === link.id
                  ? "bg-secondary/10 text-secondary border-r-4 border-secondary"
                  : "text-on-surface-variant hover:bg-surface-variant/50"
              }`}
              href={`#${link.id}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-lg" data-icon={link.icon}>
                {link.icon}
              </span>{" "}
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="pt-18">
        {/* Hero Section */}
        <section
          className={`relative min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 md:py-0 overflow-hidden w-full`}
          id="home"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-tertiary/5 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-12">
            {/* Mobile: Image Top, Desktop: Image Right */}
            <Reveal className="hidden md:order-2 md:w-1/2 md:flex md:justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-secondary/20 rounded-[50%] blur-sm group-hover:bg-secondary/70 shadow-[0_0_16px_0px] sm:shadow-[0_0_24px_0px] md:shadow-[0_0_32px_0px] lg:shadow-[0_0_40px_0px] shadow-secondary/80 transition-all duration-500 flex-shrink-10" />
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-[50%] overflow-hidden shadow-[0_0_16px_0px] sm:shadow-[0_0_24px_0px] md:shadow-[0_0_32px_0px] lg:shadow-[0_0_40px_0px] shadow-secondary/80 transition-all duration-500">
                  <Image
                    src="/pictures/me.png"
                    alt="Darmawan Profile"
                    fill
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, (min-width: 640px) 256px, 192px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </Reveal>
            <div className="md:order-1 w-full md:w-1/2 max-w-2xl text-center md:text-left">
              <Reveal>
                <p className="font-label-mono text-[11px] md:text-label-mono text-secondary mb-3 md:mb-4 tracking-[0.2em] uppercase">
                  HI, I&apos;M <span className="text-secondary">DARMAWAN</span>
                </p>
              </Reveal>
              <Reveal>
                <h1 className="text-balance font-display-lg-mobile text-[32px] leading-[38px] md:font-display-lg md:text-[40px] md:leading-[48px] lg:text-display-lg lg:leading-[1.1] pb-1 mb-6 md:mb-8 lg:mb-4">
                  Welcome To My{" "}
                  <span className="italic font-light-bold inline-block pb-1">Portfolio</span>
                </h1>
              </Reveal>
              <Reveal>
                <p className="font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-xl mx-auto md:mx-0">
                  A passionate Software Developer dedicated to building high-performance, scalable
                  digital experiences. I balance complex backend engineering with refined frontend
                  aesthetics to create architectural integrity in every pixel.
                </p>
              </Reveal>
              <Reveal>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-0">
                  <a
                    className="bg-secondary text-on-secondary px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-label-mono text-[11px] md:text-label-mono font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-secondary/20"
                    href="#works"
                  >
                    VIEW WORKS
                  </a>
                  <a
                    className="border border-outline-variant px-6 py-2.5 md:px-8 md:py-3 rounded-xl font-label-mono text-[11px] md:text-label-mono hover:bg-surface-variant/30 transition-all"
                    href="#contact"
                  >
                    HIRE ME
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className={`py-16 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden`}
          id="services"
        >
          <Reveal className="mb-10 md:mb-16">
            <h2 className="font-headline-lg-mobile text-2xl md:text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-3 md:mb-4">
              Core Expertise
            </h2>
            <div className="h-1 w-20 bg-secondary" />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Reveal
                key={service.title}
                direction="up"
                className="glass-card rounded-3xl p-6 md:p-8 group hover:border-secondary/50 transition-colors flex flex-col items-center text-center"
              >
                <span
                  className="material-symbols-outlined text-secondary mb-4 md:mb-6 block text-[32px] md:text-[40px]"
                  data-icon={service.icon}
                >
                  {service.icon}
                </span>
                <h3 className="font-headline-md text-lg md:text-headline-md mb-3 md:mb-4 uppercase">
                  {service.title}
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base mb-4 md:mb-6">{service.description}</p>
                 <ul className="space-y-2 font-label-mono text-caption text-secondary/70">
                  {service.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Works Section */}
        <section className={`py-16 md:py-24 bg-surface-container-lowest`} id="works">
          <div className="px-margin-mobile md:px-margin-desktop overflow-hidden">
            <Reveal className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-headline-lg-mobile text-2xl md:text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-3 md:mb-4">
                  Selected Works
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
            </Reveal>
            <div className="relative">
              {works.length === 0 ? (
                <Reveal className="glass-card rounded-3xl p-10 text-center text-on-surface-variant">
                  Belum ada project yang ditambahkan.
                </Reveal>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {works.map((work) => {
                    // Live project URL diutamakan; kalau tidak ada, fallback ke repository.
                    const caseStudyLink = work.projectUrl || work.repoUrl;

                    return (
                      <Reveal
                        key={work.id}
                        className="group relative overflow-hidden bg-surface-container rounded-3xl border border-outline-variant/30 transition-all hover:-translate-y-2"
                      >
                        <div className="aspect-video relative overflow-hidden bg-surface-variant/30 flex items-center justify-center">
                          {work.image ? (
                            <img
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              alt={work.title}
                              src={work.image}
                            />
                          ) : (
                            <span className="material-symbols-outlined text-outline-variant text-4xl">
                              image
                            </span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60" />
                        </div>
                        <div className="p-4 md:p-6">
                          {work.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {work.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-secondary/10 text-secondary text-caption font-label-mono px-3 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <h3 className="font-headline-md text-base md:text-lg mb-2">{work.title}</h3>
                          <p className="text-on-surface-variant text-xs md:text-sm mb-4 line-clamp-3">
                            {work.description}
                          </p>
                          {caseStudyLink ? (
                            <a
                              className="text-secondary font-label-mono text-label-mono flex items-center gap-2 hover:gap-4 transition-all"
                              href={caseStudyLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              CASE STUDY{" "}
                              <span className="material-symbols-outlined" data-icon="arrow_right_alt">
                                arrow_right_alt
                              </span>
                            </a>
                          ) : (
                            <span className="text-on-surface-variant/50 font-label-mono text-label-mono flex items-center gap-2 cursor-not-allowed">
                              NO LINK AVAILABLE
                            </span>
                          )}
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section - animasi per section, slide dari kanan ke kiri */}
        <section
          className={`py-6 md:py-10 overflow-hidden`}
          id="skills"
        >
          <Reveal
            direction="left"
            className="relative w-full overflow-hidden group/marquee"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }}
            >
              <div className="flex w-max gap-3 md:gap-10 animate-marquee group-hover/marquee:[animation-play-state:paused]">
                {[...skillTags, ...skillTags].map((skill, idx) => (
                  <div
                    key={`${skill.name}-${idx}`}
                    className="flex items-center gap-1.5 md:gap-3 shrink-0 px-3 py-1.5 md:px-6 md:py-3 bg-surface-variant/30 border border-outline-variant rounded-full hover:border-secondary transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-4 h-4 md:w-6 md:h-6 object-contain shrink-0"
                    />
                    <span className="font-label-mono text-[10px] md:text-label-mono uppercase tracking-wider whitespace-nowrap">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <style jsx>{`
            @keyframes marquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
            .animate-marquee {
              animation: marquee 22s linear infinite;
            }
          `}</style>
        </section>

        {/* Blog Section - disembunyikan sementara */}
        {false && (
        <section className={`py-16 md:py-24 bg-surface-container-lowest`} id="blog">
          <div className="px-margin-mobile md:px-margin-desktop">
            <Reveal className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-headline-lg-mobile text-2xl md:text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-3 md:mb-4">
                  Latest Insights
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {blogPosts.map((post) => (
                <Reveal
                  key={post.title}
                  className="group bg-surface-container rounded-3xl border border-outline-variant/30 overflow-hidden transition-all hover:border-secondary/30"
                >
                  <div className="aspect-video bg-surface-variant/30 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={post.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={post.image}
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <span className="text-caption font-label-mono text-secondary uppercase tracking-wider mb-2 md:mb-3 block">
                      {post.category}
                    </span>
                    <h3 className="font-headline-md text-lg md:text-headline-md mb-2 md:mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm md:text-body-md mb-4 md:mb-6 line-clamp-2">
                      {post.description}
                    </p>
                    <a
                      className="text-secondary font-label-mono text-label-mono flex items-center gap-2 hover:gap-4 transition-all"
                      href="#"
                    >
                      READ MORE{" "}
                      <span className="material-symbols-outlined" data-icon="arrow_right_alt">
                        arrow_right_alt
                      </span>
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Contact Section */}
        <section className={`py-16 md:py-24 bg-surface-container-low`} id="contact">
          <div className="px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
              <div>
                <Reveal>
                  <h2 className="font-display-lg-mobile text-[28px] leading-[34px] md:text-display-lg-mobile mb-4 md:mb-6">
                    Let&apos;s <span className="text-secondary">Talk.</span>
                  </h2>
                </Reveal>
                <Reveal>
                  <p className="text-sm md:text-body-lg text-on-surface-variant mb-8 md:mb-12 max-w-md">
                    Have a complex problem that needs a clean solution? Drop me a message and
                    let&apos;s build something exceptional.
                  </p>
                </Reveal>
                <div className="space-y-6 md:space-y-8">
                  <Reveal className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                      <span className="material-symbols-outlined text-lg md:text-2xl" data-icon="location_on">
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Location
                      </p>
                      <p className="font-body-md text-sm md:text-base">Sukabumi City, West Java, Indonesia</p>
                    </div>
                  </Reveal>
                  <Reveal className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                      <span className="material-symbols-outlined text-lg md:text-2xl" data-icon="call">
                        call
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Phone Number
                      </p>
                      <p className="font-body-md text-sm md:text-base">+62 857 1794 5499</p>
                    </div>
                  </Reveal>
                  <Reveal className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                      <span className="material-symbols-outlined text-lg md:text-2xl" data-icon="alternate_email">
                        alternate_email
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Email Address
                      </p>
                      <p className="font-body-md text-sm md:text-base break-all">darmawanprajadiputra@gmail.com</p>
                    </div>
                  </Reveal>
                </div>
              </div>
              <Reveal className="glass-card p-5 md:p-8 rounded-3xl">
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const name = (formData.get("name") as string)?.trim();
                    const email = (formData.get("email") as string)?.trim();
                    const message = (formData.get("message") as string)?.trim();

                    if (!name || !email || !message) return;

                    setFormStatus("loading");

                    try {
                      const res = await fetch("https://api.web3forms.com/submit", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                        },
                        body: JSON.stringify({
                          access_key: "1bca3c5c-f381-4639-bd6b-a632623c1a1e",
                          subject: `Pesan baru dari ${name} lewat Portfolio`,
                          from_name: name,
                          email,
                          message,
                          to: "darmawanprajadiputra@gmail.com",
                        }),
                      });

                      const result = await res.json();

                      if (result.success) {
                        setFormStatus("success");
                        form.reset();
                      } else {
                        setFormStatus("error");
                      }
                    } catch {
                      setFormStatus("error");
                    } finally {
                      setTimeout(() => setFormStatus("idle"), 4000);
                    }
                  }}
                >
                  <div>
                    <label className="block font-label-mono text-caption uppercase text-on-surface-variant mb-2">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-background border border-outline-variant focus:border-secondary focus:ring-0 rounded-lg p-3 md:p-4 text-sm md:text-base transition-all"
                      placeholder="Your Name..."
                      type="text"
                      name="name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-label-mono text-caption uppercase text-on-surface-variant mb-2">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-background border border-outline-variant focus:border-secondary focus:ring-0 rounded-lg p-3 md:p-4 text-sm md:text-base transition-all"
                      placeholder="name@example.com"
                      type="email"
                      name="email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-label-mono text-caption uppercase text-on-surface-variant mb-2">
                      Project Message
                    </label>
                    <textarea
                      className="w-full bg-background border border-outline-variant focus:border-secondary focus:ring-0 rounded-lg p-3 md:p-4 text-sm md:text-base transition-all resize-none"
                      placeholder="Tell me about your project..."
                      rows={4}
                      name="message"
                      required
                    />
                  </div>
                  <button
                    className="w-full bg-secondary text-on-secondary py-3 md:py-4 rounded-lg font-label-mono text-[11px] md:text-label-mono font-bold hover:brightness-110 transition-all shadow-lg shadow-secondary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                    disabled={formStatus === "loading"}
                  >
                    {formStatus === "loading" ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg" data-icon="progress_activity">
                          progress_activity
                        </span>
                        SENDING...
                      </>
                    ) : formStatus === "success" ? (
                      "MESSAGE SENT ✓"
                    ) : formStatus === "error" ? (
                      "FAILED, TRY AGAIN"
                    ) : (
                      "SEND MESSAGE"
                    )}
                  </button>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Shell */}
      <footer className="w-full py-8 md:py-10 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-3 md:gap-4">
          <span className="font-label-mono text-[11px] md:text-label-mono text-secondary uppercase text-center">
            DARMAWAN SUKA PRAJADIPUTRA
          </span>
          <p className="font-caption text-caption text-on-surface-variant opacity-80 hover:opacity-100 transition-all text-center">
            © 2024 DarmawanSP.
          </p>
          <div className="flex gap-4 md:gap-6">
            <a
              className="font-caption text-caption text-on-surface-variant hover:text-secondary underline decoration-secondary/30 transition-all"
              href="https://www.linkedin.com/in/darmawan-suka-prajadiputra-466029290/"
            >
              LinkedIn
            </a>
            <a
              className="font-caption text-caption text-on-surface-variant hover:text-secondary underline decoration-secondary/30 transition-all"
              href="https://github.com/prajadiputra22"
            >
              GitHub
            </a>
            <a
              className="font-caption text-caption text-on-surface-variant hover:text-secondary underline decoration-secondary/30 transition-all"
              href="https://www.instagram.com/_prajadiputra?igsh=MWRxM3dzM2J3ZGU0"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}