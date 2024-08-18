import { getIconData } from '@iconify/utils'
import { encodeSvgForCss } from '@iconify/utils/lib/svg/encode-svg-for-css'

async function getCSS(iconName: string, label: string) {
  const [collection, icon] = iconName.split(':')

  const { icons } = await import(`@iconify-json/${collection}`)

  const iconData = getIconData(icons, icon)

  if (iconData) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${iconData.width} ${iconData.height}'>${iconData.body}</svg>`

    return `
.vp-code-group [data-label^='${label}']::before {
  content: '';
  --icon: url("data:image/svg+xml,${encodeSvgForCss(svg)}");
}
    `
  }

  return ''
}

export async function generateCSS(labels: Set<string>) {
  let css = `.vp-code-group [data-label]::before {
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

  for (const label of labels) {
    const findKey = Object.keys(builtInIcons).find(key => label?.toLowerCase().includes(key))
    if (findKey) {
      css += await getCSS(builtInIcons[findKey], label)
    }
  }

  return {
    css,
  }
}
