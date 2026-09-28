"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import { Logo } from "@/components/layout/logo";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const serviceLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const serviceMenuItems = [
    { label: "All Services", href: "/services", icon: null },
    ...siteConfig.serviceCategories.map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
      icon: service.icon,
    })),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  function focusServiceItem(index: number) {
    serviceLinkRefs.current[index]?.focus();
  }

  function handleServicesButtonKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsServicesOpen(true);
      requestAnimationFrame(() => focusServiceItem(0));
    }

    if (event.key === "Escape") {
      setIsServicesOpen(false);
    }
  }

  function handleServiceItemKeyDown(
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    const lastIndex = serviceMenuItems.length - 1;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusServiceItem(index === lastIndex ? 0 : index + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusServiceItem(index === 0 ? lastIndex : index - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusServiceItem(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusServiceItem(lastIndex);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsServicesOpen(false);
      servicesButtonRef.current?.focus();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/92 backdrop-blur-xl">
      <div className="container-page flex min-h-[84px] items-center justify-between gap-5">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {siteConfig.navigation.map((item) =>
            item.href === "/services" ? (
              <div
                className="relative"
                key={item.href}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  type="button"
                  id="services-menu-button"
                  ref={servicesButtonRef}
                  aria-expanded={isServicesOpen}
                  aria-haspopup="menu"
                  aria-controls="services-menu"
                  onClick={() => setIsServicesOpen((current) => !current)}
                  onKeyDown={handleServicesButtonKeyDown}
                  className={`focus-ring inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-semibold transition hover:bg-brand-teal-soft hover:text-brand-teal ${
                    isActive(item.href) ? "text-brand-navy" : "text-muted"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    size={16}
                    className={`transition ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  id="services-menu"
                  role="menu"
                  aria-labelledby="services-menu-button"
                  onFocus={() => setIsServicesOpen(true)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsServicesOpen(false);
                    }
                  }}
                  className={`absolute left-0 top-full w-[340px] pt-3 transition ${
                    isServicesOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="rounded-md border border-border bg-white p-2 shadow-soft">
                    {serviceMenuItems.map((service, index) => {
                      const Icon = service.icon;

                      return (
                        <Link
                          href={service.href}
                          key={service.href}
                          role="menuitem"
                          ref={(node) => {
                            serviceLinkRefs.current[index] = node;
                          }}
                          onClick={() => setIsServicesOpen(false)}
                          onKeyDown={(event) => handleServiceItemKeyDown(event, index)}
                          className={`focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 transition hover:bg-brand-teal-soft hover:text-brand-teal ${
                            index === 0
                              ? "text-base font-semibold text-deep-ink"
                              : "text-[15px] font-medium text-muted"
                          }`}
                        >
                          {Icon ? <Icon aria-hidden="true" size={17} /> : null}
                          {service.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                className={`focus-ring rounded-md px-3 py-2 text-[15px] font-semibold transition hover:bg-brand-teal-soft hover:text-brand-teal ${
                  isActive(item.href) ? "text-brand-navy" : "text-muted"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <ButtonLink
          href={siteConfig.bookingUrl}
          className="hidden lg:inline-flex"
          size="md"
        >
          {siteConfig.consultationCta}
        </ButtonLink>
        <button
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((current) => !current)}
          className="focus-ring inline-grid size-12 place-items-center rounded-md border border-border bg-white text-deep-ink transition hover:bg-brand-teal-soft lg:hidden"
        >
          {isOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>
      {isOpen ? (
        <nav
          aria-label="Mobile primary"
          id="mobile-menu"
          className="max-h-[calc(100dvh-84px)] overflow-y-auto border-t border-border bg-white lg:hidden"
        >
          <div className="container-page grid gap-1 py-4">
            {siteConfig.navigation.map((item) => (
              <Link
                className={`focus-ring rounded-md px-3 py-3 text-base font-semibold ${
                  isActive(item.href) ? "bg-brand-teal-soft text-brand-navy" : "text-deep-ink"
                }`}
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <details className="mt-3 rounded-md border border-border bg-surface-soft">
              <summary className="focus-ring cursor-pointer rounded-md px-3 py-3 text-base font-semibold text-deep-ink">
                Service Areas
              </summary>
              <div className="grid gap-1 border-t border-border p-2">
                {siteConfig.serviceCategories.map((service) => (
                  <Link
                    className="focus-ring rounded-md px-3 py-2.5 text-base font-medium text-muted hover:bg-white hover:text-brand-teal"
                    href={`/services/${service.slug}`}
                    key={service.slug}
                    onClick={() => setIsOpen(false)}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </details>
            <ButtonLink
              className="mt-3 w-full"
              href={siteConfig.bookingUrl}
              onClick={() => setIsOpen(false)}
            >
              {siteConfig.consultationCta}
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
