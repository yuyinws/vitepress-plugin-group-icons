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

## Usage Example

````md
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

## Built-in Icons

### Package Managers

::: code-group

``` [npm]
```

``` [yarn]
```

``` [pnpm]
```

``` [bun]
```

:::

### Frameworks

::: code-group

``` [Vue]
```

``` [Svelte]
```

``` [Angular]
```

``` [React]
```

``` [Solid]
```

``` [Astro]
```

``` [Next]
```

``` [Nuxt]
```

:::

### Bundlers

::: code-group

``` [Rollup]
```

``` [Webpack]
```

``` [Vite]
```

``` [esbuild]
```

:::

### Configuration Files

::: code-group

``` [package.json]
```

``` [tsconfig.json]
```

``` [eslint.config.js]
```

``` [.gitignore]
```

``` [.env]
```

``` [.vscode/settings.json]
```

``` [tailwind.config.js]
```

``` [uno.config.ts]
```

:::

### Filename Extension

::: code-group

``` [foo.ts]
```

``` [foo.js]
```

``` [foo.md]
```

``` [foo.py]
```

``` [foo.yml]
```

``` [foo.html]
```

``` [foo.ico]
```

:::

::: details Icon mapping

<<< ../src/builtin.ts

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
          '.mdx': 'vscode-icons:file-type-light-mdx',
          'babel': 'vscode-icons:file-type-babel',
          '.go': 'vscode-icons:file-type-go',
          'rspack': localIconLoader(import.meta.url, '../assets/rspack.svg'),
          'farm': localIconLoader(import.meta.url, '../assets/farm.svg'),
        },
      })
    ],
  }
})
```

::: code-group

``` [foo.mdx]
```

``` [Babel]
```

``` [foo.go]
```

``` [Rspack]
```

``` [Farm]
```

:::
