import type { Plugin, ViteDevServer } from 'vite'
import type { Options } from './types'
import { generateCSS } from './codegen'

const HTML_ENTITY_LT_RE = /&(?:lt|#60);/g
const HTML_ENTITY_GT_RE = /&(?:gt|#62);/g
const HTML_ENTITY_QUOT_RE = /&(?:quot|#34);/g
const HTML_ENTITY_APOS_RE = /&(?:apos|#39);/g
const HTML_ENTITY_AMP_RE = /&(?:amp|#38);/g
const DATA_TITLE_RE = /\bdata-title=\\"([^"]*)\\"|\bdata-title="([^"]*)"|"data-title":\s*"([^"]*)"/g
const MARKDOWN_ID_RE = /\.(md|md\?vue|md\?v=)$/
const UPDATE_DELAY = 100

// Titles are captured from JS string literals in the compiled module, so `\\` and friends are still escaped.
function decodeJsString(value: string) {
  try {
    return JSON.parse(`"${value}"`) as string
  } catch {
    return value
  }
}

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

  // number of labels in the last generated CSS; `matches` only grows
  let generatedCount = 0
  let updateTimer: ReturnType<typeof setTimeout> | undefined
  let server: ViteDevServer | undefined
  let root: string | undefined

  options = options || { customIcon: {} }

  // Debounced so the burst of markdown transforms on startup reloads the CSS once
  function scheduleUpdate() {
    if (!server || updateTimer) {
      return
    }

    updateTimer = setTimeout(() => {
      updateTimer = undefined
      const mod = server?.moduleGraph.getModuleById(resolvedVirtualCssId)
      if (!server || !mod || matches.size === generatedCount) {
        return
      }

      server.moduleGraph.invalidateModule(mod)
      server.reloadModule(mod).catch((error: unknown) => {
        server?.config.logger.error(
          `[vitepress-plugin-group-icons]: Failed to reload icon CSS: ${String(error)}`,
        )
      })
    }, UPDATE_DELAY)
    updateTimer.unref?.()
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

    configResolved(config) {
      root = config.root
    },

    configureServer(_server) {
      server = _server
    },

    async load(id) {
      if (id === resolvedVirtualCssId) {
        const count = matches.size
        const { css } = await generateCSS(matches, options, root)
        generatedCount = count
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

          const title = match[1] ?? match[2] ?? match[3]
          if (title) {
            matches.add(decodeHtmlEntities(decodeJsString(title)))
          }
        }

        if (matches.size !== generatedCount) {
          scheduleUpdate()
        }
      },
    },
  }
}
