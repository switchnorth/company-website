import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
};

export type ServiceCategory = {
  title: string;
  slug: string;
  description: string;
  overview: string;
  audience: string[];
  process: string[];
  considerations: string[];
  relatedServices: string[];
  icon: LucideIcon;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteLogo = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
};

export type SiteConfig = {
  isDevelopmentPlaceholderData: boolean;
  businessName: string;
  domain: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  languages: string[];
  serviceArea: string;
  consultantName: string;
  consultantTitle: string;
  consultantLicense: string;
  bookingUrl: string;
  consultationCta: string;
  secondaryCta: string;
  logo: SiteLogo;
  socialLinks: SocialLink[];
  navigation: NavigationItem[];
  serviceCategories: ServiceCategory[];
};
