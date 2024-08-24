---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Vitepress Plugin Group Icons"
  tagline: Automatically fill the missing product icon for code groups.
---

## Install

::: code-group

```sh [npm]
npm install vitepress-plugin-group-icons
```

```sh [yarn]
yarn add vitepress-plugin-group-icons
```

```sh [pnpm]
pnpm add vitepress-plugin-group-icons
```

```sh [bun]
bun add vitepress-plugin-group-icons
```

:::

## Configuration

```ts {3,8,13}
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin()
    ],
  }
})
```

```ts {3}
// .vitepress/theme/index.ts
import Theme from 'vitepress/theme'
import 'virtual:group-icons.css'

export default Theme
```

## Built-in Icons

::: code-group

``` [Vue]
Vue
```

``` [Svelte]
Svelte
```

``` [React]
React
```

``` [Angular]
Angular
```

``` [Solid]
Solid
```

``` [Next.js]
Next.js
```

``` [Nuxt]
Nuxt
```

:::

::: details All built-in icons

```ts
export const builtInIcons: Record<string, string> = {
  // package manager
  pnpm: 'logos:pnpm',
  npm: 'logos:npm-icon',
  yarn: 'logos:yarn',
  bun: 'logos:bun',
  // framework
  vue: 'logos:vue',
  svelte: 'logos:svelte-icon',
  angular: 'logos:angular-icon',
  react: 'logos:react',
  next: 'logos:nextjs-icon',
  nuxt: 'logos:nuxt-icon',
  solid: 'logos:solidjs-icon',
  // bundler
  rollup: 'logos:rollupjs',
  webpack: 'logos:webpack',
  vite: 'logos:vitejs',
  esbuild: 'logos:esbuild',
}
```

:::

## Custom Icons

> You can add any icons from [iconify](https://icon-sets.iconify.design/) or local svg file.

```ts {3,14-20}
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ae: 'logos:adobe-after-effects',
          ai: 'logos:adobe-illustrator',
          ps: 'logos:adobe-photoshop',
          rspack: localIconLoader(import.meta.url, '../assets/rspack.svg'),
          farm: localIconLoader(import.meta.url, '../assets/farm.svg'),
        },
      })
    ],
  }
})
```

::: code-group

``` [AE]
AE
```

``` [AI]
AI
```

``` [PS]
PS
```

``` [Rspack]
Rspack
```

``` [Farm]
Farm
```

:::
