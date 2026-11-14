import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  Menu,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import certificates from "../data/certificates.json";
import data from "../data/portfolio.json";

const navigation = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Work", "work"],
  ["Contact", "contact"],
];

function getSkillGroups(resume) {
  return [
    {
      title: "Languages",
      description: "The foundations I build with.",
      items: resume.languages || [],
    },
    {
      title: "Frameworks",
      description: "Tools for bringing ideas to life.",
      items: resume.frameworks || [],
    },
    {
      title: "Design & more",
      description: "The creative side of my workflow.",
      items: resume.others || [],
    },
  ].filter((group) => group.items.length > 0);
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const skillGroups = useMemo(
    () => getSkillGroups(data.resume || {}),
    []
  );
  const socialLinks = data.socials || [];
  const footerSocialLinks = socialLinks.filter(
    ({ title = "" }) => !["linkedin", "blog"].includes(title.toLowerCase())
  );
  const selectedProjects = (data.projects || []).slice(0, 3);
  const emailLink = socialLinks.find((social) =>
    social.link.startsWith("mailto:")
  );
  const initials = (data.name || "Portfolio")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const openResume = () => {
    setResumeOpen(true);
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const revealItems = document.querySelectorAll(
      ".portfolio [data-reveal]"
    );
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    gsap.set(revealItems, { autoAlpha: 0, y: 22 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              delay: entry.target.dataset.revealDelay === "1" ? 0.09 : 0,
              ease: "power2.out",
              clearProps: "opacity,visibility,transform",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      gsap.killTweensOf(revealItems);
      gsap.set(revealItems, { clearProps: "opacity,visibility,transform" });
    };
  }, []);

  useEffect(() => {
    if (!resumeOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setResumeOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [resumeOpen]);

  return (
    <div className="portfolio" id="top">
      <Head>
        <title>{data.name} — Portfolio</title>
        <meta
          name="description"
          content={`${data.name} — portfolio and selected work.`}
        />
        <meta name="theme-color" content="#f7f6f0" />
      </Head>

      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label={`${data.name}, top`}>
          {initials}
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-all duration-200 hover:scale-105 hover:bg-[var(--accent)] tablet:hidden"
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-30 grid gap-1 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3 shadow-xl tablet:hidden"
            aria-label="Mobile navigation"
          >
            {navigation.map(([label, id]) => (
              <a
                className="rounded-xl px-4 py-3 text-sm font-semibold !text-[var(--ink)] transition-colors hover:bg-[var(--accent)] hover:!text-[#171717]"
                key={id}
                href={`#${id}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${mounted && theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${mounted && theme === "dark" ? "light" : "dark"} mode`}
            onClick={() =>
              mounted && setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {mounted && theme === "dark" ? "☼" : "☾"}
          </button>
          <button
            className="resume-link"
            type="button"
            onClick={openResume}
          >
            Résumé <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main>
        <section
          className="hero section-shell"
          aria-labelledby="hero-title"
          data-reveal
        >
          <div className="hero-kicker">
            <span>{data.headerTaglineOne || "Hello"}</span>
            <span className="kicker-rule" />
            <span>PORTFOLIO · 2026</span>
          </div>
          <h1 id="hero-title" className="hero-name">
            {data.name}
          </h1>
          <p className="hero-intro">
            {[
              data.headerTaglineTwo,
              data.headerTaglineThree,
              data.headerTaglineFour,
            ]
              .filter(Boolean)
              .join(" ")}
          </p>
          <div className="hero-actions">
            <a className="pill-link pill-primary" href="#work">
              See the work <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </a>
            <a className="hero-note" href="#about">
              <span className="status-dot" />
              A little more about me
              <ArrowUpRight aria-hidden="true" className="note-arrow h-4 w-4" />
            </a>
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(88px,12vw,160px)]"
          id="about"
          data-reveal
        >
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 tablet:mb-16">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                01 / ABOUT
              </p>
              <h2 className="max-w-2xl font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
                A bit about me.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 items-center gap-12 tablet:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] tablet:gap-16 desktop:gap-20">
            <div className="max-w-3xl">
              <p className="max-w-[65ch] text-base leading-8 text-[var(--muted)] tablet:text-lg tablet:leading-9">
                {data.aboutpara}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <a
                  className="inline-flex items-center gap-3 border-b border-[var(--ink)] pb-1 text-sm font-bold !text-[var(--ink)] transition-colors hover:border-[var(--accent)]"
                  href="#contact"
                >
                  Let&apos;s connect
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Based in Tapaz, Capiz
                </span>
              </div>
            </div>
            <div className="relative aspect-[4/5] min-h-[260px] w-full overflow-hidden rounded-[1.75rem] border border-[var(--line)] tablet:min-h-[420px]">
              <Image
                src="/images/ashley-profile.jpg"
                alt="Ashley standing outside"
                layout="fill"
                objectFit="cover"
                objectPosition="center 40%"
              />
              <span className="absolute right-4 top-4 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Profile
              </span>
            </div>
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(88px,12vw,160px)]"
          id="skills"
          data-reveal
        >
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 tablet:mb-16">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                02 / CAPABILITIES
              </p>
              <h2 className="max-w-2xl font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
                Tools for thoughtful experiences.
              </h2>
            </div>
            <span className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
              {skillGroups.reduce((total, group) => total + group.items.length, 0)}{" "}
              skills
            </span>
          </div>
          {skillGroups.length ? (
            <div className="grid gap-4 tablet:grid-cols-3">
              {skillGroups.map((group, index) => (
                <article
                  className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper)] p-6 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_14px_35px_rgba(23,23,23,0.08)] tablet:p-8"
                  data-reveal
                  data-reveal-delay={index % 2}
                  key={group.title}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold text-[#171717]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {String(group.items.length).padStart(2, "0")} items
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {group.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold text-[var(--ink)]"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-sm text-[var(--muted)]">
              Skills will be added soon.
            </p>
          )}
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(88px,12vw,160px)]"
          id="work"
          data-reveal
        >
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 tablet:mb-16">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                03 / SELECTED WORK
              </p>
              <h2 className="max-w-2xl font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
                My selected projects.
              </h2>
            </div>
            <span className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
              {String(selectedProjects.length).padStart(2, "0")} projects
            </span>
          </div>
          <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {selectedProjects.map((project, index) => (
              <a
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper)] !text-[var(--ink)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_18px_45px_rgba(23,23,23,0.1)]"
                data-reveal
                data-reveal-delay={index % 2}
                href={project.url || "#work"}
                key={project.id}
                target={project.url ? "_blank" : undefined}
                rel={project.url ? "noreferrer" : undefined}
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden ${
                    project.imageTheme === "dark"
                      ? "bg-[#171714]"
                      : "bg-[#e8e5d9]"
                  }`}
                >
                  {project.imageSrc ? (
                    <img
                      className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                        project.imageFit === "contain"
                          ? "object-contain p-6"
                          : "object-cover"
                      }`}
                      src={project.imageSrc}
                      alt={project.title || "Project preview"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,#f4c900,#eacac1_55%,#a9ada0)]" />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-[var(--paper)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink)]">
                    Project {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--paper)] text-lg text-[var(--ink)] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-5 tablet:p-6">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em] tablet:text-3xl">
                      {project.title || "Project"}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {project.description || "Selected work"}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold transition-colors duration-200 group-hover:border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:!text-[var(--paper)]">
                    View project
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-[clamp(48px,6vw,80px)] border-t border-[var(--line)] pt-10 tablet:pt-12">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-5 tablet:mb-16">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  04 / LEARNING, DOCUMENTED
                </p>
                <h3 className="max-w-2xl font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
                  Certificates & milestones.
                </h3>
              </div>
              <span className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                {String(certificates.length || 3).padStart(2, "0")} entries
              </span>
            </div>
            <div className="grid gap-4 tablet:grid-cols-3">
              {(certificates.length
                ? certificates
                : Array.from({ length: 3 }, (_, index) => ({
                    id: `placeholder-${index}`,
                  }))
              ).map((certificate, index) => (
                <article
                  className="group overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_16px_38px_rgba(23,23,23,0.12)]"
                  data-reveal
                  data-reveal-delay={index % 2}
                  key={certificate.id || index}
                >
                  <div className="relative grid aspect-[1.42] place-items-center overflow-hidden bg-[#eeede7] dark:bg-[#22221d]">
                    {certificate.imageSrc ? (
                      <img
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        src={certificate.imageSrc}
                        alt={certificate.title || "Certificate"}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="flex flex-col items-center gap-3 text-center text-[var(--muted)]"
                        role="img"
                        aria-label={`${certificate.title || "Certificate"} image placeholder`}
                      >
                        <svg
                          className="h-12 w-12"
                          aria-hidden="true"
                          viewBox="0 0 48 48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="8" y="6" width="32" height="36" rx="3" />
                          <path d="M15 16h18M15 22h18M15 28h10" />
                          <circle cx="33" cy="34" r="5" fill="var(--accent)" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                          Add certificate image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#171717]/20 bg-[#f4c900] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#171717] shadow-sm">
                      <Award aria-hidden="true" className="h-3.5 w-3.5" />
                      Certificate · 2026
                    </span>
                    <h4 className="font-display text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                      {certificate.title || "Certificate title"}
                    </h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {[certificate.issuer, certificate.date]
                        .filter(Boolean)
                        .join(" · ") || "Add issuer and date"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(72px,10vw,128px)]"
          id="contact"
          data-reveal
        >
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[1.5rem] border border-[#171717]/10 bg-[var(--accent)] p-6 text-[#171717] tablet:p-8 desktop:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[22px] border-[#171717]/10 desktop:h-64 desktop:w-64"
            />
            <div className="relative z-10 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
                05 / LET&apos;S CONNECT
              </p>
              <div className="mt-6 flex flex-col items-center gap-6">
                <div className="max-w-3xl">
                  <h2 className="mx-auto max-w-2xl font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.08em]">
                    Have a good one in mind?
                    <br />
                    Let&apos;s make it matter.
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#171717]/75 tablet:text-base">
                    I&apos;m always happy to talk about thoughtful design,
                    accessible experiences, and creative ideas.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {emailLink && (
                    <a
                      className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 border-[#171717] bg-[#171717] px-5 text-sm font-bold !text-white shadow-[3px_3px_0_#171717] transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:!text-[#171717] hover:shadow-[5px_5px_0_#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717]"
                      href={emailLink.link}
                    >
                      Send me a note
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </a>
                  )}
                  <button
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 border-[#171717] px-5 text-sm font-bold text-[#171717] transition-colors duration-200 hover:bg-[#171717] hover:!text-white"
                    type="button"
                    onClick={openResume}
                  >
                    View résumé
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <footer className="mt-20 flex flex-col items-center gap-6 border-t border-[var(--line)] pt-8 text-center text-xs font-bold uppercase tracking-[0.09em] text-[var(--muted)]">
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-3" aria-label="Social links">
              {footerSocialLinks.map((social) => (
                <a
                  className="transition-colors hover:!text-[var(--ink)]"
                  href={social.link}
                  key={social.id}
                  target={
                    social.link.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noreferrer"
                >
                  {social.title.toLowerCase() === "email"
                    ? "Email"
                    : social.title}{" "}
                  <ArrowUpRight aria-hidden="true" className="inline h-3 w-3" />
                </a>
              ))}
            </nav>
            <span>© {new Date().getFullYear()} {data.name}</span>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:!text-[#171717]"
              type="button"
              aria-label="Back to top"
              title="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp aria-hidden="true" className="h-4 w-4" />
            </button>
          </footer>
        </section>
      </main>
      {resumeOpen && (
        <div
          className="resume-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setResumeOpen(false);
          }}
        >
          <section
            className="resume-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
          >
            <div className="resume-modal-header">
              <h2 id="resume-modal-title">Résumé</h2>
              <div className="resume-modal-actions">
                <Link href="/resume">
                  <a>Open full page</a>
                </Link>
                <button
                  className="resume-modal-close"
                  type="button"
                  aria-label="Close résumé"
                  onClick={() => setResumeOpen(false)}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </div>
            <iframe
              id="resume-preview"
              className="resume-preview"
              src="https://drive.google.com/file/d/1URfkaosQyaXDNiGOZRwnYApnb4_4nkpV/preview"
              title={`${data.name} résumé`}
              allow="autoplay"
            />
          </section>
        </div>
      )}
    </div>
  );
}
