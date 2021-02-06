const { execSync } = require('child_process')

const opts = {
  stdio: 'ignore',
}
const exec = (cmd) => execSync(cmd, opts)

const isUnixInstalled = (program) => {
  try {
    exec(`hash ${program} 2>/dev/null`)
    return true
  } catch {
    return false
  }
}

const isMacInstalled = (program) => {
  try {
    exec(`osascript -e 'id of application "${program}"' 2>&1>/dev/null`)
    return true
  } catch {
    return false
  }
}

const isWindowsInstalled = (program) => {
  // Try a couple variants, depending on execution environment the .exe
  // may or may not be required on both `where` and the program name.
  const attempts = [
    `where ${program}`,
    `where ${program}.exe`,
    `where.exe ${program}`,
    `where.exe ${program}.exe`,
  ]

  // eslint-disable-next-line fp/no-let
  let success = false
  // eslint-disable-next-line fp/no-loops
  for (const a of attempts) {
    try {
      exec(a)
      success = true
    } catch {}
  }

  return success
}

module.exports = (program) =>
  [isUnixInstalled, isMacInstalled, isWindowsInstalled].some((f) => f(program))
