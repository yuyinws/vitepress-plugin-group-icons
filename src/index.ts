import type { App, Plugin } from 'vue'
import GroupIcon from './components/GroupIcon.vue'

export const plugin: Plugin = {
  install: (app: App, options?: { foo: string }) => {
    app.config.globalProperties.$foo = options?.foo
    app.component('GroupIcon', GroupIcon)
  },
}
