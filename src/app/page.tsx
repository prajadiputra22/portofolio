"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { id: "home", label: "Home", icon: "home" },
  { id: "services", label: "Services", icon: "rebase_edit" },
  { id: "works", label: "Works", icon: "grid_view" },
  { id: "skills", label: "Skills", icon: "psychology" },
  { id: "blog", label: "Blog", icon: "article" },
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
    title: "Fullstack Web Developer",
    description:
      "Delivering end-to-end solutions by bridging the gap between design and data. Mastery of the entire development lifecycle from concept to deployment.",
    points: ["System Integration", "DevOps Workflows", "Scalable Solutions"],
  },
];

const projects = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Nxvuj9lyqeTDm3VNz7ERXom3PUU9sR3kmeTR6NxcTKE6rzRVft2QUXIZ5RukUzLGnRN6qhe08iDbJdE4pM_eRcOT6yY2wkry1Uu-yMfsey1sToQAlctL_HgRmnQduiN6sCrgNObRHN8cZd6ylBDvg_m_Lq9y-ayv5RJ39-USIazSLA2-uE8geT-CoSiZxTEPuX_3oqlYV52a4iS98RZZbrA_ubk-dJFfxflhvCTZrx_CzdxfYr0cH8v7QQdzG4gQ-UWGLBHKNmMO",
    alt: "A sophisticated dark-themed dashboard interface with glowing neon cyan data visualizations and sleek glassmorphism panels.",
    tags: ["Next.Js", "Tailwind"],
    title: "Nexus Analytics Engine",
    description:
      "A real-time data monitoring platform with complex visualization and predictive modeling tools for enterprise clients.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuOl6W3fP1CPqTN4CppLmPtdfbOzGoG0lmbuiJrkzN3IVzSeDqpJi5EPvFZC_VIqZwNki_zgx4V_XQ751s-HW2VkSzJas21JWYvth7IrRLrfirA570n_YLIfLsoJncx_lQfIxU1cPv3DQZJBgLOt6DqkjAsQj3vNLuXpLgtmHqY0pFxavsQIWRI9tcXSRBRxjv3_Zu7l37qmNGkyGnoDduKdvpMbno6-1xNBuuuaTK5F-wRseTxfPwV_Q9txZ9bf-ttPcLnpOL-caj",
    alt: "A premium e-commerce platform interface for high-end electronic gadgets, featuring large-scale high-resolution product imagery.",
    tags: ["Laravel", "MySQL"],
    title: "Omni-Channel Commerce",
    description:
      "A full-stack e-commerce solution featuring secure payments, inventory management, and personalized user journeys.",
  },
];

const education = [
  {
    year: "2018 - 2022",
    title: "Bachelor of Computer Science",
    place: "Global Institute of Technology",
    note: "Focused on Software Architecture and Database Systems.",
    active: true,
  },
  {
    year: "2023",
    title: "Advanced Web Architecture",
    place: "Digital Academy Excellence",
    note: "Certified Professional Full-Stack Developer.",
    active: false,
  },
];

const skillTags = [
  "Python",
  "Laravel",
  "Node.Js",
  "Next.Js",
  "Tailwind CSS",
  "MySQL",
  "JavaScript",
  "Mikrotik",
];

