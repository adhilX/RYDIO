import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends ComponentPropsWithoutRef<"div"> {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "default" | "light" | "primary" | "secondary";
}

export function Spinner({
    className,
    size = "md",
    variant = "default",
    ...props
}: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-2",
        lg: "h-12 w-12 border-[3px]",
        xl: "h-16 w-16 border-4"
    };

    const variantClasses = {
        default: "border-gray-200 border-t-gray-800",
        light: "border-white/20 border-t-white",
        primary: "border-blue-200 border-t-blue-600",
        secondary: "border-[#c8a45c]/30 border-t-[#c8a45c]" // Gold variant matching luxury theme
    };

    return (
        <div
            className={cn(
                "animate-spin rounded-full",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            role="status"
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}
