# Usage

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

```ts {3,8}
// .vitepress/config.ts
import { defineConfig } from 'vitepress'
import { groupIconPlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconPlugin)
    }
  }
})
```

```ts {3,9}
// .vitepress/theme/index.js
import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { GroupIconComponent } from 'vitepress-plugin-group-icons/client'

export default {
  ...Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(GroupIconComponent)
  },
}
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
React
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

```ts {4,5,11-15}
import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { GroupIconComponent } from 'vitepress-plugin-group-icons/client'
import rspack from '../../assets/rspack.svg?raw'
import farm from '../../assets/farm.svg?raw'

export default {
  ...Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(GroupIconComponent, {
      ae: 'logos:adobe-after-effects',
      ai: 'logos:adobe-illustrator',
      ps: 'logos:adobe-photoshop',
      rspack,
      farm,
    })
  },
}
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
