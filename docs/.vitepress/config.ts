import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress Plugin Group Icons',
  description: 'Automatically fill the missing product icon for code groups.',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuyinws/vitepress-plugin-group-icons' },
    ],
    nav: [
      { text: 'Features', link: '/features' },
      { text: 'Showcase', link: '/showcase' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Features', link: '/features' },
        ],
      },
      {
        text: 'Showcase',
        link: '/showcase',
      },
    ],

  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin, {
        titleBar: {
          includeSnippet: true,
        },
      })
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
  },
  head: [
    ['meta', { property: 'og:title', content: 'Vitepress Plugin Group Icons' }],
    ['meta', { property: 'og:description', content: 'Automatically fill the missing product icon for code groups.' }],
    ['meta', { property: 'og:image', content: `https://vpgi.vercel.app//og.png` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://vpgi.vercel.app/' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: `https://vpgi.vercel.app/og.png` }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#4FC08D' }],
  ],
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          '.mdx': {
            light: 'vscode-icons:file-type-light-mdx',
            dark: 'vscode-icons:file-type-mdx',
          },
          'babel': 'vscode-icons:file-type-light-babel2',
          'vitepress': localIconLoader(import.meta.url, '../assets/vitepress.svg'),
          'unplugin': 'https://unplugin.unjs.io/logo_light.svg',
        },
      }) as any,
      Inspect(),
    ],
  },
})
