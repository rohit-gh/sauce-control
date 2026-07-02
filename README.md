# SauceControl

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A browser-based Git GUI client — **Git, but pleasant**. Built with **Nuxt 4** and the **Bun** runtime.

SauceControl runs as a local, desktop-style app: the browser renders the UI while a local Nitro (Bun) server does the real work — running `git`, talking to the GitHub CLI (`gh`), spawning interactive terminals, and caching state in SQLite.

## Features

- **Projects sidebar** — add and switch between multiple local repositories
- **Header** — selected project, branch dropdown (local + remote) with checkout
- **Commit history graph** — GitKraken-style lanes, nodes, and merge edges
- **Commit details** — message, author, date, parents, per-file change stats
- **Staging & commit** — stage/unstage files and commit with a message
- **Integrated terminal** — real PTY at the repo location (bottom panel)
- **GitHub setup** — install/authenticate `gh` in an embedded terminal
- **SQLite cache** — projects and settings in `~/.sauce-control/`

## Quick start

```bash
bun install
cp .env.example .env   # optional
bun run dev
```

Open the printed URL (e.g. `http://localhost:3001`). See [docs/getting-started.md](./docs/getting-started.md) for full setup and troubleshooting.

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/README.md](./docs/README.md) | Knowledge base index |
| [docs/getting-started.md](./docs/getting-started.md) | Install, run, env vars |
| [docs/architecture.md](./docs/architecture.md) | System design and constraints |
| [docs/project-map.md](./docs/project-map.md) | File index and API reference |
| [AGENTS.md](./AGENTS.md) | Quick guide for AI coding agents |
| [.cursor/rules/](./.cursor/rules/) | Cursor rules (architecture, frontend, server) |

## Requirements

- [Bun](https://bun.sh) ≥ 1.2
- `git`
- Linux with `libutil` and `setsid` (PTY)
- `gh` optional (installable from the app)

## Environment

Copy [`.env.example`](./.env.example) to `.env`. The main SauceControl variable:

| Variable | Default | Purpose |
|----------|---------|---------|
| `SAUCE_WS_PORT` | `3009` | Terminal WebSocket server port |

## Architecture (short)

- **`ssr: false`** — client-rendered SPA; server is a local API host
- **Terminal** — FFI `openpty` via `bun:ffi`; WebSocket on a dedicated Bun child process (`server/terminal-server.ts`)
- **Git** — thin wrappers over the `git` CLI in `server/utils/git.ts`

Full details: [docs/architecture.md](./docs/architecture.md)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md). Security issues: [SECURITY.md](./SECURITY.md).

## Built with Cursor

This project was created with [Cursor](https://cursor.com), the AI-powered code editor.

## License

[MIT](./LICENSE) © SauceControl Contributors
