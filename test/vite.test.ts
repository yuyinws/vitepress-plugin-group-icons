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
})
