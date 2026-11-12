import { build } from 'vitepress'

// Run in a child process by `vitepress.test.ts`: inside a test worker the VitePress build
// fails to resolve `vue`.
const [root, outDir] = process.argv.slice(2)

await build(root, { outDir, minify: false })
