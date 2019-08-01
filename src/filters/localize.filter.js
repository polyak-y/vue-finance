import store from '../store/index' //подключили наше хранилище
import ru from '../locales/ru.json'
import en from '../locales/en.json'

const locales = {
  'ru-RU': ru,
  'en-US': en
}

export default function localizeFilter(key) { // key - это наш value, то есть то к чему будет применяться фильтр
   const locale  = store.getters.info.locale  || 'ru-RU'

   return locales[locale][key] || `[Localize error]: key ${key} not found`
}