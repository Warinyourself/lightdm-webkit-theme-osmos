import { Component, Vue } from 'vue-property-decorator'

import AppIcon from '@/components/app/AppIcon.vue'
import AppButton from '@/components/app/AppButton'

@Component({
  components: { AppIcon, AppButton },
  funtional: true
})
export default class GithubButton extends Vue {
  render() {
    return <AppButton
      fab
      href="https://github.com/Warinyourself"
      class="github-link active-block"
      target="_blank"
    >
      <AppIcon name="github"/>
    </AppButton>
  }
}
