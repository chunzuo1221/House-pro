export default {
  inserted (el) {
    el.dataset.initialText = el.innerText
  },
  update (el, binding, vnode) {
    el.disabled = binding.value.isLoading || vnode.data.attrs.disabled
    if (binding.value.isLoading) {
      el.textContent = binding.value.loadingText
      let spinner = document.createElement('span')
      spinner.classList.add('spinning')
      spinner.classList.add('glyphicon')
      spinner.classList.add('glyphicon-refresh')
      el.appendChild(spinner)
    } else {
      el.innerText = el.dataset.initialText
      if (el.querySelector('.spinning')) {
        el.removeChild(el.querySelector('.spinning'))
      }
    }
  }
}
