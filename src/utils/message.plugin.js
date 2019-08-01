export default { //создали собственные плагины, и надо из зарегистрировать в main.js
  install(Vue, options) {
    Vue.prototype.$message = function(text) { //через Vue.prototype создаем собственные методы. Тут создали метод $message
      M.toast({html: text})
    }

    Vue.prototype.$error = function(text) {
      M.toast({html: `[Ошибка]: ${text}`})
    }
  } 
}