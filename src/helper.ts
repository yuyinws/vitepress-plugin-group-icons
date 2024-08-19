import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function localIconLoader(url: string, path: string) {
  return readFileSync(resolve(dirname(fileURLToPath(url)), path), 'utf-8')
}
