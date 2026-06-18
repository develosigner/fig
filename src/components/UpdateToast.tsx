import { useState } from "react";
import type { Update } from "../lib/updater";
import { installAndRelaunch } from "../lib/updater";

interface Props {
  update: Update;
  onDismiss: () => void;
}

export function UpdateToast({ update, onDismiss }: Props) {
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState(false);

  const handleRestart = async () => {
    setInstalling(true);
    setError(false);
    try {
      await installAndRelaunch(update);
    } catch {
      setError(true);
      setInstalling(false);
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-300 border-t border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive">Install failed. Try again.</span>
          ) : (
            <>
              Fig{" "}
              <span className="font-medium text-foreground">
                {update.version}
              </span>{" "}
              ready to install
            </>
          )}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            disabled={installing}
          >
            Later
          </button>
          <button
            onClick={handleRestart}
            disabled={installing}
            className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {installing ? "Restarting…" : "Restart Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
