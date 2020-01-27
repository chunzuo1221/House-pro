<template>
<div class="gauge-progress" percentage="60">
  <svg :id="id" class="stat-circle" viewBox="0 0 36 45">
    <path class="progress-bg"
      d="M18 33.9155
      a 15.9155 15.9155 0 0 1 0 -31.831
      a 15.9155 15.9155 0 0 1 0 31.831"
    />
    <path v-bind:class="{ progress: isActive }"
      d="M18 33.9155
      a 15.9155 15.9155 0 0 1 0 -31.831
      a 15.9155 15.9155 0 0 1 0 31.831"
    />
    <image :href="image" x="12" y="12" height="12px" width="12px"/>
    <text :x="xOffSet1" y="95%" v-show="maxValue !== 0" fill="#528EC1" font-size="12" font-weight="bold">{{ value }}</text>
    <text v-show="hideMax !== true && maxValue !== 0" :x="xOffSet2" y="95%" fill="#AAA" font-size="4">/{{ maxValue }}</text>
  </svg>
</div>
</template>
<script>
export default {
  name: 'GaugeProgress',
  props: {
    id: {
      type: String,
      required: true,
      default: null
    },
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
    image: {
      type: String,
      required: false,
      default: '/static/images/house_icon.png'
    },
    hideMax: {
      type: Boolean,
      required: false,
      default: false
    },
    height: {
      type: Number,
      required: false,
      default: 170
    }
  },
  computed: {
    xOffSet1 () {
      var value = '42%'
      if (this.value.toString().length > 1) {
        value = '30%'
      }
      if (this.value.toString().length > 3) {
        value = '14%'
      }
      return value
    },
    xOffSet2 () {
      var value = '65%'
      if (this.value.toString().length > 1) {
        value = '78%'
      }
      if (this.value.toString().length > 3) {
        value = '82%'
      }
      return value
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  mounted () {
    this.updateUI()
  },
  methods: {
    updateUI () {
      if (this.maxValue > 0) {
        this.isActive = false
        let calc = (this.value * (0.8) / (this.maxValue / 100)).toFixed(0)
        calc = calc > 80 ? 80 : calc
        this.$el.style.setProperty('--progress', calc)
        setTimeout(() => {
          this.isActive = true
          this.$forceUpdate()
        }, 100)
      }
      if (document.getElementById(this.id)) {
        document.getElementById(this.id).style.height = this.height + 'px'
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
    image: function (val) {
      this.updateUI()
    }
  }
}
</script>

<style scoped>
:root {
  --progress: 0;
}
body {
  padding: 50px;
}
.stat-circle path {
  fill: none;
}
.stat-circle path.progress-bg {
  stroke: #e0dfdf;
  stroke-width: 3.5;
  stroke-dasharray: 80 100;
  stroke-dashoffset: -10;
}
.stat-circle path.progress {
  stroke: #528EC1;
  stroke-width: 3.5;
  stroke-dashoffset: -10;
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
