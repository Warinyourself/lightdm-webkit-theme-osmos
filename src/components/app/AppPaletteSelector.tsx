import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppPaletteSelector',

  props: {
    modelValue: { type: Number, default: 0 },
    values: { type: Array as () => string[][], required: true },
    label: { type: String, default: '' }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    return () => (
      <div class="palette-blocks">
        {props.values.map((colors, index) => {
          const classes = `palette-block ${index === props.modelValue ? 'active' : ''}`
          return (
            <div onClick={() => emit('update:modelValue', index)} class={classes}>
              {colors.map((color) => (
                <div class="palette-block-color" style={`background-color: ${color}`} />
              ))}
            </div>
          )
        })}
      </div>
    )
  }
})
