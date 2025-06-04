import { builtinIcons, localIconLoader } from 'src'
import { generateCSS } from 'src/codegen'
import { describe, expect, it } from 'vitest'

describe('generate css', () => {
  it('builtin icon', async () => {
    const labels = new Set(['npm', 'yarn'])
    expect(await generateCSS(labels, {
      customIcon: {},
    })).toMatchSnapshot()
  })

  it('custom icon', { timeout: 0 }, async () => {
    const labels = new Set(['vitepress', 'ae', 'oxc'])
    expect(await generateCSS(labels, {
      customIcon: {
        ae: 'logos:adobe-after-effects',
        vitepress: localIconLoader(import.meta.url, '../docs/assets/vitepress.svg'),
      },
    })).toMatchSnapshot()
  })

  it('duplicate label', async () => {
    const labels = new Set(['foo.ts', 'bar.ts'])
    expect(await generateCSS(labels, {
      customIcon: {},
    })).toMatchSnapshot()
  })

  it('default labels', async () => {
    const labels = new Set(['npm'])
    expect(await generateCSS(labels, {
      customIcon: {},
      defaultLabels: ['yarn'],
    })).toMatchSnapshot()
  })

  it('default labels with custom icon', async () => {
    const labels = new Set(['npm'])
    expect(await generateCSS(labels, {
      customIcon: {
        curl: 'logos:curl',
      },
      defaultLabels: ['curl'],
    })).toMatchSnapshot()
  })

  it('default labels with all builtin icons', async () => {
    const labels = new Set([])
    expect(await generateCSS(labels, {
      defaultLabels: Object.keys(builtinIcons).slice(0, 3),
    })).toMatchSnapshot()
  })

  it('empty icon', async () => {
    const labels = new Set(['reactive'])
    expect(await generateCSS(labels, {
      customIcon: {
        reactive: '',
      },
    })).toMatchSnapshot()
  })

  it('named icon', async () => {
    const labels = new Set(['named-icon ~vscode-icons:default-folder~'])
    expect(await generateCSS(labels, {
      customIcon: {},
    })).toMatchSnapshot()
  })
})
