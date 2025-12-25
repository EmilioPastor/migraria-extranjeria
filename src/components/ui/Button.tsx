import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
};

export default function Button({
  children,
  href,
  variant = "primary",
  type = "button",
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-8 py-4 font-medium rounded-sm transition tracking-wide";

  const styles = {
    primary:
      "bg-[var(--primary)] text-white hover:bg-[var(--primary-soft)]",
    secondary:
      "border-2 border-white text-white hover:bg-white hover:text-[var(--primary)]",
  };

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles[variant]}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
