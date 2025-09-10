import { useEffect, useRef } from "react";

/** Fondo reactivo al cursor (radial-gradient) */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const move = (e: MouseEvent) => {
      const x = e.clientX, y = e.clientY;
      el.style.setProperty("--x", x + "px");
      el.style.setProperty("--y", y + "px");
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* halo suave animado */}
      <div className="pointer-events-none fixed -z-10 inset-0 bg-gradient-to-br from-indigo-300/15 via-transparent to-fuchsia-300/15 dark:from-indigo-400/10 dark:to-fuchsia-400/10" />
      {/* spotlight que sigue al cursor */}
      <div
        ref={ref}
        className="pointer-events-none fixed -z-10 inset-0"
        style={{
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(99,102,241,0.20), transparent 40%)",
        }}
      />
    </>
  );
}
