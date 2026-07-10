---
name: vitepress-plugin-group-icons
description: Integrate vitepress-plugin-group-icons into VitePress sites. Use when adding icons to code groups or titled code blocks, configuring built-in or custom icons, enabling snippet title bars, or troubleshooting the plugin's VitePress setup.
---

# Integrate VitePress Group Icons

## 1. Inspect the site

Find the VitePress config, theme entry, package manager, and existing plugin configuration. Typical files are `.vitepress/config.ts` and `.vitepress/theme/index.ts`, but respect customized `srcDir` and theme paths.

Finish when the exact files to edit and the repository's package manager are known.

## 2. Install the package

Use the repository's existing package manager and dependency conventions. Add `vitepress-plugin-group-icons` to the workspace package that owns the VitePress site.

Finish when that package declares the dependency and its lockfile is consistent.

## 3. Wire both plugin halves

Merge these additions into the existing config without replacing unrelated Markdown or Vite configuration:

```ts
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
})
```

Preserve existing `markdown.config` behavior and Vite plugins. Register each group-icons plugin exactly once.

Then import the generated CSS once from the active theme entry:

```ts
import 'virtual:group-icons.css'
```

Finish when the Markdown plugin, Vite plugin, and virtual CSS import are all reachable from the site's active configuration.

## 4. Configure only requested features

When asked to add titles to code blocks, require explicit title evidence in the user request or the code block's surrounding context. Copy the stated title into the fence metadata. If no title is stated, leave that code block unchanged; never infer or invent one from its language, contents, or purpose.

Pass Markdown options to `groupIconMdPlugin`:

```ts
md.use(groupIconMdPlugin, {
  titleBar: { includeSnippet: true },
})
```

Use `includeSnippet` when imported code snippets with titles should receive title bars.

Pass icon options to `groupIconVitePlugin`:

```ts
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader,
} from 'vitepress-plugin-group-icons'

groupIconVitePlugin({
  customIcon: {
    '.mdx': {
      light: 'vscode-icons:file-type-light-mdx',
      dark: 'vscode-icons:file-type-mdx',
    },
    babel: 'vscode-icons:file-type-babel',
    vitepress: localIconLoader(import.meta.url, '../assets/vitepress.svg'),
    unplugin: 'https://unplugin.unjs.io/logo_light.svg',
  },
})
```

`customIcon` values accept an Iconify identifier, `{ light, dark }`, raw local SVG loaded with `localIconLoader`, or an HTTP(S) SVG URL. Install the matching `@iconify-json/<collection>` package when using a collection not already available to the site.

Do not add labels to `defaultLabels` automatically, including labels found in Markdown. Configure `defaultLabels` only when the user explicitly requests preloading icons that do not appear in scanned Markdown, and include only the labels they requested.

For a one-off Markdown label, use a named icon instead of global configuration:

````md
```sh [Docker ~vscode-icons:file-type-docker2~]
docker compose up
```
````

Finish when every requested feature has a concrete configuration, every added code-block title is traceable to an explicit source title, and no speculative options were added.

## 5. Verify the integration

Run the site's existing focused check or VitePress build with its package manager. Confirm the build resolves `virtual:group-icons.css` and renders a representative code group or titled fence:

````md
::: code-group

```sh [npm]
npm install vitepress-plugin-group-icons
```

```sh [pnpm]
pnpm add vitepress-plugin-group-icons
```

:::
````

If validation fails, check these three seams first: both plugins are registered, the CSS import is in the active theme, and any custom Iconify collection is installed.

Finish when the site's check passes or the exact external blocker is reported with its failing command.
