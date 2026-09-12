import { siteConfig } from "@/data/site";

export function SiteStructuredData() {
  const socialLinks = siteConfig.socialLinks
    .map((item) => item.href)
    .filter((href) => href && href !== "#");

  // Keep local business details conservative while address and credentials are demo data.
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: siteConfig.businessName,
    url: siteConfig.domain,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
    areaServed: siteConfig.serviceArea,
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      type="application/ld+json"
    />
  );
}
