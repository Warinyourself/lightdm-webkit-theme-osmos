import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageStore } from '@/store/page'
import { stopPropagation } from '@/utils/helper'
import AppButton from './AppButton'

export default defineComponent({
  name: 'AppDialog',

  setup() {
    const pageStore = usePageStore()
    const { t } = useI18n()

    return () => (
      <transition name="fade">
        {pageStore.dialog && (
          <div class="dialog-overlay active-block" onClick={pageStore.closeDialog}>
            <div class="dialog-body" onClick={stopPropagation}>
              <h5 class="dialog-title">{t(pageStore.dialog.title)}</h5>
              <p class="dialog-text">{t(pageStore.dialog.text)}</p>
              <div class="dialog-buttons">
                {pageStore.dialog.actions.map(({ title, callback }) => (
                  <AppButton onClick={callback}>{t(title)}</AppButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </transition>
    )
  }
})
