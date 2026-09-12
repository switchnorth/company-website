import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-surface-soft py-12 md:py-16">
      <Container>
        {eyebrow ? <Badge tone="brand">{eyebrow}</Badge> : null}
        <h1 className="text-balance mt-5 max-w-4xl font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.07] text-deep-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted md:text-[17px] md:leading-8">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </Container>
    </section>
  );
}
