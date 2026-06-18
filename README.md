# Fig

Manage and sync AI configurations — skills, rules, agents, and more — across every harness.

## Stack

- [Tauri v2](https://tauri.app) — native macOS shell
- [React 18](https://react.dev) + TypeScript
- [Vite 6](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)

## Prerequisites

- [Rust](https://rustup.rs) (stable)
- [Node.js](https://nodejs.org) 20+
- macOS 11+

## Development

```bash
npm install
npm run tauri:dev
```

## Build

```bash
# Current architecture
npm run tauri:build

# Universal binary (Intel + Apple Silicon)
npm run tauri:build:mac
```

Output is in `src-tauri/target/release/bundle/`.

## Releases

Releases are published to GitHub via CI. Pushing a version tag triggers a build, signs the artifacts, and creates a draft GitHub Release with a `latest.json` update manifest. The running app checks that manifest on launch and downloads updates silently in the background.

### Shipping a release

1. Bump the version in `src-tauri/tauri.conf.json` and `package.json`
2. Commit: `git commit -am "chore: bump to v1.2.0"`
3. Tag and push:
   ```bash
   git tag v1.2.0 && git push origin main --tags
   ```
4. CI builds a universal macOS binary, signs it, and opens a draft release on GitHub
5. Review the draft at https://github.com/develosigner/fig/releases, then publish it

Once published, the running app detects the new version on next launch, downloads it silently in the background, and shows a "Restart Now" toast when ready. Users can also trigger a manual check via **Fig → Check for Updates…**.

### Signing keys

The release signing key lives at `~/.tauri/fig.key` — keep it secret and backed up. Losing it means existing installs can never auto-update (they would need to download a new version manually). The public key is embedded in `src-tauri/tauri.conf.json`. The private key is stored as `TAURI_SIGNING_PRIVATE_KEY` in GitHub repository secrets and used automatically by CI.

## License

MIT
