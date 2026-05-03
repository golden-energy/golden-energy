"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import {
  importantProjects,
  SuppliersImage,
  TrustedClients,
} from "@/utils/data";
import Footer from "@/components/Footer";

const serviceFloatingImages = [
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-43-59.jpg",
    alt: "Transformer cable termination work",
    rotate: -8,
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-05.jpg",
    alt: "Electrical cable reels on site",
    rotate: 7,
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-08_1.jpg",
    alt: "Kiosk being moved by forklift",
    rotate: 6,
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-09_2.jpg",
    alt: "Switchgear panels installation",
    rotate: -5,
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-18.jpg",
    alt: "Underground cable trench work",
    rotate: 4,
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-24.jpg",
    alt: "Cable reels loaded on truck",
    rotate: -4,
  },
];

const serviceSmallImages = [
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-08.jpg",
    alt: "Electrical kiosk on truck",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-09.jpg",
    alt: "Outdoor kiosk installation",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-09_1.jpg",
    alt: "Open switchgear panels",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-09_3.jpg",
    alt: "Electrical panels close up",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-18_1.jpg",
    alt: "Transformer room cables",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-19.jpg",
    alt: "Cable terminations",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-21.jpg",
    alt: "Cable trench installation",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-23.jpg",
    alt: "Kiosk equipment delivery",
  },
  {
    src: "/images/projects-floating/PHOTO-2026-05-01-02-44-23_1.jpg",
    alt: "Kiosk interior equipment",
  },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container hero-container">
          <div className="hero-text">
            <p className="subheading">{t.hero.subheading}</p>
            <h1>{t.hero.title}</h1>
            <p>{t.hero.body}</p>

            <div className="hero-buttons">
              <Link href="#projects" className="btn-primary">
                {t.hero.projects}
              </Link>

              <Link href="https://wa.me/201555630515" className="btn-secondary">
                {t.hero.contact}
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-wrapper">
              <Image
                alt="hero-section-photo"
                src="/images/working.png"
                width={600}
                height={600}
                className="hero-img"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="container stats-container">
          <div className="stat-card">
            <h2>5+</h2>
            <p>{t.stats.experience}</p>
          </div>

          <div className="stat-card">
            <h2>50+</h2>
            <p>{t.stats.completed}</p>
          </div>

          <div className="stat-card">
            <h2>30+</h2>
            <p>{t.stats.clients}</p>
          </div>

          <div className="stat-card">
            <h2>24/7</h2>
            <p>{t.stats.support}</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container services-container">
          <div className="services-floating-photos" aria-hidden="true">
            {serviceFloatingImages.map((photo, index) => (
              <motion.div
                className={`floating-service-photo floating-service-photo-${
                  index + 1
                }`}
                key={photo.src}
                initial={{ rotate: photo.rotate }}
                animate={{
                  y: [0, index % 2 === 0 ? -16 : 16, 0],
                  rotate: [
                    photo.rotate,
                    photo.rotate + (index % 2 === 0 ? 2 : -2),
                    photo.rotate,
                  ],
                }}
                transition={{
                  duration: 4.5 + index * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 72px, 120px"
                  className="floating-service-img"
                />
              </motion.div>
            ))}
          </div>

          <h2>{t.services.title}</h2>

          <div
            className="service-mini-photo-row"
            aria-label="Service photo highlights"
          >
            {serviceSmallImages.map((photo, index) => (
              <motion.div
                className="service-mini-photo"
                key={photo.src}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                whileHover={{ y: -6, scale: 1.04 }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 62px, 92px"
                  className="service-mini-img"
                />
              </motion.div>
            ))}
          </div>

          <div className="service-cards">
            {t.services.items.map((service) => (
              <div className="service-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects" id="projects">
        <div className="container featured-projects-container">
          <h2>{t.featuredProjects.title}</h2>

          <div className="project-grid">
            {importantProjects.map((important, index) => {
              const projectText = t.featuredProjects.items[index];

              return (
                <div className="project-card" key={important.id}>
                  <Image
                    src={important.url}
                    alt={important.title}
                    width={400}
                    height={400}
                  />

                  <h3>{projectText?.title || important.title}</h3>
                  <p>{projectText?.address || important.address}</p>
                </div>
              );
            })}
          </div>

          <Link
            href="/projects"
            className="btn-primary"
            style={{ display: "inline-block", marginTop: "20px" }}
          >
            {t.featuredProjects.viewAll}
          </Link>
        </div>
      </section>

      {/* Clients & Suppliers */}
      <section className="clients-suppliers" id="clients">
        <div className="container">
          <h2>{t.clients.title}</h2>

          <div className="client-logos">
            {TrustedClients.map((trusted) => (
              <Image
                key={trusted.id}
                src={trusted.url}
                alt={trusted.name}
                width={500}
                height={500}
                loading="lazy"
              />
            ))}
          </div>

          <h2 id="suppliers">{t.clients.suppliers}</h2>

          <div className="supplier-logos">
            {SuppliersImage.map((supplier) => (
              <Image
                src={supplier.url}
                alt={supplier.name}
                key={supplier.id}
                width={400}
                height={400}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Band */}
      <section className="contact-band" id="contact">
        <div className="container contact-band-container">
          <p>{t.contact.title}</p>
          <p>{t.contact.details}</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
