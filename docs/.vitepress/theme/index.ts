import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import Theme from 'vitepress/theme'
import 'virtual:group-icons.css'
import '@shikijs/vitepress-twoslash/style.css'

export default {
  extends: Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(TwoslashFloatingVue)
  },
}
