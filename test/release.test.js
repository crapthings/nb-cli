import { expect } from 'chai'
import { prepareRelease } from '../scripts/release.js'

describe('Release preparation', () => {
  const notes = '# Changelog\n\n## [Unreleased]\n\n### Changed\n- Updated dependencies.\n\n## [1.0.4] - 2026-07-09\n\n- Older release.\n'

  it('bumps stable versions and preserves previous release notes', () => {
    for (const [target, version] of Object.entries({ patch: '1.0.5', minor: '1.1.0', major: '2.0.0', '2.3.4': '2.3.4' })) {
      const result = prepareRelease('1.0.4', target, notes, '2026-09-29')
      expect(result.version).to.equal(version)
      expect(result.changelog).to.equal(notes.replace('## [Unreleased]', `## [Unreleased]\n\n## [${version}] - 2026-09-29`))
    }
  })

  it('rejects invalid, equal, or older versions', () => {
    for (const target of ['latest', '1.0.4', '0.9.9', '2.0.0-beta.1', '02.0.0']) {
      expect(() => prepareRelease('1.0.4', target, notes, '2026-09-29')).to.throw()
    }
  })

  it('requires new release notes, even when older releases have notes', () => {
    const empty = notes.replace('- Updated dependencies.', '')
    expect(() => prepareRelease('1.0.4', 'major', empty, '2026-09-29')).to.throw('Add release notes')
    expect(() => prepareRelease('1.0.4', 'major', '# Changelog', '2026-09-29')).to.throw('Add release notes')
  })
})
