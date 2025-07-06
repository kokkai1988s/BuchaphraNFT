import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="BuchaPhra.com Logo"
      className={cn("h-8 w-8 text-primary", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12,2 A10,10 0 0,1 22,12"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.5"
      />
      <path
        d="M12,22 A10,10 0 0,1 2,12"
        stroke="hsl(var(--primary))"
      />
      <path
        d="M2,12 A10,10 0 0,1 12,2"
        stroke="hsl(var(--primary))"
      />
      <path
        d="M22,12 A10,10 0 0,1 12,22"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.5"
      />
      <path
        d="M12 12 m -3, 0 a 3,3 0 1,0 6,0 a 3,3 0 1,0 -6,0"
        fill="hsl(var(--accent))"
        stroke="none"
      />
      <path
        d="M12 12 m -1.5, 0 a 1.5,1.5 0 1,0 3,0 a 1.5,1.5 0 1,0 -3,0"
        fill="hsl(var(--background))"
        stroke="none"
      />
    </svg>
  );
}
