<script setup lang="ts">
import { Icon, addIcon } from '@iconify/vue'
import { getCurrentInstance, ref } from 'vue'
import { builtInIcons } from './builtinIcons'

const props = defineProps<{
  name: string
}>()

const externalIcons = getCurrentInstance()!.appContext.config.globalProperties.$VP_GROUP_ICONS_EXTERNAL || {}

const allIcons = { ...builtInIcons, ...externalIcons }

const findIcon = ref('')

function parse() {
  const findKey = Object.keys(allIcons).find(key => (props.name.toLowerCase()).includes(key))
  if (findKey) {
    const content = allIcons[findKey]
    if (content.startsWith('<')) {
      const getSvgBodyReg = /<svg[^>]*\sviewBox="([^"]+)"[^>]*>[\s\S]*?<\/svg>/
      const body = getSvgBodyReg.exec(content) ? getSvgBodyReg.exec(content)![0] : content
      const viewBox = getSvgBodyReg.exec(content) ? getSvgBodyReg.exec(content)![1] : '0 0 24 24'

      addIcon(`@custom:gi:${findKey}`, {
        body,
        top: Number(viewBox.split(' ')[0]),
        left: Number(viewBox.split(' ')[1]),
        width: Number(viewBox.split(' ')[2]),
        height: Number(viewBox.split(' ')[3]),
      })

      findIcon.value = `@custom:gi:${findKey}`
    }
    else {
      findIcon.value = content
    }
  }
}

parse()
</script>

<template>
  <span style="display: inline-block;">
    <Icon
      v-if="findIcon"
      style="vertical-align: middle;display: inline-block;margin-right: .25em;height: 1em; width: 1em;"
      :icon="findIcon"
    />
    <span>{{ name }}</span>
  </span>
</template>
