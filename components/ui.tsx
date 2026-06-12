import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white shadow-card ${className}`}>{children}</div>
  );
}

export function SectionTitle({
  title,
  action,
  href,
}: {
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between px-1">
      <h2 className="text-[15px] font-extrabold tracking-tight text-ink-900">{title}</h2>
      {action &&
        (href ? (
          <Link href={href} className="flex items-center text-xs font-medium text-brand-600">
            {action} <ChevronRight size={14} />
          </Link>
        ) : (
          <span className="text-xs font-medium text-ink-400">{action}</span>
        ))}
    </div>
  );
}

const toneMap: Record<string, string> = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
  slate: "bg-ink-100 text-ink-600",
  rose: "bg-rose-50 text-rose-700",
  violet: "bg-violet-50 text-violet-700",
};

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneMap | string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        toneMap[tone] ?? toneMap.slate
      }`}
    >
      {children}
    </span>
  );
}

export function Avatar({
  name,
  color,
  gradient,
  image,
  size = 40,
}: {
  name: string;
  color?: string;
  gradient?: [string, string];
  image?: string;
  size?: number;
}) {
  const bg = gradient
    ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
    : color ?? "#94a3b8";
  const glow = gradient ? gradient[1] : color ?? "#94a3b8";
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white"
      style={{
        background: bg,
        width: size,
        height: size,
        fontSize: size * 0.4,
        boxShadow: `0 6px 16px -4px ${glow}80`,
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        name.slice(0, 1)
      )}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger";
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-brand-600 to-pink-500 text-white shadow-[0_6px_18px_-6px_rgba(124,58,237,0.6)] active:opacity-90",
    ghost: "bg-ink-100 text-ink-700 active:bg-ink-200",
    outline: "border border-ink-200 bg-white text-ink-700 active:bg-ink-50",
    danger: "bg-rose-500 text-white active:bg-rose-600",
  }[variant];
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
