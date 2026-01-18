export interface ThemedIcon {
  dark: string
  light: string
}

export type IconValue = string | ThemedIcon

export type Icon = Record<string, IconValue>

export interface Options {
  customIcon?: Icon
  defaultLabels?: string[]
}
