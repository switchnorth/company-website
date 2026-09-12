import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Logo() {
  const { logo } = siteConfig;

  return (
    <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-md">
      {logo.src ? (
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          priority
          className="h-14 w-auto object-contain md:h-16"
        />
      ) : (
        <>
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-md bg-brand-teal text-white"
          >
            <span className="h-5 w-5 border-l-2 border-t-2 border-brand-mint" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-xl font-semibold text-deep-ink">
              {siteConfig.businessName.replace(" Immigration", "")}
            </span>
            <span className="block text-xs font-semibold uppercase text-muted">
              Immigration
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
