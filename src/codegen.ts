import { getIconData } from '@iconify/utils'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'
import type { Options } from './vite'

async function getCSS(icon: string, label: string) {
  if (icon.startsWith('<svg')) {
    return `
.vp-code-group [data-title^='${label}']::before {
  content: '';
  --icon: url("data:image/svg+xml,${encodeSvgForCss(icon)}");
}`
  }
  else {
    const [collection, iconName] = icon.split(':')

    const { icons } = await import(`@iconify-json/${collection}`)

    const iconData = getIconData(icons, iconName)

    if (iconData) {
      const top = iconData.top || 0
      const left = iconData.left || 0
      const width = iconData.width || 0
      const height = iconData.height || 0

      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${top} ${left} ${width} ${height}'>${iconData.body}</svg>`

      return `
.vp-code-group [data-title^='${label}']::before {
  content: '';
  --icon: url("data:image/svg+xml,${encodeSvgForCss(svg)}");
}`
    }
  }

  return ''
}

export async function generateCSS(labels: Set<string>, options: Options) {
  let css = `
.vp-code-group [data-title]::before {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  margin-bottom: -0.2em;
  background: var(--icon) no-repeat center / contain;
}`

  const builtInIcons: Record<string, string> = {
    // package manager
    pnpm: 'logos:pnpm',
    npm: 'logos:npm-icon',
    yarn: 'logos:yarn',
    bun: 'logos:bun',
    // framework
    vue: 'logos:vue',
    svelte: 'logos:svelte-icon',
    angular: 'logos:angular-icon',
    react: 'logos:react',
    next: 'logos:nextjs-icon',
    nuxt: 'logos:nuxt-icon',
    solid: 'logos:solidjs-icon',
    astro: 'logos:astro-icon',
    // bundler
    rollup: 'logos:rollupjs',
    webpack: 'logos:webpack',
    vite: 'logos:vitejs',
    esbuild: 'logos:esbuild',
  }

  const mergedIcons = {
    ...builtInIcons,
    ...options.customIcon,
  }

  for (const label of labels) {
    const findKey = Object.keys(mergedIcons).find(key => label?.toLowerCase().includes(key))
    if (findKey) {
      css += await getCSS(mergedIcons[findKey], label)
    }
  }

  return {
    css,
  }
}
