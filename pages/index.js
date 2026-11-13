import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import certificates from "../data/certificates.json";
import data from "../data/portfolio.json";

const navigation = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Experience", "experience"],
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

function getBullets(bullets) {
  if (Array.isArray(bullets)) return bullets;
  if (typeof bullets === "string") {
    return bullets.split(",").map((bullet) => bullet.trim()).filter(Boolean);
  }
  return [];
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const skillGroups = useMemo(
    () => getSkillGroups(data.resume || {}),
    []
  );
  const socialLinks = data.socials || [];
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
    setResumeLoaded(false);
    setResumeOpen(true);
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const revealItems = document.querySelectorAll(
      ".portfolio [data-reveal]"
    );
    if (!window.IntersectionObserver) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
    document.documentElement.classList.add("motion-ready");

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
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
          content={`${data.name} — portfolio, selected work, and experience.`}
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
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-colors hover:bg-[var(--accent)] tablet:hidden"
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            {mobileMenuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
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
            Résumé <span aria-hidden="true">↗</span>
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
              See the work <span aria-hidden="true">→</span>
            </a>
            <a className="hero-note" href="#about">
              <span className="status-dot" />
              A little more about me <span className="note-arrow">↗</span>
            </a>
          </div>
          <div className="hero-bottomline">
            <span>SCROLL TO EXPLORE</span>
            <span aria-hidden="true">↓</span>
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(88px,12vw,160px)]"
          id="about"
          data-reveal
        >
          <div className="mb-16 grid gap-5 tablet:mb-20 tablet:grid-cols-[minmax(160px,0.36fr)_1fr]">
            <span className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              01 / ABOUT
            </span>
            <h2 className="max-w-[690px] font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
              A bit about me.
            </h2>
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
                  Let&apos;s connect <span aria-hidden="true">↗</span>
                </a>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Based in Tapaz, Capiz
                </span>
              </div>
            </div>
            <div
              className="relative grid aspect-[4/5] min-h-[260px] w-full place-items-center overflow-hidden rounded-[1.75rem] border border-dashed border-[var(--line)] bg-[#ecebe4] tablet:min-h-[420px] dark:bg-[#22221d]"
              role="img"
              aria-label="Photo placeholder. Add your picture here."
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <svg
                  aria-hidden="true"
                  className="h-28 w-28 text-[#b8b5a9] dark:text-[#55554e]"
                  viewBox="0 0 120 120"
                  fill="currentColor"
                >
                  <circle cx="60" cy="40" r="22" />
                  <path d="M20 112c3-23 18-39 40-39s37 16 40 39H20Z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#65645e] dark:text-[#b6b4aa]">
                  Your photo here
                </span>
              </div>
              <span className="absolute right-4 top-4 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Profile
              </span>
            </div>
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(72px,10vw,128px)]"
          id="skills"
          data-reveal
        >
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
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
          id="experience"
          data-reveal
        >
          <div className="mb-16 grid gap-5 tablet:mb-20 tablet:grid-cols-[minmax(160px,0.36fr)_1fr]">
            <span className="pt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              03 / EXPERIENCE
            </span>
            <div>
              <h2 className="max-w-[690px] font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
                A path built by curiosity.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)] tablet:text-base">
                A few of the roles and projects that have shaped how I work.
              </p>
            </div>
          </div>
          <div className="grid gap-5 tablet:gap-6">
            {(data.resume?.experiences || []).length ? (
              data.resume.experiences.map((experience, index) => (
                <article
                  className="group grid gap-8 rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper)] p-7 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_14px_35px_rgba(23,23,23,0.07)] tablet:grid-cols-[220px_minmax(0,1fr)] tablet:gap-10 tablet:p-10 desktop:grid-cols-[260px_minmax(0,1fr)] desktop:p-12"
                  data-reveal
                  data-reveal-delay={index % 2}
                  key={experience.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 tablet:flex-col tablet:items-start">
                    <span className="rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-bold text-[#171717]">
                      {experience.dates}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {experience.type}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-[var(--ink)] tablet:text-2xl">
                        {experience.position}
                      </h3>
                      <span
                        className="text-lg text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>
                    <ul className="mt-6 max-w-3xl space-y-3 text-sm leading-7 text-[var(--muted)] tablet:text-base tablet:leading-8">
                      {getBullets(experience.bullets).map((bullet, bulletIndex) => (
                        <li
                          className="flex gap-3"
                          key={`${experience.id}-${bulletIndex}`}
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--line)] p-6 text-sm text-[var(--muted)]">
                Experience details will be added soon.
              </p>
            )}
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(88px,12vw,160px)]"
          id="work"
          data-reveal
        >
          <div className="mb-16 flex flex-wrap items-end justify-between gap-6 tablet:mb-20">
            <div>
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                04 / SELECTED WORK
              </p>
              <h2 className="max-w-2xl font-display text-4xl font-medium leading-[0.98] tracking-[-0.075em] tablet:text-6xl">
                A few things I&apos;ve made.
              </h2>
            </div>
            <span className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
              {String((data.projects || []).length).padStart(2, "0")} projects
            </span>
          </div>
          <div className="grid gap-7 tablet:grid-cols-2 tablet:gap-8">
            {(data.projects || []).map((project, index) => {
              const featured = index === 0;
              return (
                <a
                  className={`group overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper)] !text-[var(--ink)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_18px_45px_rgba(23,23,23,0.1)] ${
                    featured
                      ? "tablet:col-span-2 tablet:grid tablet:grid-cols-[1.15fr_0.85fr]"
                      : ""
                  }`}
                  data-reveal
                  data-reveal-delay={index % 2}
                  href={project.url || "#work"}
                  key={project.id}
                  target={project.url ? "_blank" : undefined}
                  rel={project.url ? "noreferrer" : undefined}
                >
                  <div
                    className={`relative overflow-hidden bg-[#e8e5d9] ${
                      featured
                        ? "aspect-[16/10] tablet:aspect-auto tablet:min-h-[420px]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    {project.imageSrc ? (
                      <img
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                      ↗
                    </span>
                  </div>
                  <div className="flex flex-col justify-between gap-10 p-7 tablet:p-10 desktop:p-12">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                        {project.description || "Selected work"}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] tablet:text-3xl">
                        {project.title || "Project"}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                      View project
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-[clamp(88px,11vw,140px)] border-t border-[var(--line)] pt-10 tablet:pt-12">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  LEARNING, DOCUMENTED
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.06em] text-[var(--ink)] tablet:text-4xl">
                  Certificates & milestones.
                </h3>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
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
                  className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--paper)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-lg"
                  data-reveal
                  data-reveal-delay={index % 2}
                  key={certificate.id || index}
                >
                  <div className="relative grid aspect-[1.42] place-items-center overflow-hidden bg-[#eeede7] dark:bg-[#22221d]">
                    {certificate.imageSrc ? (
                      <img
                        className="h-full w-full object-cover"
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
            {!certificates.length && (
              <p className="mt-5 text-xs leading-5 text-[var(--muted)]">
                Add certificate details and image paths in{" "}
                <code className="font-semibold text-[var(--ink)]">
                  data/certificates.json
                </code>
                .
              </p>
            )}
          </div>
        </section>

        <section
          className="section-shell scroll-mt-[78px] border-t border-[var(--line)] py-[clamp(72px,10vw,128px)]"
          id="contact"
          data-reveal
        >
          <div className="rounded-[2rem] border border-[#171717]/10 bg-[var(--accent)] p-8 text-[#171717] tablet:p-12 desktop:p-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
              05 / LET&apos;S CONNECT
            </p>
            <div className="mt-8 grid gap-8 tablet:grid-cols-[1fr_auto] tablet:items-end">
              <div>
                <h2 className="max-w-3xl font-display text-[clamp(2.5rem,6.4vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.08em]">
                  Have a good one in mind?
                  <br />
                  Let&apos;s make it matter.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-[#171717]/75 tablet:text-base">
                  I&apos;m always happy to talk about thoughtful design,
                  accessible experiences, and creative ideas.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 tablet:justify-end">
                {emailLink && (
                  <a
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 border-[#171717] bg-[#171717] px-5 text-sm font-bold !text-white transition-transform duration-200 hover:-translate-y-0.5"
                    href={emailLink.link}
                  >
                    Send me a note <span aria-hidden="true">↗</span>
                  </a>
                )}
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 border-[#171717] px-5 text-sm font-bold text-[#171717] transition-colors duration-200 hover:bg-[#171717] hover:!text-white"
                  type="button"
                  onClick={openResume}
                >
                  View résumé <span aria-hidden="true">↗</span>
                </button>
              </div>
            </div>
          </div>
          <footer className="mt-8 flex flex-col gap-6 border-t border-[var(--line)] pt-6 text-xs font-bold uppercase tracking-[0.09em] text-[var(--muted)] tablet:flex-row tablet:items-center tablet:justify-between">
            <span>© {new Date().getFullYear()} {data.name}</span>
            <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Social links">
              {socialLinks.map((social) => (
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
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
            <a
              className="self-start !text-[var(--ink)] transition-colors hover:!text-[var(--accent)] tablet:self-auto"
              href="#top"
            >
              Back to top ↑
            </a>
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
                <a href="/resume" target="_blank" rel="noreferrer">
                  Open full page
                </a>
                <button
                  type="button"
                  disabled={!resumeLoaded}
                  onClick={() =>
                    document
                      .getElementById("resume-preview")
                      ?.contentWindow?.print()
                  }
                >
                  Download / Save as PDF
                </button>
                <button
                  className="resume-modal-close"
                  type="button"
                  aria-label="Close résumé"
                  onClick={() => setResumeOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <iframe
              id="resume-preview"
              className="resume-preview"
              src="/resume"
              title={`${data.name} résumé`}
              onLoad={() => setResumeLoaded(true)}
            />
          </section>
        </div>
      )}
    </div>
  );
}
