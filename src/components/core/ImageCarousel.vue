<template>
  <carousel
    :per-page="1"
    :navigation-enabled="true"
    :pagination-enabled="true"
    pagination-active-color="#528EC1"
    navigation-prev-label="<i class='fa fa-chevron-left'></i>"
    navigation-next-label="<i class='fa fa-chevron-right'></i>"
    :navigation-click-target-size="20"
  >
    <slide v-for="(image, i) in images" :key="i">
      <figure class="image-slide">
        <img :src="image.url">
        <span class="image-name">{{image.name}}</span>
      </figure>
    </slide>
  </carousel>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'ImageCarousel',
  components: {
    Carousel,
    Slide
  },
  props: ['images']
}
</script>

<style scoped>
.VueCarousel >>> .VueCarousel-dot-button:focus {
  outline: none !important;
}
.VueCarousel >>> .VueCarousel-pagination {
  position: absolute;
  bottom: 0;
}
.VueCarousel-navigation-prev.VueCarousel-navigation-button {
  left: 50px;
  color: #fff;
  top: calc(50% - 10px);
  font-size: 20px;
}
.VueCarousel-navigation-next.VueCarousel-navigation-button {
  right: 50px;
  color: #fff;
  top: calc(50% - 10px);
  font-size: 20px;
}
.image-slide {
  position: relative;
  min-height: 400px;
  min-width: 600px;
}
.image-slide .image-name {
  border: 2px solid #528EC1;
  padding: 3px 16px;
  position: absolute;
  top: 16px;
  right: 16px;
  color: #528EC1;
  font-weight: bold;
  background: #fff
}
</style>
