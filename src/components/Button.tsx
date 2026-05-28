import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
  isLoading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", children, isLoading, icon, className, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-l from-gold-400 to-royal-600 text-white hover:shadow-lg hover:shadow-gold-400/30",
    secondary: "bg-white/5 backdrop-blur border border-white/10 text-white hover:bg-white/10",
    outline: "border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-dark-950",
    ghost: "text-dark-300 hover:bg-white/5",
    gold: "bg-gold-400 text-dark-950 hover:bg-gold-300 shadow-lg shadow-gold-400/30",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  return (
    <button
      className={clsx(
        "relative inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
