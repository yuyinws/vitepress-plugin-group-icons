import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { plugin } from 'vitepress-plugin-group-icons'

export default {
  ...Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(plugin, {
      foo: 'ba554422r',
    })
  },
}
