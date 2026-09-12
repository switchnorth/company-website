import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageLayout } from "@/components/sections/service-page-layout";
import { getServiceCategory, siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return siteConfig.serviceCategories.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceCategory(slug);

  if (!service) {
    return {};
  }

  return createPageMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceCategory(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = service.relatedServices
    .map((relatedSlug) => getServiceCategory(relatedSlug))
    .filter((relatedService) => relatedService !== undefined);

  return <ServicePageLayout service={service} relatedServices={relatedServices} />;
}
