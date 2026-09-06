import Link from "next/link";
import type { ReactNode } from "react";

type PillButtonProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "solid" | "outline";
  id?: string;
  className?: string;
  external?: boolean;
};

export function PillButton({
  href,
  children,
  icon,
  variant = "solid",
  id,
  external = false,
  className = "",
}: PillButtonProps) {
  const solid =
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_20px_45px_-15px_rgba(255,255,255,0.35)] transition-transform duration-300 hover:-translate-y-0.5";
  const outline =
    "group inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-cream transition-all duration-300 hover:border-emerald-400/60 hover:bg-white/10";

  const content = (
    <>
      {variant === "solid" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-amber-300 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
      )}
      <span className="relative z-10">{children}</span>
      {icon && <span className="relative z-10">{icon}</span>}
    </>
  );

  if (external) {
    return (
      <a
        id={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${variant === "solid" ? solid : outline} ${className}`}
      >
        {content}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a id={id} href={href} className={`${variant === "solid" ? solid : outline} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <Link id={id} href={href} className={`${variant === "solid" ? solid : outline} ${className}`}>
      {content}
    </Link>
  );
}
