# Features

## 💡 Fill Icons

> Automatically fill the missing product icons for code groups.

### Input

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

### Output

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

## 🪧 Title Bar

> Add a title bar with icon and name for code blocks.

### Input

````
```js [vite.config.js]
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```
````

### Output

```js [vite.config.js]
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

### Includes Code Snippets

If you also want to add title bar for [Code Snippets
](https://vitepress.dev/guide/markdown#import-code-snippets):

```ts {5} [.vitepress/config.ts]
export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin, {
        titleBar: { includeSnippet: true },
      })
    },
  },
})
```

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

``` [deno]
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

``` [Qwik]
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

``` [.oxlintrc.json]
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

``` [foo.css]
```

``` [foo.scss]
```

``` [foo.ico]
```

:::

::: details Icon mapping

<<< ../src/builtin.ts

:::

## Custom Icons

> You can add any icons from [iconify](https://icon-sets.iconify.design/), local svg file or url.

```ts {2,13-19} [.vitepress/config.ts]
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
          'vitepress': localIconLoader(import.meta.url, '../assets/vitepress.svg'),
          'unplugin': 'https://unplugin.unjs.io/logo_light.svg',
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

``` [Vitepress]
```

``` [Unplugin]
```

:::

## Named Icons

You can also use named icons by using the `~icon~` syntax.

````md {1}
``` [Docker ~vscode-icons:file-type-docker2~]
Docker
```
````

### Output

``` [Docker ~vscode-icons:file-type-docker2~]
Docker
```

## Default Labels

> Force specific icons to be loaded regardless of whether they appear in your documentation.

The defaultLabels option allows you to preload icons for specific labels, ensuring they're available in your CSS even if they don't appear in your current documentation pages.

```ts {2,13-19} [.vitepress/config.ts]
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
      groupIconVitePlugin({
        defaultLabels: [
          'npm',
          'yarn',
          'pnpm',
          'bun',
          'deno',
        ],
      })
    ],
  }
})
```
