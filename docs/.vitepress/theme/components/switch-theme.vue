<script setup>
import { useData } from 'vitepress/client'

const { isDark } = useData()
</script>

<template>
  <button class="switch-theme-button" @click="isDark = !isDark">
    Switch to {{ isDark ? 'Light' : 'Dark' }} theme
  </button>
</template>

<style scoped>
.switch-theme-button {
  border-color: var(--vp-button-brand-border);
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
