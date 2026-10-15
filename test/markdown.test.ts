import { describe, expect, it } from 'vite-plus/test'
import { groupIconMdPlugin } from '../src/markdown'

function createMd(codeGroupOpen = '<label>Docker2 ~~vscode-icons:file-type-docker2~~</label>') {
  return {
    renderer: {
      rules: {
        'container_code-group_open': () => codeGroupOpen,
        'fence': () => '<pre></pre>',
      } as Record<string, (...args: any[]) => string>,
    },
    utils: {
      escapeHtml: (value: string) =>
        value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
    },
  }
}

function renderFence(md: ReturnType<typeof createMd>, info: string) {
  return md.renderer.rules.fence([{ type: 'fence', info }], 0)
}

describe('markdown', () => {
  it('removes a double-tilde named icon from a code group label', () => {
    const md = createMd()

    groupIconMdPlugin(md as any)

    expect(md.renderer.rules['container_code-group_open']()).toBe('<label>Docker2</label>')
  })

  it('does not render a title bar for an empty title', () => {
    const md = createMd()

    groupIconMdPlugin(md as any)

    expect(renderFence(md, 'ts []')).toBe('<pre></pre>')
    expect(renderFence(md, 'ts [ ]')).toBe('<pre></pre>')
  })
})
