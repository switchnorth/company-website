import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.15fr_0.7fr_0.95fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-muted">
            {siteConfig.description}
          </p>
          <ButtonLink href={siteConfig.bookingUrl} className="mt-5">
            {siteConfig.consultationCta}
          </ButtonLink>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-semibold uppercase text-deep-ink">Navigation</h2>
          <ul className="mt-4 grid gap-3 text-[15px] text-muted">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link className="focus-ring rounded-sm hover:text-brand-teal" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer services">
          <h2 className="text-sm font-semibold uppercase text-deep-ink">Services</h2>
          <ul className="mt-4 grid gap-3 text-[15px] text-muted">
            {siteConfig.serviceCategories.map((service) => (
              <li key={service.slug}>
                <Link className="focus-ring rounded-sm hover:text-brand-teal" href={`/services/${service.slug}`}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold uppercase text-deep-ink">Contact</h2>
          <dl className="mt-4 grid gap-4 text-[15px] text-muted">
            <div>
              <dt className="font-semibold text-deep-ink">Consultant</dt>
              <dd>
                {siteConfig.consultantName}, {siteConfig.consultantTitle}
              </dd>
            </div>
            <div className="flex gap-3">
              <Mail aria-hidden="true" className="mt-0.5 shrink-0 text-accent-red" size={17} />
              <div>
                <dt className="font-semibold text-deep-ink">Email</dt>
                <dd>
                  <a className="focus-ring rounded-sm hover:text-brand-teal" href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone aria-hidden="true" className="mt-0.5 shrink-0 text-accent-red" size={17} />
              <div>
                <dt className="font-semibold text-deep-ink">Phone</dt>
                <dd>
                  <a
                    className="focus-ring rounded-sm hover:text-brand-teal"
                    href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
                  >
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-accent-red" size={17} />
              <div>
                <dt className="font-semibold text-deep-ink">Office</dt>
                <dd className="whitespace-pre-line">{siteConfig.address}</dd>
              </div>
            </div>
            <div>
              <dt className="font-semibold text-deep-ink">Business hours</dt>
              <dd className="whitespace-pre-line">{siteConfig.businessHours}</dd>
            </div>
            <div>
              <dt className="font-semibold text-deep-ink">Languages</dt>
              <dd>{siteConfig.languages.join(", ")}</dd>
            </div>
            {siteConfig.socialLinks.length > 0 ? (
              <div>
                <dt className="font-semibold text-deep-ink">Social</dt>
                <dd className="flex flex-wrap gap-3">
                  {siteConfig.socialLinks.map((item) => (
                    <Link className="focus-ring rounded-sm hover:text-brand-teal" href={item.href} key={item.label}>
                      {item.label}
                    </Link>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
      <div className="border-t border-border bg-surface-soft py-5">
        <div className="container-page text-sm leading-6 text-muted">
          Website information is general information only and is not a substitute
          for individualized professional advice. No immigration outcome is
          guaranteed.
        </div>
      </div>
      <div className="border-t border-border py-5">
        <div className="container-page flex flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.businessName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="focus-ring rounded-sm hover:text-brand-teal">
              Privacy
            </Link>
            <Link href="/terms" className="focus-ring rounded-sm hover:text-brand-teal">
              Terms
            </Link>
            <Link href="/faq" className="focus-ring rounded-sm hover:text-brand-teal">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
