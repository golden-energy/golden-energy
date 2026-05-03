import { useLanguage } from "./LanguageProvider";
import Link from "next/link";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div className="container footer-container">
        <div className="footer-logo">
          <h3>{t.brandName}</h3>
          <p>{t.footer.body}</p>
        </div>

        <div className="footer-links">
          <h4>{t.footer.quickLinks}</h4>

          <ul>
            <li>
              <Link href="#home">{t.nav.home}</Link>
            </li>
            <li>
              <Link href="#services">{t.nav.services}</Link>
            </li>
            <li>
              <Link href="#projects">{t.nav.projects}</Link>
            </li>
            <li>
              <Link href="#clients">{t.nav.clients}</Link>
            </li>
            <li>
              <Link href="#suppliers">{t.nav.suppliers}</Link>
            </li>
            <li>
              <Link href="#contact">{t.nav.contact}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-services">
          <h4>{t.footer.services}</h4>

          <ul>
            {t.footer.serviceItems.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div className="footer-contact">
          <h4>{t.footer.contactInfo}</h4>
          <p>{t.footer.location}</p>
          <p>{t.footer.tradeRecord}</p>
          <p>{t.footer.taxesCard}</p>
          <p>{t.footer.phoneNumber}</p>
          <p>goldenenergymm@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
