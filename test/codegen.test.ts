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

  it('escapes labels in selectors', async () => {
    const labels = new Set(["Dave's.ts", 'C:\\foo.ts', 'line\nbreak.ts'])
    const { css } = await generateCSS(labels, {})

    expect(css).toContain(
      `[data-title='Dave\\'s.ts']::before,[data-title='C:\\\\foo.ts']::before,[data-title='line\\a break.ts']::before {`,
    )
  })

  it('matches keywords as whole words', () => {
    const iconOf = (label: string) =>
      getMatchedLabels(new Set([label]), builtinIcons).find(m => m.labels.includes(label))?.icon

    // keyword inside another word falls back to the extension icon
    expect(iconOf('member.ts')).toBe('vscode-icons:file-type-typescript')
    expect(iconOf('invite.ts')).toBe('vscode-icons:file-type-typescript')
    expect(iconOf('reactive.ts')).toBe('vscode-icons:file-type-typescript')
    expect(iconOf('denormalize.ts')).toBe('vscode-icons:file-type-typescript')
    expect(iconOf('markov.py')).toBe('vscode-icons:file-type-python')
    expect(iconOf('triangular.py')).toBe('vscode-icons:file-type-python')
    expect(iconOf('Envelope.php')).toBe('vscode-icons:file-type-php3')
    expect(iconOf('bundle.js')).toEqual(builtinIcons['.js'])
    expect(iconOf('consolidate.js')).toEqual(builtinIcons['.js'])
    expect(iconOf('Ubuntu')).toBeUndefined()

    // whole words, camelCase, digits and common suffixes still match
    expect(iconOf('VitePress')).toEqual(builtinIcons.vite)
    expect(iconOf('Vue3')).toBe(builtinIcons.vue)
    expect(iconOf('Next.js')).toEqual(builtinIcons.next)
    expect(iconOf('nextjs')).toEqual(builtinIcons.next)
    expect(iconOf('.npmrc')).toBe(builtinIcons.npm)
    expect(iconOf('.eslintignore')).toBe(builtinIcons.eslint)
    expect(iconOf('.oxlintrc.json')).toEqual(builtinIcons.oxlint)
    expect(iconOf('pnpm-workspace.yaml')).toEqual(builtinIcons.pnpm)
    expect(iconOf('bunx')).toBe(builtinIcons.bun)
    expect(iconOf('@tailwindcss/vite')).toBe(builtinIcons.tailwind)
    expect(iconOf('UnoCSS')).toBe(builtinIcons.unocss)
  })

  it('matches custom keywords case-insensitively', () => {
    const matched = getMatchedLabels(new Set(['docker-compose.yml', 'C++']), {
      'Docker': 'vscode-icons:file-type-docker2',
      'c++': 'vscode-icons:file-type-cpp',
    })

    expect(matched).toEqual([
      { icon: 'vscode-icons:file-type-docker2', labels: ['docker-compose.yml'] },
      { icon: 'vscode-icons:file-type-cpp', labels: ['C++'] },
    ])
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
