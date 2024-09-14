import type Markdown from 'markdown-it'

export function groupIconMdPlugin(md: Markdown) {
  // code group rule
  const labelRE = /<label\b(?![^>]+\bdata-title\b)[^>]*>(.*?)<\/label>/g
  const codeGroupOpenRule = md.renderer.rules['container_code-group_open']
  if (codeGroupOpenRule) {
    md.renderer.rules['container_code-group_open'] = (...args) => {
      return codeGroupOpenRule(...args).replace(
        labelRE,
        (match: string, label: string) =>
        `<label data-title="${md.utils.escapeHtml(label)}"${match.slice(6)}`,
      )
    }
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
      const title = token.info.match(/\[(.*?)\]/)

      // only render code block not in code-group
      if (!isOnCodeGroup && title) {
        return `<div class="vp-code-block-title">
      <div class="vp-code-block-title-bar">
          <span class="vp-code-block-title-text" data-title="${md.utils.escapeHtml(title[1])}">${title[1]}</span>
      </div>
        ${fenceRule(...args)}
      </div>
      `
      }

      return fenceRule(...args)
    }
  }
}
