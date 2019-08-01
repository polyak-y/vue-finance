import store from '../store/index'

export default function dateFilter(value, format = 'date') { //зарегистрировали глобально в main.js. Используем в Navbar.vue
  const options = {}
  const locale = store.getters.info.locale || 'ru-RU'

  if(format.includes('date')) {
    options.day = '2-digit'
    options.month = 'long'
    options.year = 'numeric'
  }
  
  if(format.includes('time')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }
  
  return new Intl.DateTimeFormat(locale, options).format(new Date(value))
}