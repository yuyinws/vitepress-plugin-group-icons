import type Markdown from 'markdown-it'
import { namedIconMatchRegex } from './utils'

const LABEL_RE = /<label\b(?![^>]+\bdata-title\b)[^>]*>(.*?)<\/label>/g
const NAMED_ICON_LABEL_RE = /(<label[^>]*>)(.*?)(<\/label>)/g
const TITLE_RE = /\[((?:[^[\]]|\[[^[\]]*\])*)\]/

interface MdPluginOptions {
  titleBar: {
    /**
     * Whether the title bar is included in the [Snippets](https://vitepress.dev/guide/markdown#import-code-snippets)
     *
     * @defaultValue false
     */
    includeSnippet?: boolean
  }
}

export function groupIconMdPlugin(md: Markdown, options?: MdPluginOptions) {
  const _options = options || { titleBar: { includeSnippet: false } }

  // code group rule
  const codeGroupOpenRule = md.renderer.rules['container_code-group_open']
  if (codeGroupOpenRule) {
    md.renderer.rules['container_code-group_open'] = (...args) => {
      return codeGroupOpenRule(...args).replace(
        LABEL_RE,
        (match: string, label: string) =>
          `<label data-title="${md.utils.escapeHtml(label)}"${match.slice(6)}`,
      )
    }
  }

  // replace named icon in label content
  md.renderer.rules['container_code-group_open']! = (...args) => {
    const code = codeGroupOpenRule!(...args)
    return code.replace(NAMED_ICON_LABEL_RE, (_, labelStart, label, labelEnd) => {
      const namedIconMatch = label.match(namedIconMatchRegex)
      return `${labelStart}${namedIconMatch ? label.replace(namedIconMatch[0], '') : label}${labelEnd}`
    })
  }

  // code block rule
  const fenceRule = md.renderer.rules.fence
  if (fenceRule) {
    md.renderer.rules.fence = (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]

      let isOnCodeGroup = false
      for (let i = idx - 1; i >= 0; i--) {
        if (tokens[i].type === 'container_code-group_open') {
          isOnCodeGroup = true
          break
        }

        if (tokens[i].type === 'container_code-group_close') {
          break
        }
      }
      const title = token.info.match(TITLE_RE)

      const isIncludedSnippet = _options.titleBar.includeSnippet

      // only render code block not in code-group
      if (!isOnCodeGroup && title && (!(token as any).src || isIncludedSnippet)) {
        const namedIconMatch = title[1].match(namedIconMatchRegex)
        return `<div class="vp-code-block-title">
      <div class="vp-code-block-title-bar">
          <span class="vp-code-block-title-text" data-title="${md.utils.escapeHtml(title[1])}">${namedIconMatch ? title[1].replace(namedIconMatch[0], '') : title[1]}</span>
      </div>
        ${fenceRule(...args)}
      </div>
      `
      }

      return fenceRule(...args)
    }
  }
}
