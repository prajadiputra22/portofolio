"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState } from "react";
import { AppIcon, type AppIconName } from "@/components/AppIcon";
import HomeFooter from "@/components/portfolio/HomeFooter";
import HomeHeader from "@/components/portfolio/HomeHeader";
import type { Profile } from "@/types/profile";

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string | null;
};

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  projectUrl: string | null;
  repoUrl: string | null;
  tags: string[];
};

const services: {
  icon: AppIconName;
  title: string;
  description: string;
  points: string[];
}[] = [
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

// Wrapper presentational ringan untuk konten non-critical di bawah fold.
function Reveal({
  children,
  className = "",
  direction = "up",
  instant = false,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left";
  instant?: boolean;
}) {
  if (instant) {
    return <div className={`animate-hero-in motion-reduce:animate-none ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`${direction === "left" ? "reveal-on-scroll-left" : "reveal-on-scroll"} ${className}`}
    >
      {children}
    </div>
  );
}

function splitHeadline(headline: string) {
  const words = headline.trim().split(" ");
  if (words.length <= 1) {
    return { lead: "", emphasis: headline };
  }
  const emphasis = words.pop() as string;
  return { lead: words.join(" ") + " ", emphasis };
}

export default function HomeClient({
  works,
  blogs,
  profile,
}: {
  works: WorkItem[];
  blogs: BlogItem[];
  profile: Profile;
}) {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { lead: headlineLead, emphasis: headlineEmphasis } = splitHeadline(
    profile.hero_headline || "Welcome To My Portfolio"
  );

  return (
    <>
      <HomeHeader fullName={profile.full_name} />

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
            <Reveal instant className="hidden md:order-2 md:w-1/2 md:flex md:justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-secondary/20 rounded-[50%] blur-sm group-hover:bg-secondary/70 shadow-[0_0_16px_0px] sm:shadow-[0_0_24px_0px] md:shadow-[0_0_32px_0px] lg:shadow-[0_0_40px_0px] shadow-secondary/80 transition-all duration-500 flex-shrink-10" />
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-[50%] overflow-hidden shadow-[0_0_16px_0px] sm:shadow-[0_0_24px_0px] md:shadow-[0_0_32px_0px] lg:shadow-[0_0_40px_0px] shadow-secondary/80 transition-all duration-500">
                  <Image
                    src={profile.avatar_url || "/pictures/me.png"}
                    alt={`${profile.full_name} Profile`}
                    fill
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, (min-width: 640px) 256px, 192px"
                    className="object-cover"
                    priority
                    fetchPriority="high"
                  />
                </div>
              </div>
            </Reveal>
            <div className="md:order-1 w-full md:w-1/2 max-w-2xl text-center md:text-left">
              <Reveal instant>
                <p className="font-label-mono text-[11px] md:text-label-mono text-secondary mb-3 md:mb-4 tracking-[0.2em] uppercase">
                  HI, I&apos;M <span className="text-secondary">{profile.hero_greeting}</span>
                </p>
              </Reveal>
              <Reveal instant>
                <h1 className="text-balance font-display-lg-mobile text-[32px] leading-[38px] md:font-display-lg md:text-[40px] md:leading-[48px] lg:text-display-lg lg:leading-[1.1] pb-1 mb-6 md:mb-8 lg:mb-4">
                  {headlineLead}
                  <span className="italic font-light-bold inline-block pb-1">{headlineEmphasis}</span>
                </h1>
              </Reveal>
              <Reveal instant>
                <p className="font-body-lg text-sm md:text-body-lg text-on-surface-variant mb-8 md:mb-10 max-w-xl mx-auto md:mx-0">
                  {profile.bio}
                </p>
              </Reveal>
              <Reveal instant>
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
          className={`below-fold py-16 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden`}
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
                <AppIcon
                  name={service.icon}
                  className="text-secondary mb-4 md:mb-6 block size-[32px] md:size-[40px]"
                />
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
        <section className={`below-fold py-16 md:py-24 bg-surface-container-lowest`} id="works">
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
                    const caseStudyLink = work.projectUrl || work.repoUrl;

                    return (
                      <Reveal
                        key={work.id}
                        className="group relative overflow-hidden bg-surface-container rounded-3xl border border-outline-variant/30 transition-all hover:-translate-y-2"
                      >
                        <div className="aspect-video relative overflow-hidden bg-surface-variant/30 flex items-center justify-center">
                          {work.image ? (
                            <Image
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              alt={work.title}
                              src={work.image}
                              fill
                              sizes="(min-width: 768px) 33vw, 100vw"
                            />
                          ) : (
                            <AppIcon name="image" className="text-outline-variant text-4xl" />
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
                              className="text-secondary font-label-mono text-label-mono flex items-center gap-2 group/link"
                              href={caseStudyLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              CASE STUDY{" "}
                              <AppIcon
                                name="arrow_right_alt"
                                className="size-4 transition-transform group-hover/link:translate-x-1"
                              />
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
          className={`below-fold py-6 md:py-10 overflow-hidden`}
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
                      width={24}
                      height={24}
                      loading="lazy"
                      decoding="async"
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
        </section>

        {/* Latest Insights Section */}
        <section
          className="below-fold py-16 md:py-24 bg-surface-container-lowest"
          id="blog"
        >
          <div className="px-margin-mobile md:px-margin-desktop overflow-hidden">
            <Reveal className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-headline-lg-mobile text-2xl md:text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-3 md:mb-4">
                  Latest Insights
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
              <p className="font-label-mono text-caption text-on-surface-variant uppercase tracking-wider max-w-xs">
                Thoughts on architecture, performance, and the web.
              </p>
            </Reveal>

            {blogs.length === 0 ? (
              <Reveal className="glass-card rounded-3xl p-10 text-center text-on-surface-variant">
                Belum ada artikel yang dipublikasikan.
              </Reveal>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {blogs.map((blog) => (
                  <Reveal
                    key={blog.id}
                    className="group overflow-hidden bg-surface-container rounded-3xl border border-outline-variant/30 transition-all hover:-translate-y-2"
                  >
                    <Link href={`/blog/${blog.slug}`} className="block h-full">
                      <div className="aspect-video relative overflow-hidden bg-surface-variant/30 flex items-center justify-center">
                        {blog.coverImageUrl ? (
                          <Image
                            src={blog.coverImageUrl}
                            alt={blog.title}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <AppIcon name="article" className="text-outline-variant text-4xl" />
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        {blog.category && (
                          <p className="font-label-mono text-[10px] uppercase tracking-wider text-secondary mb-2">
                            {blog.category}
                          </p>
                        )}
                        <h3 className="font-headline-md text-base md:text-lg mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-on-surface-variant text-xs md:text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <span className="text-secondary font-label-mono text-caption flex items-center gap-2">
                          READ MORE
                          <AppIcon name="arrow_right_alt" className="size-4" />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className={`below-fold py-16 md:py-24 bg-surface-container-low`} id="contact">
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
                      <AppIcon name="location_on" className="text-lg md:text-2xl" />
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Location
                      </p>
                      <p className="font-body-md text-sm md:text-base">{profile.location}</p>
                    </div>
                  </Reveal>
                  <Reveal className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                      <AppIcon name="call" className="text-lg md:text-2xl" />
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Phone Number
                      </p>
                      <p className="font-body-md text-sm md:text-base">{profile.phone}</p>
                    </div>
                  </Reveal>
                  <Reveal className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                      <AppIcon name="alternate_email" className="text-lg md:text-2xl" />
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Email Address
                      </p>
                      <p className="font-body-md text-sm md:text-base break-all">{profile.email}</p>
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
                          to: profile.email,
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
                        <AppIcon name="progress_activity" className="animate-spin text-lg" />
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

      <HomeFooter profile={profile} />
    </>
  );
}