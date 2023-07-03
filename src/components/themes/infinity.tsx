import { defineComponent, computed } from 'vue'
import { useAppStore } from '@/store/app'
import type { AppInputThemePalette } from '@/models/app'

export default defineComponent({
  name: 'InfinityTheme',
  setup() {
    const appStore = useAppStore()

    const palette = computed(() => {
      const input = appStore.getThemeInput('palette') as AppInputThemePalette
      const index = (input?.value as number) || 0
      const values = input?.values || []
      return (values[index] as string[]) || ['#51eaea', '#fffde1', '#ff9d76', '#FB3569']
    })

    const amount = computed(() => appStore.getThemeInput('amount')?.value || 30)
    const animationSpeed = computed(() => appStore.getThemeInput('animation-speed')?.value || 35)
    const depth = computed(() => appStore.getThemeInput('depth')?.value || 200)
    const size = computed(() => appStore.getThemeInput('size')?.value || 17)

    const color = computed(() => `@p(${palette.value.join(', ')});`)

    return () => {
      const innerHTML = `<css-doodle>
        :doodle {
          @grid: ${amount.value}x1 / ${size.value}vmin;
          --deg: @p(-180deg, 180deg);
        }
        :container {
          perspective: 10vmin;
        }
        :after, :before {
          content: '';
          background: ${color.value};
          @place-cell: @r(100%) @r(100%);
          @size: @r(6px);
          @shape: heart;
        }
        @place-cell: center;
        @size: ${depth.value}%;
        box-shadow: @m200(0 0 50px ${color.value});
        background: @m100(
          radial-gradient(${color.value} 50%, transparent 0)
          @r(-20%, 120%) @r(-20%, 100%) / 1px 1px
          no-repeat
        );
        will-change: transform, opacity;
        animation: scale-up ${animationSpeed.value}s linear infinite;
        animation-delay: calc(-${animationSpeed.value}s / @size() * @i());
        @keyframes scale-up {
          0%, 95.01%, 100% {
            transform: translateZ(0) rotate(0);
            opacity: 0;
          }
          10% { opacity: 1; }
          95% {
            transform: translateZ(12vmin) rotateZ(@var(--deg));
          }
        }
      </css-doodle>`

      return <div class="position-center" innerHTML={innerHTML} />
    }
  }
})
