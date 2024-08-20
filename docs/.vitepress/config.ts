import { defineConfig } from 'vitepress'
import { localIconLoader, mdPlugin, vitePlugin } from 'vitepress-plugin-group-icons'
import Inspect from 'vite-plugin-inspect'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vitepress Plugin Group Icons',
  description: 'Automatically fill the missing product icon for code groups.',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yuyinws/vitepress-plugin-group-icons' },
    ],

  },
  markdown: {
    config(md) {
      md.use(mdPlugin)
    },

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
      vitePlugin({
        customIcon: {
          ae: 'logos:adobe-after-effects',
          ai: 'logos:adobe-illustrator',
          ps: 'logos:adobe-photoshop',
          rspack: localIconLoader(import.meta.url, '../assets/rspack.svg'),
          farm: localIconLoader(import.meta.url, '../assets/farm.svg'),
        },
      }),
      Inspect(),
    ],
  },
})
