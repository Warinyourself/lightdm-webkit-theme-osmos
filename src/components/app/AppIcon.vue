<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps({
  name: { type: String, default: 'heart' }
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

defineOptions({ inheritAttrs: false })

const icons = import.meta.glob('@/assets/icons/*.svg', {
  eager: true,
  import: 'default',
  query: '?component'
}) as Record<string, Component>

const icon = computed(() => {
  const key = Object.keys(icons).find((k) => k.endsWith(`/${props.name}.svg`))
  return key ? icons[key] : null
})
</script>

<template>
  <component :is="icon" v-bind="$attrs" @click="emit('click', $event as MouseEvent)" v-if="icon" />
  <div v-else class="widget-user-image" :style="`background-image: url(${name})`" />
</template>
