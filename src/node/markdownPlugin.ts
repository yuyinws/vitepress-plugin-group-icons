import type MarkdownIt from 'markdown-it'
import type { StateCore } from 'markdown-it/index.js'

function groupIconRule(state: StateCore) {
  const groupNameRegex = /\[([^\]]+)\]/

  for (const token of state.tokens) {
    if (token.type === 'fence' && token.tag === 'code' && token.level === 1) {
      const match = token.info.match(groupNameRegex)
      if (match) {
        const iconName = match[1]
        token.info = token.info.replace(
          groupNameRegex,
          `[<GroupIcon name="${iconName}" />]`,
        )
      }
    }
  }
}

export function groupIconPlugin(md: MarkdownIt) {
  md.core.ruler.push('vp-group-icons', groupIconRule)
}
