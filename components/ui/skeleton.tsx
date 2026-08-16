import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-sand-200/40 rounded-none", className)}
      {...props}
    />
  );
}

export { Skeleton };
