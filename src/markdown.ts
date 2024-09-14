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

      const title = token.info.match(/\[(.*?)\]/)

      if (token.level === 0 && token.tag === 'code' && title) {
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
