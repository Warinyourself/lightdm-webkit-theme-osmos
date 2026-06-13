import { watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import router from '@/router'
import { useAppStore } from '@/store/app'
import { useThemeStore } from '@/store/theme'
import { isDifferentRoute, parseQueryValue } from '@/utils/helper'

export function useQuerySync() {
  const appStore = useAppStore()
  const themeStore = useThemeStore()

  const applyQueryToStore = () => {
    const query = router.currentRoute.value.query

    if (query.themeName && themeStore.getThemeByName(query.themeName as string)) {
      themeStore.currentTheme = query.themeName as string
    }

    themeStore.activeTheme.settings = themeStore.activeTheme.settings?.map((input) => {
      if (!(input.name in query)) return input
      return { ...input, value: parseQueryValue(query[input.name] as string) }
    })
  }

  const syncQueryFromStore = () => {
    const route = router.currentRoute.value

    const inputQuery = themeStore.activeTheme.settings?.reduce<Record<string, string>>((query, input) => {
      query[input.name] = input.value + ''
      return query
    }, {})

    const bodyClassQuery = Object.entries(appStore.bodyClass).reduce<Record<string, string>>((query, [key, value]) => {
      query[key] = value + ''
      return query
    }, {})

    const query = { ...inputQuery, ...bodyClassQuery, themeName: themeStore.currentTheme }
    const routeTo = { name: route.name || '/', query }

    if (isDifferentRoute(routeTo)) router.replace(routeTo)
  }

  applyQueryToStore()

  watch(
    () => [themeStore.activeTheme.settings, appStore.bodyClass, themeStore.currentTheme],
    useDebounceFn(syncQueryFromStore, 300),
    { deep: true }
  )
}
