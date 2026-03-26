import type { Plugin, ViteDevServer } from 'vite'
import type { Options } from './types'
import { generateCSS } from './codegen'
import { isSetEqual } from './utils'

const HTML_ENTITY_LT_RE = /&(?:lt|#60);/g
const HTML_ENTITY_GT_RE = /&(?:gt|#62);/g
const HTML_ENTITY_QUOT_RE = /&(?:quot|#34);/g
const HTML_ENTITY_APOS_RE = /&(?:apos|#39);/g
const HTML_ENTITY_AMP_RE = /&(?:amp|#38);/g
const DATA_TITLE_RE = /\bdata-title=\\"([^"]*)\\"|\bdata-title="([^"]*)"|"data-title":\s*"([^"]*)"/g
const MARKDOWN_ID_RE = /\.(md|md\?vue|md\?v=)$/

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll(HTML_ENTITY_LT_RE, '<')
    .replaceAll(HTML_ENTITY_GT_RE, '>')
    .replaceAll(HTML_ENTITY_QUOT_RE, '"')
    .replaceAll(HTML_ENTITY_APOS_RE, "'")
    .replaceAll(HTML_ENTITY_AMP_RE, '&')
}

export function groupIconVitePlugin(options?: Options): Plugin {
  const virtualCssId = 'virtual:group-icons.css'
  const resolvedVirtualCssId = `\0${virtualCssId}`
  const matches = new Set<string>()

  let oldMatches = new Set<string>()
  let server: ViteDevServer | undefined

  options = options || { customIcon: {} }

  function handleUpdateModule() {
    const mod = server?.moduleGraph.getModuleById(resolvedVirtualCssId)
    if (mod) {
      server!.moduleGraph.invalidateModule(mod)
      void server!.reloadModule(mod)
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
    transform: {
      filter: {
        id: MARKDOWN_ID_RE,
      },
      handler(code) {
        DATA_TITLE_RE.lastIndex = 0

        while (true) {
          const match = DATA_TITLE_RE.exec(code)
          if (!match) break

          matches.add(decodeHtmlEntities(match[1] || match[2] || match[3]))
        }

        if (!isSetEqual(matches, oldMatches)) {
          handleUpdateModule()
        }
      },
    },
  }
}
