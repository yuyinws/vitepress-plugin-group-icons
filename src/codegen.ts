import { createRequire } from 'node:module'
import { getIconData } from '@iconify/utils'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'
import type { Options } from './vite'
import { builtinIcons } from './builtin'

export async function generateCSS(labels: Set<string>, options: Options) {
  const baseCSS = `
.vp-code-group [data-title]::before {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  margin-bottom: -0.2em;
  background: var(--icon) no-repeat center / contain;
}`

  const mergedIcons = { ...builtinIcons, ...options.customIcon }
  const matched = getMatchedLabels(labels, mergedIcons)

  const css = baseCSS + await generateIconCSS(matched)

  return { css }
}

function getMatchedLabels(labels: Set<string>, icons: Record<string, string>) {
  const matched: Record<string, string[]> = {}

  for (const label of labels) {
    const key = Object.keys(icons).find(k => label?.toLowerCase().includes(k))
    if (key) {
      matched[icons[key]] = (matched[icons[key]] || []).concat(label)
    }
  }

  return matched
}

async function generateIconCSS(matched: Record<string, string[]>) {
  const iconCSS = await Promise.all(Object.entries(matched).map(async ([icon, labels]) => {
    const svg = await getSVG(icon)
    const selector = labels.map(label => `[data-title^='${label}']::before`).join(',')
    return `
${selector} {
  content: '';
  --icon: url("data:image/svg+xml,${svg}");
}`
  }))

  return iconCSS.join('')
}

async function getSVG(icon: string) {
  if (icon.startsWith('<svg')) {
    return encodeSvgForCss(icon)
  }

  const [collection, iconName] = icon.split(':')
  const { icons } = createRequire(import.meta.url)(`@iconify-json/${collection}`)
  const iconData = getIconData(icons, iconName)

  if (iconData) {
    const { top = 0, left = 0, width = 0, height = 0, body } = iconData
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${top} ${left} ${width} ${height}'>${body}</svg>`
    return encodeSvgForCss(svg)
  }

  return ''
}
