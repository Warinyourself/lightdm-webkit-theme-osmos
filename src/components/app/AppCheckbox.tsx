import { Check } from '@lucide/vue'
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'AppCheckbox',

  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    inline: { type: Boolean, default: false }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const classes = computed(() => ({
      checkbox: true,
      'checkbox--active': props.modelValue
    }))

    const changeState = () => emit('update:modelValue', !props.modelValue)

    return () => (
      <label class={classes.value}>
        <div class="checkbox-control">
          <div class="checkbox-control-box">
            <Check />
          </div>
          <input
            type="checkbox"
            checked={props.modelValue}
            aria-checked={props.modelValue}
            onInput={changeState}
          />
        </div>
        <p class="input-label">{props.label}</p>
      </label>
    )
  }
})
