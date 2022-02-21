import { Component, Prop, Vue } from 'vue-property-decorator'
import { PageModule } from '@/store/page'
import AppIcon from '@/components/app/AppIcon.vue'
import AppButton from './AppButton'
import { stopPropagation } from '@/utils/helper'

@Component({
  components: { AppIcon }
})
export default class AppDialog extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean
  @Prop({ default: '' }) label!: string

  get dialog() {
    return PageModule.dialog
  }

  get showDialog() {
    return !!this.dialog
  }

  generateDialog() {
    return <div class="dialog-overlay active-block" onClick={ PageModule.closeDialog }>
      <div class="dialog-body" onClick={ stopPropagation }>
        <h5 class="dialog-title"> { this.$t(this.dialog?.title + '') } </h5>
        <p class="dialog-text"> { this.$t(this.dialog?.text + '') } </p>
        { this.generateButtons() }
      </div>
    </div>
  }

  generateButtons() {
    const buttons = this.dialog?.actions.map(({ title, callback }) => {
      return <AppButton onClick={ callback }> { this.$t(title + '') } </AppButton>
    })

    return <div class="dialog-buttons"> { buttons } </div>
  }

  render() {
    return <transition name="fade">
      { this.showDialog && this.generateDialog() }
    </transition>
  }
}
