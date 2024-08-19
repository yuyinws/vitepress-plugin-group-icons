import type { Plugin, ViteDevServer } from 'vite'
import { generateCSS } from './codegen'

export interface Options {
  customIcon: Record<string, string>
}

export function groupIconsPlugin(options?: Options): Plugin {
  const virtualCssId = 'virtual:group-icons.css'
  const resolvedVirtualCssId = `\0${virtualCssId}`
  const labelMatchs = new Set<string>()
  const labelMatchRegex = /<label[^>]+\bdata-label=\\"([^"]*)\\"|<label[^>]+\bdata-label="[^"]*"/g
  let server: ViteDevServer | undefined
  let virtualCss = ''

  options = options || { customIcon: {} }

  return {
    name: 'vitepress-plugin-group-icons',
    resolveId(id) {
      if (id === virtualCssId) {
        return resolvedVirtualCssId
      }
      return undefined
    },

    configureServer(_server) {
      server = _server
    },

    async load(id) {
      if (id === resolvedVirtualCssId) {
        const { css } = await generateCSS(labelMatchs, options)
        virtualCss = css

        return virtualCss
      }

      return undefined
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        while (true) {
          const match = labelMatchRegex.exec(code)
          if (!match)
            break
          labelMatchs.add(match[1])
        }
      }
    },
    transformIndexHtml: {
      async handler() {
        const mod = server!.moduleGraph.getModuleById(resolvedVirtualCssId)
        if (mod) {
          const { css } = await generateCSS(labelMatchs, options)
          virtualCss = css
          server!.moduleGraph.invalidateModule(mod)
          server!.reloadModule(mod)
        }
      },
    },
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.md')) {
        const mod = server!.moduleGraph.getModuleById(resolvedVirtualCssId)
        if (mod) {
          setTimeout(() => {
            server!.moduleGraph.invalidateModule(mod)
            server!.reloadModule(mod)
          }, 100)
        }
      }
    },
  }
}
