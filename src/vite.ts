import type { Plugin, ViteDevServer } from 'vite'
import { generateCSS } from './codegen'
import { isSetEqual } from './utils'

export interface Options {
  customIcon: Record<string, string>
}

export function groupIconVitePlugin(options?: Options): Plugin {
  const virtualCssId = 'virtual:group-icons.css'
  const resolvedVirtualCssId = `\0${virtualCssId}`
  const combinedRegex = /<(?:label|span)[^>]+\bdata-title=\\"([^"]*)\\"|<(?:label|span)[^>]+\bdata-title="([^"]*)"/g
  const matches = new Set<string>()

  let oldMatches: Set<string>
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
    enforce: 'post',
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
        const { css } = await generateCSS(matches, options)
        oldMatches = new Set(matches)
        return css
      }

      return undefined
    },
    transform(code, id) {
      if (!id.endsWith('.md'))
        return

      while (true) {
        const match = combinedRegex.exec(code)
        if (!match)
          break
        matches.add(match[1] || match[2])
      }

      if (!isSetEqual(matches, oldMatches)) {
        handleUpdateModule()
      }
    },
  }
}
