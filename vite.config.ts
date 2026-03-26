import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp lint --fix && vp fmt',
  },
  lint: {
    plugins: ['eslint', 'typescript'],
    options: {
      typeAware: true,
    },
  },
  fmt: {
    ignorePatterns: ['dist/**', '*.md'],
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
    quoteProps: 'consistent',
  },
})