const skillBars = [
  { label: "Frontend Engineering", value: 95 },
  { label: "Backend Logic", value: 88 },
  { label: "Database Optimization", value: 82 },
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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const worksScrollRef = useRef<HTMLDivElement>(null);

  const scrollWorks = (direction: "left" | "right") => {
    if (!worksScrollRef.current) return;
    const scrollAmount = 360;
    worksScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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
          <a href="/">
          <div className="flex items-center gap-2 md:-ml-12">
            <span className="material-symbols-outlined text-secondary" data-icon="terminal">
              terminal
            </span>
            <span className="font-label-mono text-label-mono tracking-widest text-secondary uppercase ">
              DARMAWAN Suka Prajadiputra
            </span>
          </div>
          </a>
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
        className={`fixed right-0 top-0 h-full z-[60] flex flex-col p-6 bg-surface-container-high dark:bg-surface-container-high w-72 shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
          <span className="font-headline-md text-headline-md text-on-surface uppercase">
            NAVIGATION
          </span>
          <button className="text-on-surface-variant" onClick={() => setIsMenuOpen(false)}>
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.id}
              className={`flex items-center gap-4 p-4 rounded-lg font-label-mono text-label-mono transition-all ${
                activeSection === link.id
                  ? "bg-secondary/10 text-secondary border-r-4 border-secondary"
                  : "text-on-surface-variant hover:bg-surface-variant/50"
              }`}
              href={`#${link.id}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined" data-icon={link.icon}>
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
          className="relative min-h-[85vh] flex flex-col justify-center px-6 md:px-12 lg:px-16 overflow-hidden w-full"
          id="home"
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-tertiary/5 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-12">
            {/* Mobile: Image Top, Desktop: Image Right */}
            <div className="md:order-2 w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-secondary/20 rounded-[50%] blur-sm group-hover:bg-secondary/70 shadow-[0_0_40px_0px] shadow-secondary/80 transition-all duration-500 flex-shrink-10" />
                <div className="relative w-90 h-90 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-[50%] overflow-hidden shadow-[0_0_40px_0px] shadow-secondary/80 transition-all duration-500">
                  <Image
                    src="/pictures/me.png"
                    alt="Darmawan Profile"
                    fill
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, 256px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="md:order-1 w-full md:w-1/2 max-w-2xl text-center md:text-left">
              <p className="font-label-mono text-label-mono text-secondary mb-4 tracking-[0.2em] uppercase">
                HI, I&apos;M <span className="text-secondary">DARMAWAN</span>
              </p>
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg mb-6 leading-tight">
                Welcome To My <span className="italic font-light-bold">Portfolio</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto md:mx-0">
                A passionate web developer dedicated to building high-performance, scalable
                digital experiences. I balance complex backend engineering with refined frontend
                aesthetics to create architectural integrity in every pixel.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a
                  className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-mono text-label-mono font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-secondary/20"
                  href="#works"
                >
                  VIEW WORKS
                </a>
                <a
                  className="border border-outline-variant px-8 py-3 rounded-xl font-label-mono text-label-mono hover:bg-surface-variant/30 transition-all"
                  href="#contact"
                >
                  HIRE ME
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          className="py-24 px-margin-mobile md:px-margin-desktop overflow-hidden"
          id="services"
        >
          <div className="mb-16">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
              Core Expertise
            </h2>
            <div className="h-1 w-20 bg-secondary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="glass-card rounded-3xl p-8 group hover:border-secondary/50 transition-colors flex flex-col items-center text-center"
              >
                <span
                  className="material-symbols-outlined text-secondary mb-6 block"
                  style={{ fontSize: '40px' }}
                  data-icon={service.icon}
                >
                  {service.icon}
                </span>
                <h3 className="font-headline-md text-headline-md mb-4 uppercase">
                  {service.title}
                </h3>
                <p className="text-on-surface-variant mb-6">{service.description}</p>
                 <ul className="space-y-2 font-label-mono text-caption text-secondary/70">
                  {service.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Works Section */}
        <section className="py-24 bg-surface-container-lowest" id="works">
          <div className="px-margin-mobile md:px-margin-desktop overflow-hidden">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
                  Selected Works
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
            </div>
            <div className="relative">
              {projects.length >= 4 && (
                <>
                  <button
                    aria-label="Previous project"
                    onClick={() => scrollWorks("left")}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined" data-icon="chevron_left">
                      chevron_left
                    </span>
                  </button>
                  <button
                    aria-label="Next project"
                    onClick={() => scrollWorks("right")}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined" data-icon="chevron_right">
                      chevron_right
                    </span>
                  </button>
                </>
              )}
              <div
                ref={worksScrollRef}
                className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {projects.map((project) => (
                  <div
                    key={project.title}
                    className="group relative overflow-hidden bg-surface-container rounded-xl border border-outline-variant/30 transition-all hover:-translate-y-2 flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={project.alt}
                        src={project.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary/10 text-secondary text-caption font-label-mono px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-headline-md text-lg mb-2">{project.title}</h3>
                      <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <a
                        className="text-secondary font-label-mono text-label-mono flex items-center gap-2 hover:gap-4 transition-all"
                        href="#"
                      >
                        CASE STUDY{" "}
                        <span className="material-symbols-outlined" data-icon="arrow_right_alt">
                          arrow_right_alt
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Education Section */}
        <section
          className="py-24 px-margin-mobile md:px-margin-desktop"
          id="skills"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Part A: Education */}
            <div>
              <div className="mb-12">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
                  Education
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
              <div className="space-y-8">
                {education.map((item) => (
                  <div key={item.title} className="relative pl-8 border-l border-outline-variant">
                    <div
                      className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full ${
                        item.active ? "bg-secondary" : "bg-outline"
                      }`}
                    />
                    <span className="font-label-mono text-caption text-secondary block mb-2">
                      {item.year}
                    </span>
                    <h4 className="font-headline-md text-headline-md mb-1">{item.title}</h4>
                    <p className="text-on-surface-variant">{item.place}</p>
                    <p className="text-caption text-on-tertiary-container mt-2 italic">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Part B: Skills */}
            <div>
              <div className="mb-12">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
                  Stack &amp; Skills
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
              <div className="flex flex-wrap gap-3 mb-12">
                {skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-6 py-2 bg-surface-variant/30 border border-outline-variant rounded-full font-label-mono text-label-mono hover:border-secondary transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-6">
                {skillBars.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between font-label-mono text-caption uppercase mb-2">
                      <span>{skill.label}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24 bg-surface-container-lowest" id="blog">
          <div className="px-margin-mobile md:px-margin-desktop">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">
                  Latest Insights
                </h2>
                <div className="h-1 w-20 bg-secondary" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div
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
                  <div className="p-6">
                    <span className="text-caption font-label-mono text-secondary uppercase tracking-wider mb-3 block">
                      {post.category}
                    </span>
                    <h3 className="font-headline-md text-headline-md mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-on-surface-variant text-body-md mb-6 line-clamp-2">
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-surface-container-low" id="contact">
          <div className="px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="font-display-lg-mobile text-display-lg-mobile mb-6">
                  Let&apos;s <span className="text-secondary">Talk.</span>
                </h2>
                <p className="text-body-lg text-on-surface-variant mb-12 max-w-md">
                  Have a complex problem that needs a clean solution? Drop me a message and
                  let&apos;s build something exceptional.
                </p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <span className="material-symbols-outlined" data-icon="location_on">
                        location_on
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Location
                      </p>
                      <p className="font-body-md">Sukabumi City, West Java, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <span className="material-symbols-outlined" data-icon="call">
                        call
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Phone Number
                      </p>
                      <p className="font-body-md">+62 857 1794 5499</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <span className="material-symbols-outlined" data-icon="alternate_email">
                        alternate_email
                      </span>
                    </div>
                    <div>
                      <p className="font-label-mono text-caption text-on-tertiary-container uppercase">
                        Email Address
                      </p>
                      <p className="font-body-md">darmawanprajadiputra@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-card p-8 rounded-3xl">
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div>
                    <label className="block font-label-mono text-caption uppercase text-on-surface-variant mb-2">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-background border border-outline-variant focus:border-secondary focus:ring-0 rounded-lg p-4 transition-all"
                      placeholder="John Doe"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block font-label-mono text-caption uppercase text-on-surface-variant mb-2">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-background border border-outline-variant focus:border-secondary focus:ring-0 rounded-lg p-4 transition-all"
                      placeholder="john@example.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block font-label-mono text-caption uppercase text-on-surface-variant mb-2">
                      Project Message
                    </label>
                    <textarea
                      className="w-full bg-background border border-outline-variant focus:border-secondary focus:ring-0 rounded-lg p-4 transition-all resize-none"
                      placeholder="Tell me about your project..."
                      rows={4}
                    />
                  </div>
                  <button
                    className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-label-mono text-label-mono font-bold hover:brightness-110 transition-all shadow-lg shadow-secondary/20"
                    type="submit"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Shell */}
      <footer className="w-full py-10 bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-4">
          <span className="font-label-mono text-label-mono text-secondary uppercase">
            DARMAWAN SUKA PRAJADIPUTRA
          </span>
          <p className="font-caption text-caption text-on-surface-variant opacity-80 hover:opacity-100 transition-all">
            © 2024 Darmawan. Built with Precision.
          </p>
          <div className="flex gap-6">
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