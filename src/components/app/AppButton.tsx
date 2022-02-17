import { Component, Prop, Vue } from 'vue-property-decorator'
import AppIcon from '@/components/app/AppIcon.vue'
import { Route } from 'vue-router'
import { CreateElement, VNode, VNodeData } from 'vue'
import { RenderContext } from 'vue/types/umd'
import { spawn } from 'child_process'

const prefix = 'app-button'

interface AppButtonPropsInterface {
  label: string;
  icon?: string;
  fab?: boolean;
  tag?: string;
  link?: boolean;
  nuxt?: boolean;
  block?: boolean;
  target?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: string;
  to?: Route | string;
  href?: Route | string;
}

@Component({
  components: {
    AppIcon
  }
})
export default class AppButton extends Vue implements AppButtonPropsInterface {
  @Prop({ type: String }) label!: string
  @Prop({ type: String }) icon!: string
  @Prop({ type: String }) type!: string
  @Prop({ type: Boolean }) fab!: boolean
  @Prop({ type: Boolean }) link!: boolean
  @Prop({ type: Boolean }) block!: boolean
  @Prop({ type: String }) target!: string
  @Prop({ type: Boolean }) loading!: boolean
  @Prop({ type: Boolean }) nuxt!: boolean
  @Prop({ type: String, default: 'transparent' }) color!: string
  @Prop({ type: Boolean }) disabled!: boolean
  @Prop({ type: String, default: 'button' }) tag!: string
  @Prop({ type: [Object, String] }) to!: Route | string
  @Prop({ type: [Object, String] }) href!: Route | string

  get classes() {
    const classes: Record<string, boolean> = { [prefix]: true, [`${prefix}--${this.color}`]: true }
    const propertyList: Array<keyof AppButtonPropsInterface> = ['fab', 'block']

    propertyList.forEach(property => {
      classes[`${prefix}--${property}`] = !!this[property]
    })

    return {
      ...classes
    }
  }

  get isLink() {
    return this.to || this.href || this.link
  }

  generateRouteLink() {
    let tag

    const data: VNodeData = {
      attrs: {
        tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined
      },
      class: this.classes,
      [this.to ? 'nativeOn' : 'on']: {
        ...this.$listeners
      },
      ref: 'link'
    }

    if (this.to) {
      tag = this.nuxt ? 'nuxt-link' : 'router-link'
    } else {
      tag = (this.href && 'a') || this.tag || 'div'

      if (tag === 'a' && this.href) data.attrs!.href = this.href
    }

    if (this.target) data.attrs!.target = this.target

    return { tag, data }
  }

  buildContent() {
    return <span class={ `${prefix}__content` }> { this.$slots.default } </span>
  }

  buildLoader() {
    return <span class={ `${prefix}__loader` }>
      { this.$slots.loader || <AppIcon name='loader' /> }
    </span>
  }

  render(h: CreateElement): VNode {
    const children = [
      this.buildContent(),
      this.loading && this.buildLoader()
    ]
    const { tag, data } = this.generateRouteLink()

    if (tag === 'button') {
      data.attrs!.type = this.type
      data.attrs!.autofocus = true
      data.attrs!.disabled = this.disabled
    }

    return h(tag, data, children)
  }
}
