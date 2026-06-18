import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export type { Update };

export async function checkForUpdates(): Promise<Update | null> {
  try {
    return await check();
  } catch {
    return null;
  }
}

export async function downloadUpdate(
  update: Update,
  onProgress?: (pct: number) => void,
): Promise<void> {
  let downloaded = 0;
  let total = 0;

  await update.download((event) => {
    if (event.event === "Started") {
      total = event.data.contentLength ?? 0;
    } else if (event.event === "Progress") {
      downloaded += event.data.chunkLength;
      if (total > 0) onProgress?.((downloaded / total) * 100);
    }
  });
}

export async function installAndRelaunch(update: Update): Promise<void> {
  await update.install();
  await relaunch();
}
