import { execFile } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vite-plus/test'

const fixture = (path: string) => fileURLToPath(new URL(`./fixtures/${path}`, import.meta.url))

// Labels are collected from the modules Vue compiles the pages into, so this guards
// against changes in that output that the string based unit tests would not notice.
describe('vitepress build', () => {
  it('generates the icon CSS for the labels of a site', { timeout: 120_000 }, async () => {
    const outDir = await mkdtemp(join(tmpdir(), 'group-icons-site-'))

    try {
      await promisify(execFile)(process.execPath, [
        fixture('build-site.mjs'),
        fixture('site'),
        outDir,
      ])

      const assets = join(outDir, 'assets')
      const files = (await readdir(assets)).filter(file => file.endsWith('.css'))
      const css = (
        await Promise.all(files.map(file => readFile(join(assets, file), 'utf-8')))
      ).join('')
      const html = await readFile(join(outDir, 'index.html'), 'utf-8')

      for (const label of [
        'npm',
        'yarn',
        'vite.config.ts',
        'Docker ~vscode-icons:file-type-docker2~',
      ]) {
        expect(html).toContain(`data-title="${label}"`)
        expect(css).toContain(`[data-title='${label}']::before`)
      }
      // the named icon is only part of `data-title`, not of the visible title
      expect(html).toContain('>Docker</span>')
    } finally {
      await rm(outDir, { recursive: true, force: true })
    }
  })
})
