/* eslint-disable no-new,no-undef */
import Raphael from 'raphael/raphael'
import 'justgage'

global.Raphael = Raphael

export default {
  inserted (el, bindings) {
    const id = `gage-element-${Math.random().toString(36).substr(2, 5)}`
    el.setAttribute('id', id)
    const defs = {
      min: 0,
      max: 100,
      decimals: 0,
      gaugeWidthScale: 0.6,
      pointer: true,
      pointerOptions: {
        toplength: 5,
        bottomlength: 15,
        bottomwidth: 2
      },
      levelColors: ['#ff0000', '#f9c912', '#30d71e']
    }
    Object.assign(defs, bindings.value)
    const gage = new JustGage({
      id,
      defaults: defs
    })
    $(el).data('gage', gage).on('mouseover', () => {
      gage.txtTitle.node.style.fill = '#2dc31d'
    }).on('mouseout', () => {
      gage.txtTitle.node.style.fill = '#999999'
    })
  },
  update (el, bindings) {
    $(el).data('gage').refresh(bindings.value.value, bindings.value.max)
  }
}
