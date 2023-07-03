import { reactive } from 'vue'
import { usePageStore } from '@/store/page'

const timeRef = reactive({
  time: new Date(),
  shortTime: '',
  longTime: ''
})

const formatTime = (type: 'long' | 'short' = 'short') => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }

  if (type === 'long') {
    options.month = 'long'
    options.weekday = 'long'
  }

  return new Intl.DateTimeFormat(usePageStore().locale, options).format(new Date())
}

const updateTime = () => {
  timeRef.time = new Date()
  timeRef.shortTime = formatTime('short')
  timeRef.longTime = formatTime('long')
}

export const initTimer = () => {
  updateTime()
  setInterval(updateTime, 1000)
}

export default timeRef
