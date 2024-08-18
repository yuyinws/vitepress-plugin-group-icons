import type { Plugin, ViteDevServer } from 'vite'
import { generateCSS } from './codegen'

export function vitePluginGroupIcons(): Plugin[] {
  const virtualCssId = 'virtual:group-icons.css'
  const resolvedVirtualCssId = `\0${virtualCssId}`
  const labels = new Set<string>()
  const labelRegex = /<label[^>]+\bdata-label=\\"([^"]*)\\"|<label[^>]+\bdata-label="[^"]*"/g
  let server: ViteDevServer | undefined
  let cssContent = ''

  return [
    {
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
          const { css } = await generateCSS(labels)
          cssContent = css

          return cssContent
        }

        return undefined
      },
      transform(code, id) {
        if (id.endsWith('.md')) {
          while (true) {
            const match = labelRegex.exec(code)
            if (!match)
              break
            labels.add(match[1] || match[2])
          }
        }
      },
      transformIndexHtml: {
        async handler() {
          const mod = server!.moduleGraph.getModuleById(resolvedVirtualCssId)
          if (mod) {
            const { css } = await generateCSS(labels)
            cssContent = css
            server!.moduleGraph.invalidateModule(mod)
            server!.reloadModule(mod)
          }
        },
      },
    },
  ]
}
