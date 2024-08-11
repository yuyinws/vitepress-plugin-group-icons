import Theme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import { GroupIconComponent } from 'vitepress-plugin-group-icons/client'
import rspack from '../../assets/rspack.svg?raw'
import farm from '../../assets/farm.svg?raw'

export default {
  ...Theme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(GroupIconComponent, {
      ae: 'logos:adobe-after-effects',
      ai: 'logos:adobe-illustrator',
      ps: 'logos:adobe-photoshop',
      rspack,
      farm,
    })
  },
}
