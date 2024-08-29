# vitepress-plugin-group-icons

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

> Automatically fill the missing product icon for code groups.

![vp-plugin-group-icons](https://static.yuy1n.io/vp-plugin-group-icons.png)

<p align='center'>
<a href="https://vp.yuy1n.io/">
📜 Documentation
</a>
</p>

## Usage

### Install

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

### Configuration

```ts
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

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress/theme'
import 'virtual:group-icons.css'

export default Theme
```

### Usage Example
````markdown
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
````

### Built-in Icons

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

### Custom Icons

> You can add any icons from [iconify](https://icon-sets.iconify.design/) or local svg file.

```ts
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

## License

[MIT](./LICENSE) License © 2024-PRESENT [Leo](https://github.com/yuyinws)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vitepress-plugin-group-icons?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vitepress-plugin-group-icons
[npm-downloads-src]: https://img.shields.io/npm/dm/vitepress-plugin-group-icons?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vitepress-plugin-group-icons
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vitepress-plugin-group-icons?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vitepress-plugin-group-icons
[license-src]: https://img.shields.io/github/license/yuyinws/vitepress-plugin-group-icons.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/yuyinws/vitepress-plugin-group-icons/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vitepress-plugin-group-icons
