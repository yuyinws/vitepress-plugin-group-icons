import { describe, expect, it } from 'vite-plus/test'
import { builtinIcons, localIconLoader } from '../src'
import { generateCSS, getMatchedLabels } from '../src/codegen'

describe('generate css', () => {
  it('builtin icon', async () => {
    const labels = new Set(['npm', 'yarn'])
    expect(
      await generateCSS(labels, {
        customIcon: {},
      }),
    ).toMatchSnapshot()
  })

  it('themed icon (dark/light)', async () => {
    const labels = new Set(['vite'])
    expect(await generateCSS(labels, {})).toMatchSnapshot()
  })

  it('custom icon', { timeout: 0 }, async () => {
    const labels = new Set(['vitepress', 'ae', 'oxc'])
    expect(
      await generateCSS(labels, {
        customIcon: {
          ae: 'logos:adobe-after-effects',
          vitepress: localIconLoader(import.meta.url, '../docs/assets/vitepress.svg'),
        },
      }),
    ).toMatchSnapshot()
  })

  it('duplicate label', async () => {
    const labels = new Set(['foo.ts', 'bar.ts'])
    expect(
      await generateCSS(labels, {
        customIcon: {},
      }),
    ).toMatchSnapshot()
  })

  it('default labels', async () => {
    const labels = new Set(['npm'])
    expect(
      await generateCSS(labels, {
        customIcon: {},
        defaultLabels: ['yarn'],
      }),
    ).toMatchSnapshot()
  })

  it('default labels with custom icon', async () => {
    const labels = new Set(['npm'])
    expect(
      await generateCSS(labels, {
        customIcon: {
          curl: 'logos:curl',
        },
        defaultLabels: ['curl'],
      }),
    ).toMatchSnapshot()
  })

  it('default labels with all builtin icons', async () => {
    const labels = new Set([])
    expect(
      await generateCSS(labels, {
        defaultLabels: Object.keys(builtinIcons).slice(0, 3),
      }),
    ).toMatchSnapshot()
  })

  it('empty icon', async () => {
    const labels = new Set(['reactive'])
    expect(
      await generateCSS(labels, {
        customIcon: {
          reactive: '',
        },
      }),
    ).toMatchSnapshot()
  })

  it('named icon', async () => {
    const labels = new Set([
      'named-icon ~vscode-icons:default-folder~',
      'named-icon ~~logos:adobe-after-effects~~',
    ])
    expect(
      await generateCSS(labels, {
        customIcon: {},
      }),
    ).toMatchSnapshot()
  })

  it('correctly match', async () => {
    const labels = new Set([
      'test.c',
      'test.css',
      'test.c456789',
      'file.ts',
      'script.py',
      '.vscode/123456',
      'vite.config.ts',
      'eslint.config.ts',
    ])

    const matched = getMatchedLabels(labels, builtinIcons)
    const matchedLabels = matched.flatMap(m => m.labels)

    expect(matchedLabels).toContain('test.c')
    expect(matchedLabels).toContain('test.css')
    expect(matchedLabels).not.toContain('test.c456789')
    expect(matchedLabels).toContain('file.ts')
    expect(matchedLabels).toContain('script.py')
    expect(matchedLabels).toContain('.vscode/123456')

    const cMatch = matched.find(m => m.labels.includes('test.c'))
    expect(cMatch?.icon).toMatchInlineSnapshot(`"vscode-icons:file-type-c"`)

    const cssMatch = matched.find(m => m.labels.includes('test.css'))
    expect(cssMatch?.icon).toMatchInlineSnapshot(`"vscode-icons:file-type-css"`)

    const tsMatch = matched.find(m => m.labels.includes('file.ts'))
    expect(tsMatch?.icon).toMatchInlineSnapshot(`"vscode-icons:file-type-typescript"`)

    const pyMatch = matched.find(m => m.labels.includes('script.py'))
    expect(pyMatch?.icon).toMatchInlineSnapshot(`"vscode-icons:file-type-python"`)

    const vscodeMatch = matched.find(m => m.labels.includes('.vscode/123456'))
    expect(vscodeMatch?.icon).toMatchInlineSnapshot(`"vscode-icons:file-type-vscode"`)

    const viteMatch = matched.find(m => m.labels.includes('vite.config.ts'))
    expect(viteMatch?.icon).toMatchInlineSnapshot(`
    	{
    	  "dark": "vscode-icons:file-type-vite",
    	  "light": "vscode-icons:file-type-light-vite",
    	}
    `)

    const eslintMatch = matched.find(m => m.labels.includes('eslint.config.ts'))
    expect(eslintMatch?.icon).toMatchInlineSnapshot(`"vscode-icons:file-type-eslint"`)
  })
})
