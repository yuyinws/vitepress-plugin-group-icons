import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from '../../../../src'

export default defineConfig({
  title: 'Fixture',
  // `.cache` is git-ignored
  cacheDir: './.vitepress/.cache',
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    logLevel: 'silent',
    plugins: [groupIconVitePlugin() as any],
  },
})
