import Link from "next/link";
import type { NavigationItem } from "@/types/site";

type BreadcrumbsProps = {
  items: NavigationItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-[15px] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link className="focus-ring rounded-sm hover:text-brand-teal" href="/">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={item.href}>
              <span aria-hidden="true">/</span>
              {isLast ? (
                <span aria-current="page" className="text-deep-ink">
                  {item.label}
                </span>
              ) : (
                <Link className="focus-ring rounded-sm hover:text-brand-teal" href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
