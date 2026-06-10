import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'AppSwitch',

  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    inline: { type: Boolean, default: false }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const classes = computed(() => ({
      switch: true,
      'switch--active': props.modelValue
    }))

    const changeState = () => emit('update:modelValue', !props.modelValue)

    return () => (
      <label class={classes.value}>
        <div class="switch-control">
          <div class="switch-track">
            <span class="switch-knob" />
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
