/* eslint-disable ts/explicit-function-return-type */
import type MarkdownIt from 'markdown-it'
import type { StateCore } from 'markdown-it/index.js'

function groupIconRule(state: StateCore) {
  const groupNameRegex = /\[([^\]]+)\]/

  for (const token of state.tokens) {
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

export function groupIconPlugin(md: MarkdownIt) {
  md.core.ruler.push('vp-group-icons', groupIconRule)
}
