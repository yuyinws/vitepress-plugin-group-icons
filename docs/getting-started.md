# Getting Started

## Install

::: code-group

```sh [npm]
npm install vitepress-plugin-group-icons -D
```

```sh [yarn]
yarn add vitepress-plugin-group-icons -D
```

```sh [pnpm]
pnpm add -D vitepress-plugin-group-icons
```

```sh [bun]
bun vitepress-plugin-group-icons -d
```

:::

## Configuration

```ts {2,7,12} [.vitepress/config.ts]
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

```ts {2} [.vitepress/theme/index.ts]
import Theme from 'vitepress/theme'
import 'virtual:group-icons.css'

export default Theme
```
