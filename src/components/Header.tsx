"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t, toggleLanguage } = useLanguage();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const routes: { id: number; name: string; href: string }[] = [
    { id: 1, name: t.nav.home, href: "/" },
    { id: 2, name: t.nav.services, href: "/#services" },
    { id: 3, name: t.nav.projects, href: "/#projects" },
    { id: 4, name: t.nav.clients, href: "/#clients" },
    { id: 5, name: t.nav.suppliers, href: "/#suppliers" },
    { id: 6, name: t.nav.contact, href: "/#contact" },
  ];

  return (
    <header>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Logo */}
        <div className="logo">
          <Image
            src="/images/logo/logo.png"
            alt="Logo"
            width={300}
            height={100}
          />
        </div>

        {/* Desktop Nav */}
        <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
          <ul>
            {routes.map((route) => {
              return (
                <li key={route.id} onClick={() => closeMenu()}>
                  <Link href={route.href}>{route.name}</Link>
                </li>
              );
            })}
          </ul>
          <Link href="#contact" className="quote-btn" onClick={closeMenu}>
            {t.nav.quote}
          </Link>
          <button
            type="button"
            className="language-toggle"
            onClick={() => {
              toggleLanguage();
              closeMenu();
            }}
            aria-label={t.languageLabel}
          >
            {t.languageToggle}
          </button>
        </nav>

        {/* Overlay */}
        <div
          className={`nav-overlay ${isOpen ? "open" : ""}`}
          onClick={closeMenu}
        />

        {/* Hamburger */}
        <button
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={language === "ar" ? "فتح القائمة" : "Toggle menu"}
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
