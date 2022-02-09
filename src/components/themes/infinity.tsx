import { AppInputThemeGeneral, AppTheme } from '@/models/app'
import { AppModule } from '@/store/app'
import { Component, Vue } from 'vue-property-decorator'
import { CreateElement } from 'vue/types/umd'

@Component
export default class InfinityTheme extends Vue {
  get theme() {
    return AppModule.activeTheme as AppTheme
  }

  get palette() {
    const input = AppModule.getThemeInput('palette') as AppInputThemeGeneral
    const index = input?.value as number || 0
    const values = input?.values || []

    return values[index] as string[] || ['#51eaea', '#fffde1', '#ff9d76', '#FB3569']
  }

  get amount() {
    return AppModule.getThemeInput('amount')?.value || 30 || 30
  }

  get animationSpeed() {
    return AppModule.getThemeInput('animation-speed')?.value || 35 || 35
  }

  get depth() {
    return AppModule.getThemeInput('depth')?.value || 200
  }

  get size() {
    return AppModule.getThemeInput('size')?.value || 17 || 18
  }

  get color() {
    return `@p(${this.palette.join(', ')});`
  }

  render(h: CreateElement) {
    return h('div', {
      class: 'position-center',
      domProps: {
        innerHTML: `<css-doodle>
          :doodle {
            @grid: ${this.amount}x1 / ${this.size}vmin;
            --deg: @p(-180deg, 180deg);
          }
          :container {
            perspective: 10vmin;
          }
          :after, :before {
            content: '';
            background: ${this.color}; 
            @place-cell: @r(100%) @r(100%);
            @size: @r(6px);
            @shape: heart;
          }
        
          @place-cell: center;
          @size: ${this.depth}%;
        
          box-shadow: @m200(0 0 50px ${this.color});
          background: @m100(
            radial-gradient(${this.color} 50%, transparent 0) 
            @r(-20%, 120%) @r(-20%, 100%) / 1px 1px
            no-repeat
          );
        
          will-change: transform, opacity;
          animation: scale-up ${this.animationSpeed}s linear infinite;
          animation-delay: calc(-${this.animationSpeed}s / @size() * @i());
    
          @keyframes scale-up {
            0%, 95.01%, 100% {
              transform: translateZ(0) rotate(0);
              opacity: 0;
            }
            10% { 
              opacity: 1; 
            }
            95% {
              transform: translateZ(12vmin) rotateZ(@var(--deg));
            }
          }
        </css-doodle>`
      }
    })
  }
}
