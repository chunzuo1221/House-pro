<template>
  <div id="app">
    <app-header/>
    <section class="router-view-container">
      <router-view/>
    </section>
    <app-footer/>
    <!-- scroll to top -->
    <a href="#" class="scrollup">
      <i class="fa fa-angle-up"></i>
    </a>
  </div>
</template>

<script>
import AppHeader from '@/components/core/AppHeader'
import AppFooter from '@/components/core/AppFooter'
import {
  LOAD_GOOGLE_MAPS_API
} from '@/store/action-types'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
  async mounted () {
    // it goes from theme
    const $win = $(window)
    const $header = $('header')
    const $scrollup = $('.scrollup')

    // scroll function for changed css starts
    $win.scroll(function () {
      // shrink headers
      if ($(this).scrollTop() > 0) {
        $header.addClass('scrolled')
      } else {
        $header.removeClass('scrolled')
      }

      // back to top
      if ($(this).scrollTop() > 200) {
        $scrollup.fadeIn()
      } else {
        $scrollup.fadeOut()
      }
    })

    $scrollup.on('click', function () {
      $('body,html').animate({
        scrollTop: 0
      }, 600)
      return false
    })
    await this.$store.dispatch(LOAD_GOOGLE_MAPS_API)
  }
}
</script>

<style>
.router-view-container {
  min-height: 100vh;
}
/* custom styles for vue components */
.el-select .el-tag {
  background-color: #528EC1;
}
.el-tag {
  font-size: 16px;
}
.el-tag .el-icon-close {
  font-size: 19px;
}
.el-tag--info, .el-tag--info .el-tag__close {
  color: white;
}
.el-select .el-tag__close.el-icon-close {
  margin-right: 3px;
  background-color: transparent;
}
.el-select .el-tag__close.el-icon-close:hover {
  background-color: transparent;
  font-size: 20px;
}
/* vue-snack style customize */
.snackbar {
  z-index: 999;
  font-size: 18px;
  padding: 10px 20px;
}
/* property image */
.property-image-box {
  margin-right: 20px;
  margin-top: -170px;
  display: flex;
  align-items: flex-end;
}
figure img.property-image {
  width: 100%;
  cursor: pointer;
  object-fit: cover;
  height: fill-available;
}
.lst-vw.top .property-heading i {
  color: black;
}
.btn-rect {
  border-radius: 0 !important;
}
.level-score {
  text-align: center;
  border: 3px solid #528EC1;
  border-radius: 20px;
  max-width: 200px;
  width: 100%;
  color: #528EC1;
  padding: 16px;
}
.level-score .score {
  font-size: 6em;
  font-weight: bold;
  line-height: 1.2;
}
.level-score .text {
  font-size: 1.3em;
  font-weight: bold;
  line-height: 1.4;
}
.highlight {
  font-weight: bold;
}
</style>
