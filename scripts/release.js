import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('../', import.meta.url))

export function prepareRelease (current, target, changelog, date) {
  const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
  if (!stableVersion.test(current)) throw new Error('The current version must be a stable x.y.z version.')
  const parts = current.split('.').map(Number)
  const bump = ['major', 'minor', 'patch'].indexOf(target)
  if (bump !== -1) {
    parts[bump]++
    for (let i = bump + 1; i < parts.length; i++) parts[i] = 0
    target = parts.join('.')
  }
  if (!stableVersion.test(target)) throw new Error('Use patch, minor, major, or a stable version such as 2.0.0.')
  const next = target.split('.').map(Number)
  const previous = current.split('.').map(Number)
  const difference = next.findIndex((value, index) => value !== previous[index])
  if (difference === -1 || next[difference] < previous[difference]) throw new Error('The release version must be greater than the current version.')
  const section = /^## \[Unreleased\][ \t]*\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/m
  const match = changelog.match(section)
  if (!match || !match[1].split('\n').some(line => line.trim() && !line.startsWith('#'))) {
    throw new Error('Add release notes under ## [Unreleased] in CHANGELOG.md first.')
  }
  if (changelog.includes(`## [${target}]`)) throw new Error('This version already exists in CHANGELOG.md.')
  return {
    version: target,
    changelog: changelog.replace(/^## \[Unreleased\][ \t]*\r?$/m, `## [Unreleased]\n\n## [${target}] - ${date}`)
  }
}

function npm (args, capture = false) {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd: root,
    stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8'
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed; release stopped.`)
  return result.stdout?.trim()
}

function main () {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.length === 0) {
    console.log('Usage: npm run release -- <patch|minor|major|x.y.z> [--dry-run]')
    return
  }
  if (args.length > 2 || (args.length === 2 && args[1] !== '--dry-run')) throw new Error('Unexpected arguments. Use --help for usage.')
  if (!process.env.npm_execpath) throw new Error('Run this script through npm run release.')
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
  const changelogPath = path.join(root, 'CHANGELOG.md')
  const release = prepareRelease(pkg.version, args[0], fs.readFileSync(changelogPath, 'utf8'), new Date().toISOString().slice(0, 10))
  console.log(`Preparing ${pkg.name}: ${pkg.version} → ${release.version}`)
  npm(['whoami'])
  const versions = JSON.parse(npm(['view', pkg.name, 'versions', '--json'], true))
  if ([].concat(versions).includes(release.version)) throw new Error(`${release.version} is already published.`)
  npm(['run', 'lint'])
  npm(['test'])
  npm(['pack', '--dry-run', '--ignore-scripts'])
  if (args.includes('--dry-run')) {
    console.log(`Preflight passed. Would release ${release.version}; no files changed or package published.`)
    return
  }
  npm(['version', release.version, '--no-git-tag-version', '--ignore-scripts'])
  fs.writeFileSync(changelogPath, release.changelog)
  try {
    npm(['publish', '--access', 'public'])
  } catch (error) {
    console.error('Version and changelog are prepared. After resolving the error, retry with npm publish --access public (do not bump again).')
    throw error
  }
  console.log(`Published ${pkg.name}@${release.version}. Commit the release files and tag v${release.version} when ready.`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
