import type { Plugin } from 'vite'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'vite'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { groupIconVitePlugin } from '../src/vite'

function transform(plugin: ReturnType<typeof groupIconVitePlugin>, code: string) {
  return (plugin.transform as any).handler(code, '/foo.md')
}

function createServer() {
  const mod = {}
  return {
    moduleGraph: {
      getModuleById: vi.fn(() => mod),
      invalidateModule: vi.fn(),
    },
    reloadModule: vi.fn(async () => {}),
    config: { logger: { error: vi.fn() } },
  }
}

describe('vite plugin', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('reloads the icon CSS once for a burst of new labels', async () => {
    vi.useFakeTimers()
    const plugin = groupIconVitePlugin()
    const server = createServer()
    ;(plugin.configureServer as any)(server)

    transform(plugin, '<span data-title="a.ts"></span>')
    transform(plugin, '<span data-title="b.ts"></span>')
    transform(plugin, '<span data-title="c.ts"></span>')
    await vi.runAllTimersAsync()

    expect(server.reloadModule).toHaveBeenCalledTimes(1)

    await (plugin.load as any)('\0virtual:group-icons.css')
    transform(plugin, '<span data-title="a.ts"></span>')
    await vi.runAllTimersAsync()

    expect(server.reloadModule).toHaveBeenCalledTimes(1)
  })

  it('logs instead of throwing when the reload fails', async () => {
    vi.useFakeTimers()
    const plugin = groupIconVitePlugin()
    const server = createServer()
    server.reloadModule.mockRejectedValueOnce(new Error('server closed'))
    ;(plugin.configureServer as any)(server)

    transform(plugin, '<span data-title="a.ts"></span>')
    await vi.runAllTimersAsync()

    expect(server.config.logger.error).toHaveBeenCalledWith(
      expect.stringContaining('server closed'),
    )
  })

  it('ignores an empty data-title', () => {
    const plugin = groupIconVitePlugin()

    expect(() =>
      transform(plugin, '_createStaticVNode("<span data-title=\\"\\"></span>")'),
    ).not.toThrow()
    expect(() => transform(plugin, '<span data-title=""></span>')).not.toThrow()
  })

  it('decodes escaped titles before generating selectors', async () => {
    const plugin = groupIconVitePlugin()

    transform(
      plugin,
      '_createStaticVNode("<span data-title=\\"Dave&#39;s.ts\\"></span><span data-title=\\"C:\\\\foo.ts\\"></span>")',
    )
    const css = await (plugin.load as any)('\0virtual:group-icons.css')

    expect(css).toContain(`[data-title='Dave\\'s.ts']::before`)
    expect(css).toContain(`[data-title='C:\\\\foo.ts']::before`)
  })

  it('waits for markdown entries before generating the icon CSS in a build', async () => {
    const root = await mkdtemp(join(tmpdir(), 'group-icons-build-'))
    // stands in for a page whose markdown transform finishes after the CSS is requested
    const slowMarkdown: Plugin = {
      name: 'slow-markdown',
      enforce: 'pre',
      async transform(_code, id) {
        if (!id.endsWith('.md')) {
          return undefined
        }
        await new Promise(resolve => setTimeout(resolve, 50))
        return { code: 'export default "<span data-title=\\"npm\\"></span>"', map: null }
      },
    }

    try {
      await writeFile(join(root, 'app.js'), `import 'virtual:group-icons.css'\n`)
      await writeFile(join(root, 'page.md'), '# page\n')

      const result = await build({
        root,
        configFile: false,
        logLevel: 'silent',
        plugins: [slowMarkdown, groupIconVitePlugin()],
        build: {
          write: false,
          minify: false,
          rolldownOptions: {
            input: { app: join(root, 'app.js'), page: join(root, 'page.md') },
          },
        },
      })

      const outputs = Array.isArray(result) ? result : [result]
      const css = outputs
        .flatMap(output => ('output' in output ? output.output : []))
        .filter(file => file.type === 'asset' && file.fileName.endsWith('.css'))
        .map(file => (file.type === 'asset' ? String(file.source) : ''))
        .join('')

      expect(css).toMatch(/\[data-title=['"]npm['"]\]::before/)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
