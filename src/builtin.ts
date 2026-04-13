import type { Icon } from './types'

export const builtinIcons: Icon = {
  // package managers
  'pnpm': {
    dark: 'vscode-icons:file-type-pnpm',
    light: 'vscode-icons:file-type-light-pnpm',
  },
  'npm': 'vscode-icons:file-type-npm',
  'yarn': 'vscode-icons:file-type-yarn',
  'bun': 'vscode-icons:file-type-bun',
  'deno': 'vscode-icons:file-type-deno',
  // frameworks
  'vue': 'vscode-icons:file-type-vue',
  'svelte': 'vscode-icons:file-type-svelte',
  'angular': 'vscode-icons:file-type-angular',
  'react': 'vscode-icons:file-type-reactjs',
  'solid': 'logos:solidjs-icon',
  'marko': 'vscode-icons:file-type-marko',
  'next': {
    dark: 'vscode-icons:file-type-next',
    light: 'vscode-icons:file-type-light-next',
  },
  'nuxt': 'vscode-icons:file-type-nuxt',
  'astro': {
    dark: 'vscode-icons:file-type-astro',
    light: 'vscode-icons:file-type-light-astro',
  },
  'qwik': 'logos:qwik-icon',
  'ember': 'vscode-icons:file-type-ember',
  'vitest': {
    dark: 'vscode-icons:file-type-vitest',
    light: 'vscode-icons:file-type-light-vitest',
  },
  // bundlers
  'rollup': 'vscode-icons:file-type-rollup',
  'webpack': 'vscode-icons:file-type-webpack',
  'vite': {
    dark: 'vscode-icons:file-type-vite',
    light: 'vscode-icons:file-type-light-vite',
  },
  'esbuild': 'vscode-icons:file-type-esbuild',
  'rolldown': {
    dark: 'vscode-icons:file-type-rolldown',
    light: 'vscode-icons:file-type-light-rolldown',
  },
  // configuration files
  'package.json': 'vscode-icons:file-type-node',
  'tsconfig.json': 'vscode-icons:file-type-tsconfig',
  '.npmrc': 'vscode-icons:file-type-npm',
  '.editorconfig': 'vscode-icons:file-type-editorconfig',
  '.eslintrc': 'vscode-icons:file-type-eslint',
  '.eslintignore': 'vscode-icons:file-type-eslint',
  'eslint.config': 'vscode-icons:file-type-eslint',
  '.gitignore': 'vscode-icons:file-type-git',
  '.gitattributes': 'vscode-icons:file-type-git',
  '.env': 'vscode-icons:file-type-dotenv',
  '.env.example': 'vscode-icons:file-type-dotenv',
  '.vscode': 'vscode-icons:file-type-vscode',
  'tailwind.config': 'vscode-icons:file-type-tailwind',
  'uno.config': 'vscode-icons:file-type-unocss',
  'unocss.config': 'vscode-icons:file-type-unocss',
  'vue.config': 'vscode-icons:file-type-vueconfig',
  'prisma.config': {
    dark: 'vscode-icons:file-type-prisma',
    light: 'vscode-icons:file-type-light-prisma',
  },
  'build.gradle': {
    dark: 'vscode-icons:file-type-gradle',
    light: 'vscode-icons:file-type-light-gradle',
  },
  'settings.gradle': {
    dark: 'vscode-icons:file-type-gradle',
    light: 'vscode-icons:file-type-light-gradle',
  },
  // filename extensions
  '.mts': 'vscode-icons:file-type-typescript',
  '.cts': 'vscode-icons:file-type-typescript',
  '.ts': 'vscode-icons:file-type-typescript',
  '.tsx': 'vscode-icons:file-type-typescript',
  '.mjs': {
    dark: 'vscode-icons:file-type-js',
    light: 'vscode-icons:file-type-light-js',
  },
  '.cjs': {
    dark: 'vscode-icons:file-type-js',
    light: 'vscode-icons:file-type-light-js',
  },
  '.json': {
    dark: 'vscode-icons:file-type-json',
    light: 'vscode-icons:file-type-light-json',
  },
  '.js': {
    dark: 'vscode-icons:file-type-js',
    light: 'vscode-icons:file-type-light-js',
  },
  '.jsx': {
    dark: 'vscode-icons:file-type-js',
    light: 'vscode-icons:file-type-light-js',
  },
  '.md': 'vscode-icons:file-type-markdown',
  '.py': 'vscode-icons:file-type-python',
  '.ico': 'vscode-icons:file-type-favicon',
  '.html': 'vscode-icons:file-type-html',
  '.css': 'vscode-icons:file-type-css',
  '.scss': 'vscode-icons:file-type-scss',
  '.yml': {
    dark: 'vscode-icons:file-type-yaml-official',
    light: 'vscode-icons:file-type-light-yaml-official',
  },
  '.yaml': {
    dark: 'vscode-icons:file-type-yaml-official',
    light: 'vscode-icons:file-type-light-yaml-official',
  },
  '.php': 'vscode-icons:file-type-php3',
  '.gjs': 'vscode-icons:file-type-glimmer',
  '.gts': 'vscode-icons:file-type-glimmer',
  // misc
  'oxlint': {
    dark: 'vscode-icons:file-type-oxc',
    light: 'vscode-icons:file-type-light-oxc',
  },
  'oxc': {
    dark: 'vscode-icons:file-type-oxc',
    light: 'vscode-icons:file-type-light-oxc',
  },
  'oxfmt': {
    dark: 'vscode-icons:file-type-oxc',
    light: 'vscode-icons:file-type-light-oxc',
  },
}

export const builtinExtensionIcons: Icon = {
  '.sass': 'vscode-icons:file-type-sass',
  '.less': 'vscode-icons:file-type-less',
  '.prisma': {
    dark: 'vscode-icons:file-type-prisma',
    light: 'vscode-icons:file-type-light-prisma',
  },
  '.toml': {
    dark: 'vscode-icons:file-type-toml',
    light: 'vscode-icons:file-type-light-toml',
  },
  '.ini': {
    dark: 'vscode-icons:file-type-ini',
    light: 'vscode-icons:file-type-light-ini',
  },
  '.jsp': 'vscode-icons:file-type-jsp',
  '.wasm': 'vscode-icons:file-type-wasm',
  '.rs': {
    dark: 'vscode-icons:file-type-rust',
    light: 'vscode-icons:file-type-light-rust',
  },
  '.go': 'vscode-icons:file-type-go',
  '.java': 'vscode-icons:file-type-java',
  '.c': 'vscode-icons:file-type-c',
  '.cpp': 'vscode-icons:file-type-cpp',
  '.cs': 'vscode-icons:file-type-csharp',
  '.dart': 'vscode-icons:file-type-dartlang',
  '.sln': 'vscode-icons:file-type-sln',
  '.kt': 'vscode-icons:file-type-kotlin',
  '.groovy': 'vscode-icons:file-type-groovy',
  '.scala': 'vscode-icons:file-type-scala',
  '.swift': 'vscode-icons:file-type-swift',
  '.lua': 'vscode-icons:file-type-lua',
  '.r': 'vscode-icons:file-type-r',
  '.rb': 'vscode-icons:file-type-ruby',
}
