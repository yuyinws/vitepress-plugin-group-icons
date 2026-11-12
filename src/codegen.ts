import type { Icon, IconValue, Options } from './types'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { encodeSvgForCss, getIconData, iconToHTML, iconToSVG } from '@iconify/utils'
import { builtinIcons } from './builtin'
import { namedIconMatchRegex } from './utils'

const HTTP_URL_RE = /^https?:\/\//
const SVG_TAG_RE = /<svg[\s>]/i
const FETCH_TIMEOUT = 10_000
// how long a failed icon is skipped before it is loaded again
const RETRY_DELAY = 30_000
// Scope icon rules to the plugin's own markup; `:where()` keeps their specificity unchanged
const ICON_SCOPE = ':where(.vp-code-group,.vp-code-block-title)'

const pluginRequire = createRequire(import.meta.url)
const CSS_STRING_SPECIAL_CHARS_RE = /['\\\n\r\f]/g
const REGEXP_SPECIAL_CHARS_RE = /[.*+?^${}()|[\]\\]/g
const CAMEL_CASE_BOUNDARY_RE = /([a-z0-9])([A-Z])/g

function escapeRegExp(value: string) {
  return value.replace(REGEXP_SPECIAL_CHARS_RE, '\\$&')
}

// A keyword matches a whole word, optionally followed by a `js`, `rc` or `ignore` suffix or digits:
// `vite` matches `vite.config.ts`, `Vite 8` and `VitePress`, but not `invite.ts`.
function createKeywordRE(keyword: string) {
  return new RegExp(`(?<![a-z])${escapeRegExp(keyword)}(?:js|rc|ignore)?(?![a-z])`, 'i')
}

// Fallback for an extension that is not at the end of the label: `.env` matches `.env.local`
// and `.ts` matches `foo.ts (server)`, but `.c` does not match `test.c456789`.
function createExtensionSegmentRE(extension: string) {
  const start = /^[a-z0-9]/i.test(extension) ? '(?<![a-z0-9])' : ''
  return new RegExp(`${start}${escapeRegExp(extension)}(?![a-z0-9])`, 'i')
}

function escapeCSSString(value: string) {
  return value.replace(CSS_STRING_SPECIAL_CHARS_RE, char =>
    char === "'" || char === '\\' ? `\\${char}` : `\\${char.charCodeAt(0).toString(16)} `,
  )
}

/**
 * @param root Project root used to resolve `@iconify-json/*` packages that the plugin itself does not depend on.
 */
export async function generateCSS(labels: Set<string>, options: Options, root?: string) {
  const baseCSS = `
.vp-code-block-title [data-title]::before,
.vp-code-group [data-title]::before {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  margin-bottom: -0.2em;
  background: var(--icon) no-repeat center / contain;
}

.vp-code-block-title-bar {
  position: relative;
  margin: 16px -24px 0 -24px;
  background-color: var(--vp-code-block-bg);
  overflow-x: auto;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-code-tab-text-color);
  white-space: nowrap;
  transition: background-color 0.5s;
  border-radius: 8px 8px 0 0;
  padding:0 12px;
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
}

.custom-block .vp-code-block-title-bar {
  margin: 16px 0 0 0;
}

@media (min-width: 640px) {
  .vp-code-block-title-bar {
    margin: 16px 0 0 0;
  }
}

.vp-code-block-title-text {
  padding: 0 12px;
  line-height: 48px;
}


.vp-code-block-title div[class*=language-] {
  margin-top: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
`

  const matched = getMatchedLabels(
    new Set([...labels, ...(options.defaultLabels || [])]),
    builtinIcons,
    options.customIcon,
  )

  const css = baseCSS + (await generateIconCSS(matched, root))

  return { css }
}

interface MatchedIcon {
  icon: IconValue
  labels: string[]
}

function iconKey(icon: IconValue) {
  return typeof icon === 'string' ? `s:${icon}` : `o:${JSON.stringify(icon)}`
}

function getSortedEntries(icons: Icon) {
  return Object.entries(icons).sort(([a], [b]) => b.length - a.length)
}

function getKeywordEntries(icons: Icon) {
  return getSortedEntries(icons)
    .filter(([label]) => !label.includes('.'))
    .map(([keyword, icon]) => [createKeywordRE(keyword), icon] as const)
}

function getExtensionEntries(icons: Icon) {
  return getSortedEntries(icons)
    .filter(([label]) => label.includes('.'))
    .map(
      ([extension, icon]) =>
        [extension.toLowerCase(), createExtensionSegmentRE(extension), icon] as const,
    )
}

export function getMatchedLabels(
  labels: Set<string>,
  icons: Icon,
  customIcons: Icon = {},
): MatchedIcon[] {
  const matched = new Map<string, MatchedIcon>()
  // Custom icons are tried before builtin ones, so a custom `docs` matches `docs/vite.config.ts`
  // before the builtin `vite` does, and a custom `.vitepress` matches `.vitepress/config.ts`
  // before the builtin `.ts` does.
  const keywordEntries = [...getKeywordEntries(customIcons), ...getKeywordEntries(icons)]
  const extensionGroups = [getExtensionEntries(customIcons), getExtensionEntries(icons)]

  const add = (icon: IconValue, label: string) => {
    const key = iconKey(icon)
    const current = matched.get(key)
    if (current) {
      current.labels.push(label)
    } else {
      matched.set(key, { icon, labels: [label] })
    }
  }

  for (const label of labels) {
    const namedIconMatch = label.match(namedIconMatchRegex)
    if (namedIconMatch) {
      const namedIcon = namedIconMatch[2]
      add(namedIcon, label)
    } else {
      const lowerCaseLabel = label.toLowerCase()
      const words = [label, label.replace(CAMEL_CASE_BOUNDARY_RE, '$1 $2')]
      const keywordMatch = keywordEntries.find(([keywordRE]) =>
        words.some(word => keywordRE.test(word)),
      )

      if (keywordMatch) {
        add(keywordMatch[1], label)
        continue
      }

      let extensionMatch
      for (const extensionEntries of extensionGroups) {
        extensionMatch =
          extensionEntries.find(([extension]) => lowerCaseLabel.endsWith(extension)) ??
          extensionEntries.find(([, segmentRE]) => segmentRE.test(label))
        if (extensionMatch) break
      }

      if (extensionMatch) {
        add(extensionMatch[2], label)
      }
    }
  }

  return Array.from(matched.values())
}

function prefixSelectors(prefix: string, selectors: string[]) {
  return selectors.map(s => `${prefix} ${s}`).join(',')
}

function iconRule(selector: string, svg: string) {
  // skip icons that failed to load instead of leaving an empty box before the label
  if (!svg) {
    return ''
  }

  return `
${selector} {
  content: '';
  --icon: url("data:image/svg+xml,${svg}");
}`
}

async function generateIconCSS(matched: MatchedIcon[], root?: string) {
  const iconCSS = await Promise.all(
    matched.map(async ({ icon, labels }) => {
      const selectors = labels.map(
        label => `${ICON_SCOPE} [data-title='${escapeCSSString(label)}']::before`,
      )

      if (typeof icon === 'string') {
        return iconRule(selectors.join(','), await getSVG(icon, root))
      }

      return (
        iconRule(selectors.join(','), await getSVG(icon.light, root)) +
        iconRule(prefixSelectors('html.dark', selectors), await getSVG(icon.dark, root))
      )
    }),
  )

  return iconCSS.sort().join('')
}

// Prefer the plugin's own icon sets, then fall back to packages installed in the project,
// which are not always reachable from the plugin's location (monorepos, strict pnpm).
function requireIconSet(collection: string, root?: string) {
  const id = `@iconify-json/${collection}`
  try {
    return pluginRequire(id)
  } catch (error) {
    if (!root) {
      throw error
    }
    return createRequire(join(root, 'package.json'))(id)
  }
}

const svgCache = new Map<string, Promise<string>>()
const failedAt = new Map<string, number>()

// Cache icons across CSS regenerations so dev reloads do not refetch remote icons or
// re-encode every icon. Failed loads are retried, but only after `RETRY_DELAY`, so a burst
// of regenerations does not wait for (and warn about) the same broken icon every time.
function getSVG(icon: string, root?: string) {
  const key = `${root ?? ''}\0${icon}`
  let svg = svgCache.get(key)
  if (!svg) {
    const failed = failedAt.get(key)
    if (failed !== undefined && Date.now() - failed < RETRY_DELAY) {
      return Promise.resolve('')
    }

    svg = loadSVG(icon, root).then(result => {
      if (result) {
        failedAt.delete(key)
      } else {
        svgCache.delete(key)
        // an empty icon is not a failure, there is nothing to retry
        if (icon) {
          failedAt.set(key, Date.now())
        }
      }
      return result
    })
    svgCache.set(key, svg)
  }
  return svg
}

function warn(message: string) {
  console.warn(`[vitepress-plugin-group-icons]: ${message}`)
}

async function loadSVG(icon: string, root?: string) {
  if (!icon) {
    return ''
  }
  // raw SVG may start with whitespace, a BOM, an XML declaration or a comment
  const markup = icon.trimStart()
  if (markup.startsWith('<')) {
    return encodeSvgForCss(markup)
  }

  if (HTTP_URL_RE.test(icon)) {
    try {
      const res = await fetch(icon, { signal: AbortSignal.timeout(FETCH_TIMEOUT) })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const iconContent = await res.text()
      if (!SVG_TAG_RE.test(iconContent)) {
        throw new Error('response is not an SVG')
      }
      return encodeSvgForCss(iconContent.trimStart())
    } catch (error) {
      warn(
        `Failed to fetch icon: ${icon} (${error instanceof Error ? error.message : String(error)})`,
      )
      return ''
    }
  }

  const separator = icon.indexOf(':')
  if (separator === -1) {
    warn(
      `Invalid icon \`${icon}\`. Expected an Iconify name (\`collection:icon\`), a URL or raw SVG`,
    )
    return ''
  }

  const collection = icon.slice(0, separator)
  const iconName = icon.slice(separator + 1)
  let iconSet
  try {
    iconSet = requireIconSet(collection, root)
  } catch {
    warn(
      `Icon set \`${collection}\` not found. Please install \`@iconify-json/${collection}\` first`,
    )
    return ''
  }

  const iconData = getIconData(iconSet.icons, iconName)
  if (!iconData) {
    warn(`Icon \`${iconName}\` not found in icon set \`${collection}\``)
    return ''
  }

  const { attributes, body } = iconToSVG(iconData)
  return encodeSvgForCss(iconToHTML(body, attributes))
}
