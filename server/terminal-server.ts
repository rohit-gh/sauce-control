/**
 * Standalone interactive-terminal WebSocket server.
 *
 * Runs as its own pure-Bun process (spawned by the Nitro plugin). Bun.serve's
 * native WebSocket accept loop only works in a genuine Bun event loop, so it
 * cannot live inside Nitro's node-compat HTTP server — hence this separate
 * process. Communicates the same JSON protocol used by the XTerm client.
 */
import { Pty } from './utils/pty'

interface WsData {
  pty: Pty | null
}

const WS_PORT = Number(process.env.SAUCE_WS_PORT || 3009)

function startServer() {
  return Bun.serve<WsData, undefined>({
    port: WS_PORT,
    idleTimeout: 255,
    fetch(req, srv) {
      if (srv.upgrade(req, { data: { pty: null } })) return
      return new Response('SauceControl terminal server', { status: 426 })
    },
    websocket: {
      open(ws) {
        ws.send(JSON.stringify({ type: 'ready' }))
      },
      message(ws, raw) {
        let msg: any
        try {
          msg = JSON.parse(typeof raw === 'string' ? raw : raw.toString())
        } catch {
          return
        }

        if (msg.type === 'init') {
          if (ws.data.pty) return
          try {
            const pty = new Pty({ cwd: msg.cwd, cols: msg.cols || 80, rows: msg.rows || 24 })
            pty.onData((data) => {
              try {
                ws.send(JSON.stringify({ type: 'data', data }))
              } catch {}
            })
            pty.onExit(() => {
              try {
                ws.send(JSON.stringify({ type: 'exit' }))
              } catch {}
            })
            ws.data.pty = pty
          } catch (err: any) {
            ws.send(JSON.stringify({ type: 'error', message: err?.message || 'Failed to open terminal' }))
          }
        } else if (msg.type === 'input') {
          ws.data.pty?.write(msg.data)
        } else if (msg.type === 'resize') {
          ws.data.pty?.resize(msg.cols, msg.rows)
        }
      },
      close(ws) {
        ws.data.pty?.dispose()
        ws.data.pty = null
      },
    },
  })
}

try {
  startServer()
  console.log(`[SauceControl] terminal websocket server listening on :${WS_PORT}`)
} catch (err: any) {
  // Another instance already owns the port (e.g. a dev hot-reload). Bow out quietly.
  if (err?.code === 'EADDRINUSE') process.exit(0)
  throw err
}
