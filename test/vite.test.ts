import { describe, expect, it } from 'vite-plus/test'
import { groupIconVitePlugin } from '../src/vite'

function transform(plugin: ReturnType<typeof groupIconVitePlugin>, code: string) {
  return (plugin.transform as any).handler(code, '/foo.md')
}

describe('vite plugin', () => {
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
})
