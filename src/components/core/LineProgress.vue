<template>
  <div>
    <div v-if="lineType === 'line'" id="line-progress" class="col-sm-12">
      <div v-if="isTopMarker && maxValue > 0" class="row">
        <span class="text-right top-value-text bold-text">{{ value }}</span>
        <span class="text-left bold-text top-max-text">/{{ maxValue }}</span>
      </div>
      <svg class="line-progress" width="100%" :height="height">
        <line class="progress-bg" x1="0" y1="0" x2="100%" y2="0"/>
        <line v-bind:class="{ progress: isActive }" x1="0" y1="0" x2="100%" y2="0" :stroke-dasharray="componentWidth"/>
      </svg>
      <div v-if="!isTopMarker" class="row">
        <div class="col-xs-8 col-sm-8 text-left">{{ title }}</div>
        <div class="col-xs-4 col-sm-4 text-right">{{ value }}/{{ maxValue }}</div>
      </div>
    </div>
    <div v-else id="square-progress" class="col-sm-12">
      <div class="row">
        <div class="col-xs-8 col-sm-8 text-left">0<span v-if="unit">{{unit}}</span></div>
        <div class="col-xs-4 col-sm-4 text-right">{{ maxValue }}<span v-if="unit">{{unit}}</span></div>
      </div>
      <svg class="line-square-progress" width="100%" :height="height">
        <rect class="progress-bg" x="1" y="1" :width="linebarWidth" :height="height/2" style="fill:rgb(230, 230, 230);stroke-width:1;stroke:#528EC1" />
        <line v-bind:class="{ progress: isActive }" x1="0" y1="1" x2="100%" y2="1" :stroke-dasharray="componentWidth"/>
        <text transform="translate(100)" y="33%" font-size="12" font-weight="bold" fill="white">
          <tspan x="5%" text-anchor="middle">{{ title }}</tspan>
        </text>
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LineProgress',
  props: {
    value: {
      type: Number,
      required: true,
      default: 0.0
    },
    maxValue: {
      type: Number,
      required: true,
      default: 0.0
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    isTopMarker: {
      type: Boolean,
      required: false,
      default: false
    },
    height: {
      type: Number,
      required: false,
      default: 12
    },
    lineType: {
      type: String,
      required: false,
      default: 'line'
    },
    unit: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      componentWidth: 0,
      isActive: false
    }
  },
  computed: {
    linebarWidth () {
      let value = 0
      if (this.componentWidth > 32) {
        value = this.componentWidth - 32
      }
      return value
    }
  },
  mounted () {
    this.updateUI()
  },
  methods: {
    updateUI () {
      try {
        this.isActive = false
        this.componentWidth = this.$el.offsetWidth
        let rate = (this.maxValue / this.componentWidth)
        rate = rate === 0 ? 1 : rate
        let movement = this.componentWidth < (this.value / rate).toFixed(0) ? 0 : (this.componentWidth - (this.value / rate).toFixed(0))
        this.$el.style.setProperty('--value', movement + 30)
        this.$el.style.setProperty('--maxValue', this.componentWidth)
        setTimeout(() => {
          this.isActive = true
          setTimeout(() => {
            $('.line-square-progress line.progress').css('stroke-width', this.height)
            $('.line-square-progress line.progress-bg').css('stroke-width', this.height)
            $('.line-progress line.progress').css('stroke-width', this.height)
            $('.line-progress line.progress-bg').css('stroke-width', this.height)
          }, 100)
          this.$forceUpdate()
        }, 100)
      } catch (error) {
        console.log(error)
      }
    }
  },
  watch: {
    value: function (val) {
      this.updateUI()
    },
    maxValue: function (val) {
      this.updateUI()
    },
    title: function (val) {
      this.updateUI()
    }
  }
}
</script>

<style scoped>
:root {
  --value: 0;
  --maxValue: 0;
}
.bold-text {
  font-weight: 900;
}
.top-value-text {
  font-size: 32px;
  color: #528EC1;
}
.top-max-text {
  color: #AAA;
}
.line-progress line.progress-bg {
  fill: none;
  stroke: #e0dfdf;
}
.line-progress line.progress {
  fill: none;
  stroke: #528EC1;
  transition-timing-function: cubic-bezier(.29, 1.01, 1, -0.68);
  animation: dash 1s linear forwards;
}
.line-square-progress line.progress-bg {
  fill: none;
}
.line-square-progress line.progress {
  fill: none;
  stroke: #528EC1;
  transition-timing-function: cubic-bezier(.29, 1.01, 1, -0.68);
  animation: dash 1s linear forwards;
}
@keyframes dash {
  from {
    stroke-dashoffset: var(--maxValue);
  }
  to {
    stroke-dashoffset: var(--value);
  }
}
</style>
