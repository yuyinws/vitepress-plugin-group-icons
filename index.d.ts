import type { App, Plugin } from 'vue'

export declare const GroupIconComponent: Plugin & {
  install: (app: App, options?: { foo: string }) => void
}

export declare const groupIconPlugin: (md: MarkdownIt) => void
