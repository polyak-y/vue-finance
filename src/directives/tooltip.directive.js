export default { // это директива, зарегистрирована глобально в main.js как tooltip. Используется уже в Planning.vue как v-tooltip="'текст тултипа"
  bind(el, {value, arg}) { //bind- служебное название, el - это будет наш элемент к которому мы применим v-tooltip, value- значение которое мы будем передавать в нашу директиву
    M.Tooltip.init(el, {html: value, position: arg || 'bottom'});
  },
  unbind(el) { //вызывается  тогда когда директива уничтожается, то есть при размонтировании компонента
    const tooltip = M.Tooltip.getInstance(el); // сделали чтобы тултипы при переходе на другой роут уничтожались а не остовались в дом дерева

    if(tooltip && tooltip.destroy) {
      tooltip.destroy()
    }
  }
}