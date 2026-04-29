import { spawn } from 'node:child_process'

function runScript(name) {
  const command = process.platform === 'win32' ? `npm.cmd run ${name}` : `npm run ${name}`

  return spawn(command, {
    shell: true,
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  })
}

const server = runScript('server')
const client = runScript('dev:client')

let shuttingDown = false

function shutdown(code = 0) {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  server.kill('SIGTERM')
  client.kill('SIGTERM')
  process.exit(code)
}

server.on('exit', (code) => {
  if (!shuttingDown) {
    console.error(`SERV-ALERT backend finalizo con codigo ${code ?? 0}.`)
    shutdown(code ?? 0)
  }
})

client.on('exit', (code) => {
  if (!shuttingDown) {
    console.error(`SERV-ALERT frontend finalizo con codigo ${code ?? 0}.`)
    shutdown(code ?? 0)
  }
})

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
