import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { GroupIconComponent } from 'vitepress-plugin-group-icons'

export default {
  ...Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(GroupIconComponent, {
      foo: 'ba554422r',
    })
  },
}
