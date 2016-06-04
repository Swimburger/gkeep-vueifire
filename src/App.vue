<template lang="pug">
  div
    header-bar
    alerts(v-bind:alerts="alerts")
    router-view
</template>
<script>
import Alerts from './components/Alerts'
import HeaderBar from './components/HeaderBar'
export default {
  components: {
    Alerts,
    HeaderBar
  },
  data () {
    return {
      alerts: []
    }
  },
  events: {
    'alert': function (alert) {
      this.alerts.push(alert)
      setTimeout(() => {
        this.alerts.$remove(alert)
      }, alert.duration || 1500)
    },
    'search': function (searchText) {
      this.$broadcast('search', searchText) // send the event downwards to children
    }
  }
}
</script>
<style lang="sass">
*
  padding: 0
  margin: 0
  box-sizing: border-box

html
  position: relative
  min-height: 100%
  font-family: 'Roboto', sans-serif

body
  background: #eee
  min-height: 100%

  > div
    padding: 50px 16px
    min-height: 100vh
    background: #eee
    position: relative
    margin-bottom: 50px
    z-index: 1
    box-shadow: 0 2px 5px #111

footer
  background: #333
  color: #fff
  text-align: center
  padding: 12px 0 10px
  position: fixed
  bottom: 0
  height: 50px
  width: 100%

  a
    color: #e03c3c

  .fa-heart
    margin: 0 10px 0 0

  iframe
    position: relative
    top: 4px

.clearfix:after
  content: ""
  display: table
  clear: both

</style>
