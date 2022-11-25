import { PageModule } from '@/store/page'
import Vue from 'vue'
import { DateTimeFormatOptions } from 'vue-i18n'

const timeRef = Vue.observable({
  time: new Date(),
  shortTime: '',
  longTime: ''
})

const formatTime = (type: 'long' | 'short' = 'short') => {
  const options: DateTimeFormatOptions = {
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

  return new Intl.DateTimeFormat(PageModule.locale, options).format(new Date())
}

export const initTimer = () => {
  setInterval(updateTime, 1000)
}

const updateTime = () => {
  timeRef.time = new Date()

  timeRef.shortTime = formatTime('short')
  timeRef.longTime = formatTime('long')
}

updateTime()

export default timeRef
