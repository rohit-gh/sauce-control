# Getting started

## Requirements

| Tool | Version | Why |
|------|---------|-----|
| [Bun](https://bun.sh) | ≥ 1.2 | Runtime, package manager, `bun:sqlite`, `bun:ffi` |
| `git` | any recent | All repository operations |
| `gh` | optional | GitHub auth/setup (installable from in-app modal) |
| Linux | `libutil`, `setsid` | PTY allocation and job control |

> **Important:** SauceControl must run under the **Bun runtime**, not Node. Plain `nuxt dev` under Node will fail on `bun:sqlite` / `bun:ffi`.

## Install

```bash
git clone <your-repo-url>
cd sauce-control
bun install
cp .env.example .env   # optional — defaults work for local dev
```

## Run (development)

```bash
bun run dev
```

This runs `bun --bun nuxt dev`. Open the URL printed in the terminal (often `http://localhost:3000` or `http://localhost:3001` if 3000 is taken).

A **terminal WebSocket server** starts automatically on port `3009` (see `SAUCE_WS_PORT`).

### If another Nuxt dev is stuck

```bash
NUXT_IGNORE_LOCK=1 bun run dev
```

## Run (production preview)

```bash
bun run build
bun run preview
```

Ensure the terminal child process can start (Bun available, port `3009` free).

## Package as a Linux app (AppImage)

SauceControl can be shipped as a single self-contained **AppImage** that bundles
the Bun runtime and the built app, so users run it like any native Linux program
(double-click, or from a launcher) with no install step.

```bash
bun run build:appimage
```

This produces `release/SauceControl-x86_64.AppImage`. To run it:

```bash
chmod +x release/SauceControl-x86_64.AppImage
./release/SauceControl-x86_64.AppImage
```

What it does on launch (`scripts/appimage/launcher.ts`):

1. Picks free ports for the Nitro HTTP server and the terminal WebSocket server.
2. Starts the server with the bundled Bun runtime.
3. Opens the UI in a dedicated app window (a Chromium-family browser via
   `--app`, so it looks like a standalone program), falling back to the system
   default browser. Closing the window quits the app.

Notes:

- **Host requirements**: `git` (and optionally `gh`) must be installed on the
  machine — these are not bundled. Data still lives in `~/.sauce-control/`.
- **Bundled Bun**: the build copies the Bun binary found on your `PATH`.
- **appimagetool** is downloaded once to `release/.tools/` on first build
  (needs network access).
- Run on a machine without FUSE with
  `./release/SauceControl-x86_64.AppImage --appimage-extract-and-run`.

## First use

1. Open the app in your browser.
2. Click **＋** in the sidebar → paste an **absolute path** to a local git repo.
3. Explore commit history, stage changes, commit from the right panel.
4. **Terminal** (header) opens a shell at the repo root.
5. **GitHub Setup** (sidebar) runs `gh auth login` in an embedded terminal.

## Environment

Copy `.env.example` to `.env` and adjust as needed. Only `SAUCE_WS_PORT` is SauceControl-specific today; other vars are standard Nuxt/Bun tooling.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `bun:sqlite` / `bun:ffi` protocol error | Run with `bun --bun` (`bun run dev`) |
| Terminal won't connect | Check port `3009` is free; see `pgrep -af terminal-server` |
| Orphan terminal on `3009` after crash | `kill` the `terminal-server.ts` process, restart dev |
| Git command fails | Repo path must exist and be inside a git work tree |
