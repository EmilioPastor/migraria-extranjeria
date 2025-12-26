import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  type?: "button" | "submit";
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--primary)] text-white px-6 py-3 hover:opacity-90",
    secondary:
      "border border-[var(--primary)] text-[var(--primary)] px-6 py-3 hover:bg-[var(--primary)] hover:text-white",
    ghost:
      "text-[var(--primary)] px-6 py-3 hover:bg-gray-100",
  };

  const className = `${base} ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
