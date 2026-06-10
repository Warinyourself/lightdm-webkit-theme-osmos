import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App'
import router from './router'
import { registerComponents } from '@/plugins/components'
import '@/utils/lightdm'

import './style/index.styl'

import ru from '@/locales/ru.json'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import de from '@/locales/de.json'
import es from '@/locales/es.json'

let language: string
try {
  language = (JSON.parse(localStorage.getItem('settings') || '{}')).language || 'en'
} catch {
  language = 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: language,
  silentTranslationWarn: true,
  messages: { ru, en, fr, de, es }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

registerComponents(app)

app.mount('#app')
