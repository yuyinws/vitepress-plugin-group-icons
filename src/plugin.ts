import type { Plugin, ViteDevServer } from 'vite'
import { generateCSS } from './codegen'
import { isSetEqual } from './utils'

export interface Options {
  customIcon: Record<string, string>
}

export function groupIconPlugin(options?: Options): Plugin {
  const virtualCssId = 'virtual:group-icons.css'
  const resolvedVirtualCssId = `\0${virtualCssId}`
  const labelMatchs = new Set<string>()
  let oldLabelMatchs: Set<string>
  const labelMatchRegex = /<label[^>]+\bdata-label=\\"([^"]*)\\"|<label[^>]+\bdata-label="[^"]*"/g
  let server: ViteDevServer | undefined

  options = options || { customIcon: {} }

  function handleUpdateModule() {
    const mod = server?.moduleGraph.getModuleById(resolvedVirtualCssId)
    if (mod) {
      server!.moduleGraph.invalidateModule(mod)
      server!.reloadModule(mod)
    }
  }

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
        oldLabelMatchs = new Set(labelMatchs)
        return css
      }

      return undefined
    },
    transform(code, id) {
      if (!id.endsWith('.md'))
        return

      while (true) {
        const match = labelMatchRegex.exec(code)
        if (!match)
          break
        labelMatchs.add(match[1])
      }

      if (!isSetEqual(labelMatchs, oldLabelMatchs)) {
        handleUpdateModule()
      }
    },
  }
}
