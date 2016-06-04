<template lang="pug">
  div.alerts
    div(v-for="alert in alerts" v-bind:class="alert.type" transition="expand")
      p {{alert.message}}
</template>
<script>
export default {
  props: ['alerts']
}
</script>
<style lang="sass">
.alerts
  position: fixed
  top: 50px
  left: 0
  right: 0
  z-index: 1

  div
    background: #bbb
    overflow: hidden

    &.error
      background: #e03c3c
      color: #fff

    &.success
      background: #41b883
      color: #fff

  p
    width: 480px
    margin: 0 auto
    padding: 4px
    text-align: center

.expand-transition
  max-height: 200px /* height 0 -> auto is not animatable, so use max-height 0 -> large height */
  transition: max-height 1s ease

.expand-enter, .expand-leave
  max-height: 0

</style>
