export function isSetEqual(set1: Set<string>, set2: Set<string>) {
  try {
    if (set1.size !== set2.size) {
      return false
    }
    for (const item of set1) {
      if (!set2.has(item)) {
        return false
      }
    }
    return true
  }
  catch {
    return false
  }
}

export const namedIconMatchRegex = /\s~([^~]+)~/
