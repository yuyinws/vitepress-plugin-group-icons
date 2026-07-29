import { describe, expect, it } from 'vite-plus/test'
import { groupIconMdPlugin } from '../src/markdown'

describe('markdown', () => {
  it('removes a double-tilde named icon from a code group label', () => {
    const md = {
      renderer: {
        rules: {
          'container_code-group_open': () =>
            '<label>Docker2 ~~vscode-icons:file-type-docker2~~</label>',
        },
      },
      utils: { escapeHtml: (value: string) => value },
    }

    groupIconMdPlugin(md as any)

    expect(md.renderer.rules['container_code-group_open']()).toBe('<label>Docker2</label>')
  })
})
