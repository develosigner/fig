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

## License

MIT
