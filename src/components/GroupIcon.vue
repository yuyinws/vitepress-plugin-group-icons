<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  name: string
}>()

const builtInIcons: Record<string, string> = {
  // package manager
  npm: 'logos:npm-icon',
  yarn: 'logos:yarn',
  pnpm: 'logos:pnpm',
  bun: 'logos:bun',
  // framework
  vue: 'logos:vue',
  svelte: 'logos:svelte-icon',
  react: 'logos:react',
  next: 'logos:nextjs-icon',
  nuxt: 'logos:nuxt-icon',
  solid: 'logos:solidjs-icon',
}

const findKey = Object.keys(builtInIcons).find(key => (props.name.toLowerCase()).includes(key))

const findIcon = findKey ? builtInIcons[findKey] : undefined
</script>

<template>
  <span style="display: inline-block;">
    <Icon
      v-if="findIcon"
      style="vertical-align: middle;display: inline-block;margin-right: .25rem;height: 1rem; width: 1rem;"
      :icon="findIcon"
    />
  </span>
</template>
