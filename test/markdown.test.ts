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
    const md = createMd(
      '<label data-title="Docker2 ~~vscode-icons:file-type-docker2~~" for="tab-a">Docker2 ~~vscode-icons:file-type-docker2~~</label>',
    )

    groupIconMdPlugin(md as any)

    expect(md.renderer.rules['container_code-group_open']()).toBe(
      '<label data-title="Docker2 ~~vscode-icons:file-type-docker2~~" for="tab-a">Docker2</label>',
    )
  })

  it('adds data-title to code group labels without one', () => {
    const md = createMd(
      '<label for="tab-a">foo.ts</label><label for="tab-b">Docker ~vscode-icons:file-type-docker2~</label>',
    )

    groupIconMdPlugin(md as any)

    expect(md.renderer.rules['container_code-group_open']()).toBe(
      '<label data-title="foo.ts" for="tab-a">foo.ts</label><label data-title="Docker ~vscode-icons:file-type-docker2~" for="tab-b">Docker</label>',
    )
  })

  it('leaves the code group rule alone when it does not exist', () => {
    const md = createMd()
    delete md.renderer.rules['container_code-group_open']

    groupIconMdPlugin(md as any)

    expect(md.renderer.rules['container_code-group_open']).toBeUndefined()
  })

  it('accepts options without titleBar', () => {
    const md = createMd()

    groupIconMdPlugin(md as any, {})

    expect(renderFence(md, 'ts [foo.ts]')).toContain('data-title="foo.ts"')
  })

  it('does not render a title bar for an empty title', () => {
    const md = createMd()

    groupIconMdPlugin(md as any)

    expect(renderFence(md, 'ts []')).toBe('<pre></pre>')
    expect(renderFence(md, 'ts [ ]')).toBe('<pre></pre>')
  })
})
