import AppIcon from '@/components/app/AppIcon.vue'
import { defineComponent } from 'vue'
import AppButton from '@/components/app/AppButton'

export default defineComponent({
  name: 'GithubButton',
  setup() {
    return () => (
      <AppButton fab href="https://github.com/Warinyourself" class="github-link active-block" target="_blank">
        <AppIcon name="github" />
      </AppButton>
    )
  }
})
