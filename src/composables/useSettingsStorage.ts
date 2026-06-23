import type { AppSettings } from '@/models/app'

const STORAGE_KEY = 'settings'

// Bump this when AppSettings schema changes and add a migration below.
const CURRENT_VERSION = 1

interface StoredSettings {
  version: number
  data: AppSettings
}

// Each entry migrates data from index N to N+1.
// Add a new function here whenever CURRENT_VERSION is incremented.
const migrations: Array<(data: any) => any> = [
  // v0 → v1: wrap legacy flat object into versioned format (no field changes needed)
  (data) => data,
]

function migrate(data: any, fromVersion: number): AppSettings {
  let result = data
  for (let v = fromVersion; v < CURRENT_VERSION; v++) {
    result = migrations[v]!(result)
  }
  return result as AppSettings
}

export function useSettingsStorage() {
  function load(): AppSettings | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw)

      // Legacy unversioned data written before versioning was introduced
      if (!('version' in parsed)) {
        return migrate(parsed, 0)
      }

      const stored = parsed as StoredSettings
      if (stored.version === CURRENT_VERSION) return stored.data

      // Run outstanding migrations
      return migrate(stored.data ?? stored, stored.version)
    } catch {
      return null
    }
  }

  function save(settings: AppSettings): void {
    const stored: StoredSettings = { version: CURRENT_VERSION, data: settings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }

  function clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { load, save, clear }
}
