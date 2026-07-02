import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { access } from 'node:fs/promises'

const execFileAsync = promisify(execFile)

async function which(cmd: string): Promise<boolean> {
  try {
    await execFileAsync('which', [cmd])
    return true
  } catch {
    return false
  }
}

/** Open a native folder picker dialog. Returns the chosen path or null if cancelled. */
export async function pickFolder(): Promise<string | null> {
  const start = process.env.HOME || '/'

  if (process.platform === 'darwin') {
    const script = `POSIX path of (choose folder with prompt "Select a git repository")`
    try {
      const { stdout } = await execFileAsync('osascript', ['-e', script])
      const p = stdout.trim()
      return p || null
    } catch {
      return null
    }
  }

  if (process.platform === 'win32') {
    const ps = [
      'Add-Type -AssemblyName System.Windows.Forms',
      '$d = New-Object System.Windows.Forms.FolderBrowserDialog',
      '$d.Description = "Select a git repository"',
      'if ($d.ShowDialog() -eq "OK") { $d.SelectedPath }',
    ].join('; ')
    try {
      const { stdout } = await execFileAsync('powershell', ['-NoProfile', '-Command', ps])
      const p = stdout.trim()
      return p || null
    } catch {
      return null
    }
  }

  // Linux and other Unix: try common dialog tools.
  const candidates: [string, string[]][] = [
    ['zenity', ['--file-selection', '--directory', '--title=Select a git repository']],
    ['kdialog', ['--getexistingdirectory', start, '--title', 'Select a git repository']],
    ['yad', ['--file', '--directory', '--title=Select a git repository']],
  ]

  for (const [cmd, args] of candidates) {
    if (!(await which(cmd))) continue
    // A picker is available. From here on, a non-zero exit (e.g. the user
    // pressing Cancel or closing the window) means "no selection", not an error.
    try {
      const { stdout } = await execFileAsync(cmd, args)
      const p = stdout.trim()
      if (!p) return null
      await access(p)
      return p
    } catch {
      return null
    }
  }

  throw new Error('No folder picker found. Install zenity, kdialog, or yad (Linux).')
}
