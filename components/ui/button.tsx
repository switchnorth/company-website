import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "light"
  | "outlineOnDark";
type ButtonSize = "sm" | "md" | "lg";

type ButtonColorVars = CSSProperties & {
  "--button-bg": string;
  "--button-fg": string;
  "--button-border": string;
  "--button-hover-bg": string;
  "--button-hover-fg": string;
  "--button-hover-border": string;
  "--button-active-bg": string;
  "--button-active-fg": string;
  "--button-active-border": string;
  "--button-disabled-bg": string;
  "--button-disabled-fg": string;
  "--button-disabled-border": string;
};

const disabledVars = {
  "--button-disabled-bg": "#e2e8ee",
  "--button-disabled-fg": "#526173",
  "--button-disabled-border": "#d7e1e7",
} satisfies Pick<
  ButtonColorVars,
  "--button-disabled-bg" | "--button-disabled-fg" | "--button-disabled-border"
>;

const colorVars: Record<ButtonVariant, ButtonColorVars> = {
  primary: {
    "--button-bg": "#172a50",
    "--button-fg": "#ffffff",
    "--button-border": "#172a50",
    "--button-hover-bg": "#0b1730",
    "--button-hover-fg": "#ffffff",
    "--button-hover-border": "#0b1730",
    "--button-active-bg": "#0b1730",
    "--button-active-fg": "#ffffff",
    "--button-active-border": "#0b1730",
    ...disabledVars,
  },
  secondary: {
    "--button-bg": "#ffffff",
    "--button-fg": "#172a50",
    "--button-border": "#172a50",
    "--button-hover-bg": "#e6f5f8",
    "--button-hover-fg": "#0b1730",
    "--button-hover-border": "#0f7894",
    "--button-active-bg": "#d7eef4",
    "--button-active-fg": "#0b1730",
    "--button-active-border": "#0f7894",
    ...disabledVars,
  },
  outline: {
    "--button-bg": "#ffffff",
    "--button-fg": "#0b1730",
    "--button-border": "#d7e1e7",
    "--button-hover-bg": "#e6f5f8",
    "--button-hover-fg": "#172a50",
    "--button-hover-border": "#0f7894",
    "--button-active-bg": "#d7eef4",
    "--button-active-fg": "#172a50",
    "--button-active-border": "#0f7894",
    ...disabledVars,
  },
  ghost: {
    "--button-bg": "transparent",
    "--button-fg": "#0b1730",
    "--button-border": "transparent",
    "--button-hover-bg": "#e6f5f8",
    "--button-hover-fg": "#172a50",
    "--button-hover-border": "transparent",
    "--button-active-bg": "#d7eef4",
    "--button-active-fg": "#172a50",
    "--button-active-border": "transparent",
    ...disabledVars,
  },
  light: {
    "--button-bg": "#ffffff",
    "--button-fg": "#172a50",
    "--button-border": "#ffffff",
    "--button-hover-bg": "#f1f7f9",
    "--button-hover-fg": "#0b1730",
    "--button-hover-border": "#f1f7f9",
    "--button-active-bg": "#e6f5f8",
    "--button-active-fg": "#0b1730",
    "--button-active-border": "#e6f5f8",
    ...disabledVars,
  },
  outlineOnDark: {
    "--button-bg": "transparent",
    "--button-fg": "#ffffff",
    "--button-border": "rgba(255, 255, 255, 0.64)",
    "--button-hover-bg": "#ffffff",
    "--button-hover-fg": "#172a50",
    "--button-hover-border": "#ffffff",
    "--button-active-bg": "#f1f7f9",
    "--button-active-fg": "#0b1730",
    "--button-active-border": "#f1f7f9",
    "--button-disabled-bg": "transparent",
    "--button-disabled-fg": "rgba(255, 255, 255, 0.62)",
    "--button-disabled-border": "rgba(255, 255, 255, 0.28)",
  },
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "button-control border shadow-sm hover:shadow-md active:translate-y-px disabled:cursor-not-allowed disabled:shadow-none",
  secondary:
    "button-control border shadow-sm hover:shadow-md active:translate-y-px disabled:cursor-not-allowed disabled:shadow-none",
  outline:
    "button-control border shadow-sm active:translate-y-px disabled:cursor-not-allowed disabled:shadow-none",
  ghost:
    "button-control border active:translate-y-px disabled:cursor-not-allowed",
  light:
    "button-control border shadow-sm hover:shadow-md active:translate-y-px disabled:cursor-not-allowed disabled:shadow-none",
  outlineOnDark:
    "button-control border shadow-sm active:translate-y-px disabled:cursor-not-allowed disabled:shadow-none",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-[15px]",
  lg: "min-h-12 px-5 py-3 text-base",
};

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-md font-semibold leading-none transition duration-200";

function getButtonStyle(
  variant: ButtonVariant,
  style: CSSProperties | undefined,
) {
  return { ...colorVars[variant], ...style };
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      style={getButtonStyle(variant, style)}
      type="button"
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  style,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      style={getButtonStyle(variant, style)}
      {...props}
    />
  );
}
