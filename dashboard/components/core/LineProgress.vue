<template>
  <div>
    <div v-if="lineType === 'line'" id="line-progress">
      <div v-if="isTopMarker && maxValue > 0" class="text-xs-center">
        <span class="top-value-text bold-text">{{ value }}</span>
        <span class="bold-text top-max-text">/{{ maxValue }}</span>
      </div>
      <svg class="line-progress" viewBox="0 0 100 3">
        <path class="progress-bg" :stroke-width="height" d="M0 0 l100 0"/>
        <path v-bind:class="{ progress: isActive }" :stroke-width="height" d="M0 0 l100 0"/>
      </svg>
      <div v-if="!isTopMarker" class="display-block">
        <div class="pull-left">{{ title }}</div>
        <div class="pull-right">{{ value }}/{{ maxValue }}</div>
      </div>
    </div>
    <div v-else id="square-progress">
      <div class="display-block">
        <div class="pull-left">0<span v-if="unit">{{unit}}</span></div>
        <div class="pull-right">{{ maxValue }}<span v-if="unit">{{unit}}</span></div>
      </div>
      <svg class="line-square-progress" viewBox="0 0 100 3">
        <path class="progress-stroke" :stroke-width="height" d="M0 0 l100 0"/>
        <path class="progress-bg" :stroke-width="height" d="M0 0 l100 0"/>
        <path v-bind:class="{ progress: isActive }" :stroke-width="height" d="M0 0 l100 0"/>
      </svg>
      <div class="title">
        <span>{{ title }}</span>
      </div>
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
      default: 4
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
        let rate = (this.maxValue / 100)
        rate = rate === 0 ? 1 : rate
        let movement = (this.value / rate).toFixed(0) > 100 ? 0 : (this.value / rate).toFixed(0)
        this.$el.style.setProperty('--progress', movement)
        setTimeout(() => {
          this.isActive = true
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
  --progress: 0;
}
.display-block {
  display: block;
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.bold-text {
  font-weight: 900;
}
.title {
  margin-top: -33px;
  margin-left: 15px;
  color: #FFF;
}
.title span {
  font-size: 15px;
  font-weight: bold;
}
.top-value-text {
  font-size: 32px;
  color: #528EC1;
}
.top-max-text {
  color: #AAA;
}
.line-progress path.progress-bg {
  stroke: #e0dfdf;
}
.line-progress path.progress {
  stroke: #528EC1;
  transition-timing-function: cubic-bezier(.29, 1.01, 1, -0.68);
  animation: dash 2s linear forwards;
}
.line-square-progress {
  border: solid 2px rgb(82, 142, 193);
}
.line-square-progress path.progress-stroke {
  stroke: #528EC1;
}
.line-square-progress path.progress-bg {
  stroke: #e0dfdf;
}
.line-square-progress path.progress {
  stroke: #528EC1;
  transition-timing-function: cubic-bezier(.29, 1.01, 1, -0.68);
  animation: dash 2s linear forwards;
}
@keyframes dash {
  from {
    stroke-dasharray: 0 100;
  }
  to {
    stroke-dasharray: var(--progress) 100;
  }
}
</style>
