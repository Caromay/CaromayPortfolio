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

function getSkills(resume) {
  return [
    ...(resume.languages || []),
    ...(resume.frameworks || []),
    ...(resume.others || []),
  ];
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
  const skills = useMemo(() => getSkills(data.resume || {}), []);
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

        <section className="content-section section-shell" id="about" data-reveal>
          <div className="section-heading">
            <span className="section-index">01 / ABOUT</span>
            <h2>A bit about me.</h2>
          </div>
          <div className="about-layout">
            <div className="about-copy">
              <p>{data.aboutpara}</p>
              <a className="text-link" href="#contact">
                Get in touch <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div
              className="about-image-slot"
              role="img"
              aria-label="Profile image placeholder"
            />
          </div>
        </section>

        <section className="content-section section-shell" id="skills" data-reveal>
          <div className="section-heading">
            <span className="section-index">02 / SKILLS</span>
            <h2>Things I work with.</h2>
          </div>
          <div className="skills-list">
            {skills.length ? (
              skills.map((skill, index) => (
                <span className="skill-chip" key={`${skill}-${index}`}>
                  <span className="skill-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {skill}
                </span>
              ))
            ) : (
              <p className="empty-note">Skills will be added soon.</p>
            )}
          </div>
        </section>

        <section
          className="content-section section-shell"
          id="experience"
          data-reveal
        >
          <div className="section-heading">
            <span className="section-index">03 / EXPERIENCE</span>
            <h2>Where I&apos;ve been.</h2>
          </div>
          <div className="experience-list">
            {(data.resume?.experiences || []).map((experience) => (
              <article className="experience-item" key={experience.id}>
                <div className="experience-date">
                  <span>{experience.dates}</span>
                  <span>{experience.type}</span>
                </div>
                <div className="experience-detail">
                  <h3>{experience.position}</h3>
                  <ul>
                    {getBullets(experience.bullets).map((bullet, index) => (
                      <li key={`${experience.id}-${index}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <span className="experience-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section section-shell" id="work" data-reveal>
          <div className="section-heading work-heading">
            <div>
              <span className="section-index">04 / SELECTED WORK</span>
              <h2>Some things I&apos;ve made.</h2>
            </div>
            <span className="work-count">
              {(data.projects || []).length.toString().padStart(2, "0")} PROJECTS
            </span>
          </div>
          <div className="project-grid">
            {(data.projects || []).map((project, index) => (
              <a
                className="project-card"
                data-reveal
                data-reveal-delay={index % 2}
                href={project.url || "#work"}
                key={project.id}
                target={project.url ? "_blank" : undefined}
                rel={project.url ? "noreferrer" : undefined}
              >
                <div className="project-image">
                  {project.imageSrc ? (
                    <img src={project.imageSrc} alt="" loading="lazy" />
                  ) : (
                    <div className="project-image-placeholder" />
                  )}
                  <span className="project-open" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="project-caption">
                  <span className="project-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{project.title || "Project"}</h3>
                    <p>{project.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div
            className="work-certificates"
            aria-labelledby="work-certificates-title"
          >
            <div className="certificates-heading">
              <div>
                <span className="section-index">CERTIFICATES</span>
                <h3 id="work-certificates-title">Learning, documented.</h3>
              </div>
              <span className="work-count">
                {String(certificates.length || 3).padStart(2, "0")} SLOTS
              </span>
            </div>
            <div className="certificate-grid">
              {(certificates.length
                ? certificates
                : Array.from({ length: 3 }, (_, index) => ({
                    id: `placeholder-${index}`,
                  }))
              ).map((certificate, index) => (
                <article
                  className="certificate-card"
                  data-reveal
                  data-reveal-delay={index % 2}
                  key={certificate.id || index}
                >
                  <div
                    className="certificate-image-slot"
                    role={certificate.imageSrc ? undefined : "img"}
                    aria-label={
                      certificate.imageSrc
                        ? undefined
                        : `${certificate.title || "Certificate"} image placeholder`
                    }
                  >
                    {certificate.imageSrc && (
                      <img
                        src={certificate.imageSrc}
                        alt={certificate.title || "Certificate"}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <h3>{certificate.title || "Certificate title"}</h3>
                  <p>
                    {[certificate.issuer, certificate.date]
                      .filter(Boolean)
                      .join(" · ") || "Add issuer and date"}
                  </p>
                </article>
              ))}
            </div>
            {!certificates.length && (
              <p className="certificate-help">
                Add certificate details and image paths in{" "}
                <code>data/certificates.json</code>.
              </p>
            )}
          </div>
        </section>

        <section
          className="contact-section section-shell"
          id="contact"
          data-reveal
        >
          <span className="section-index">05 / CONTACT</span>
          <p className="contact-eyebrow">HAVE A GOOD ONE IN MIND?</p>
          <h2>Let&apos;s make<br />something matter.</h2>
          <button
            className="pill-link pill-primary contact-link"
            type="button"
            onClick={openResume}
          >
            View résumé <span aria-hidden="true">↗</span>
          </button>
          <div className="contact-bottom">
            <span>{data.name}</span>
            <div className="social-links">
              {data.socials.map((social) => (
                <a
                  href={social.link}
                  key={social.id}
                  target={
                    social.link.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noreferrer"
                >
                  {social.title.toLowerCase() === "email"
                    ? "Gmail"
                    : social.title.toLowerCase() === "github"
                    ? "GitHub"
                    : social.title}{" "}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <a href="#top">BACK TO TOP ↑</a>
          </div>
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
