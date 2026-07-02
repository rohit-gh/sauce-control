# SauceControl knowledge base

Quick navigation for humans and AI agents. Prefer these docs over re-scanning the whole repo.

| Doc | Purpose |
|-----|---------|
| [Getting started](./getting-started.md) | Install, run, env vars, first-use |
| [Architecture](./architecture.md) | System design, data flow, key constraints |
| [Project map](./project-map.md) | File/folder index with responsibilities |

## One-liner

**SauceControl** = local Nuxt 4 SPA + Bun Nitro API that wraps `git`/`gh`, with a real PTY terminal and SQLite project cache.

## Ports (defaults)

| Service | Port | Notes |
|---------|------|-------|
| Nuxt dev / Nitro HTTP | `3000` or next free (e.g. `3001`) | UI + REST API |
| Terminal WebSocket | `3009` | `SAUCE_WS_PORT` — separate Bun child process |

## User data (not in repo)

```
~/.sauce-control/
  sauce-control.sqlite    # projects, settings, cache
```

## Related

- Root [README](../README.md) — overview and feature list
- [.env.example](../.env.example) — environment variables
- [.cursor/rules/](../.cursor/rules/) — concise agent rules (token-efficient)
