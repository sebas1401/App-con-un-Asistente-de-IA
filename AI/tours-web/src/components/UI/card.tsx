import clsx from "clsx";

export default function Card({
  className, children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl backdrop-blur bg-white/80 dark:bg-neutral-900/70",
        "shadow-[0_10px_40px_rgba(0,0,0,.12)] border border-white/60 dark:border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
