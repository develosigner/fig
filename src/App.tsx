import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { getVersion } from "@tauri-apps/api/app";
import { message } from "@tauri-apps/plugin-dialog";
import { checkForUpdates, downloadUpdate, type Update } from "./lib/updater";
import { UpdateToast } from "./components/UpdateToast";

type StatusMessage = "downloading" | null;

export default function App() {
  const [readyUpdate, setReadyUpdate] = useState<Update | null>(null);
  const [status, setStatus] = useState<StatusMessage>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearStatus = () => {
    clearTimeout(statusTimer.current ?? undefined);
    setStatus(null);
  };

  const setTimedStatus = (msg: StatusMessage, ms = 60_000) => {
    clearTimeout(statusTimer.current ?? undefined);
    setStatus(msg);
    statusTimer.current = setTimeout(() => setStatus(null), ms);
  };

  const runUpdateCheck = async (manual: boolean) => {
    const update = await checkForUpdates();

    if (!update) {
      if (manual) {
        clearStatus();
        const version = await getVersion();
        await message(`Version ${version} is the latest version.`, {
          title: "Fig is up to date!",
          kind: "info",
        });
      }
      return;
    }

    // Already downloaded and waiting — just surface the toast
    if (readyUpdate) {
      clearStatus();
      return;
    }

    if (manual) setTimedStatus("downloading");

    await downloadUpdate(update);
    clearStatus();
    setReadyUpdate(update);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (dark: boolean) =>
      document.documentElement.classList.toggle("dark", dark);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    apply(mq.matches);
    mq.addEventListener("change", onChange);

    // Background check + download on launch (fully silent)
    runUpdateCheck(false);

    const unlistenPromise = listen("menu-check-for-updates", () =>
      runUpdateCheck(true),
    );

    return () => {
      mq.removeEventListener("change", onChange);
      clearStatus();
      unlistenPromise.then((fn) => fn());
    };
  }, []);

  const statusLabel: Record<NonNullable<StatusMessage>, string> = {
    downloading: "Downloading update…",
  };

  return (
    <div className="flex h-screen select-none overflow-hidden flex-col bg-background">
      <div className="flex flex-1 items-center justify-center relative">
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
        {status && (
          <span className="absolute bottom-6 left-0 right-0 text-center text-xs text-muted-foreground animate-in fade-in duration-200">
            {statusLabel[status]}
          </span>
        )}
      </div>
      {readyUpdate && (
        <UpdateToast
          update={readyUpdate}
          onDismiss={() => setReadyUpdate(null)}
        />
      )}
    </div>
  );
}
