import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AppColorSelector',

  props: {
    modelValue: { type: String, default: '#fff' },
    label: { type: String, default: '' }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { t } = useI18n()

    return () => (
      <div class="color-selector">
        <p>{t(props.label)} <span class="caption">{props.modelValue}</span></p>
        <input
          type="color"
          value={props.modelValue}
          onInput={(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)}
        />
      </div>
    )
  }
})
