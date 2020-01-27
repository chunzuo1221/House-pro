<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    google: null,
    map: null
  },
  provide () {
    return {
      google: this.google,
      map: this.map
    }
  }
}
</script>
