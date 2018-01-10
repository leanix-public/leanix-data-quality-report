<template>
  <div class="component-container">
    <div class="component-header">
      <slot name="header">
        Header
      </slot>
      <div style="flex: 1"/>
      <div style="cursor: pointer" @click="collapse">
        <div v-if="collapsed">
          <i class="fa fa-angle-down fa-2x" />
        </div>
        <div v-else>
          <i class="fa fa-angle-up fa-2x" />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="!collapsed" class="component-body">
        <slot name="body">
          Body
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        collapsed: true
      }
    },
    methods: {
      collapse () {
        console.log('collapsing')
        this.collapsed = !this.collapsed
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .component
    &-container
      font-size 11px
      border-radius 4px
      border 1px solid #C5C5C5
      min-width 200px
      max-width 1000px
      overflow auto
      display flex
      flex-flow column
    &-header
      background #354567
      color white
      border-radius 4px 4px 0px 0px
      padding 8px
      display flex
      flex-flow row
      align-items center
    &-body
      border-radius 0px 0px 4px 4px
      padding 8px
      background #F3F3F3
      display flex
      flex-flow row wrap
      align-items flex-start
      justify-content center
      & > *
        margin 4px
  
  .fade-enter-active, .fade-leave-active
    transition: opacity .2s
  
  .fade-enter, .fade-leave-to
    opacity: 0

</style>