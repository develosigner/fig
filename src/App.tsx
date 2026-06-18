import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (dark: boolean) =>
      document.documentElement.classList.toggle("dark", dark);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);

    apply(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex h-screen select-none overflow-hidden items-center justify-center bg-background">
      <img
        src="/fig-mark-light.svg"
        alt="Fig"
        className="size-20 dark:hidden"
        draggable={false}
      />
      <img
        src="/fig-mark-dark.svg"
        alt="Fig"
        className="hidden size-20 dark:block"
        draggable={false}
      />
    </div>
  );
}
