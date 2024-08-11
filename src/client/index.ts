import type { App, Plugin } from 'vue'
// eslint-disable-next-line ts/ban-ts-comment, ts/prefer-ts-expect-error
// @ts-ignore
import GroupIcon from './GroupIcon.vue'

export const GroupIconComponent: Plugin = {
  install: (app: App, options?: Record<string, string>) => {
    app.config.globalProperties.$VP_GROUP_ICONS_EXTERNAL = options
    app.component('GroupIcon', GroupIcon)
  },
}
