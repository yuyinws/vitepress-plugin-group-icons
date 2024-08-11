import type { App, Plugin } from 'vue'
import GroupIcon from './GroupIcon.vue'

export const GroupIconComponent: Plugin = {
  install: (app: App, options?: Record<string, string>) => {
    app.config.globalProperties.$VP_GROUP_ICONS_EXTERNAL = options
    app.component('GroupIcon', GroupIcon)
  },
}
