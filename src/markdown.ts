import type Markdown from 'markdown-it'

export function mdPlugin(md: Markdown) {
  const labelRE = /<label\b[^>]*>(.*?)<\/label>/g

  type RenderRuleParams = Parameters<NonNullable<typeof md.renderer.rules['container_code-group_open']>>

  const orig = md.renderer.rules['container_code-group_open'] || function (...args: RenderRuleParams): string {
    return args[1] as unknown as string
  }

  md.renderer.rules['container_code-group_open'] = (...args: RenderRuleParams) => {
    return orig(...args).replace(
      labelRE,
      (match: string, label: string) =>
        `<label data-title="${md.utils.escapeHtml(label)}"${match.slice(6)}`,
    )
  }
}
