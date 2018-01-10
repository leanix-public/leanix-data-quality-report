<template>
  <collapsible :level="businessCapability.level" :loading="loading">
    <template slot="header">
      <span>{{header}}</span>
    </template>
  </collapsible>
</template>

<script>
  import scrollMonitor from 'scrollmonitor'
  import Collapsible from './Collapsible'

  export default {
    components: { Collapsible },
    props: ['businessCapability', 'idx'],
    data () {
      return {
        elementWatcher: {},
        loading: true
      }
    },
    computed: {
      header () {
        const str = `${this.businessCapability.level}.${this.idx} - ${this.businessCapability.name}`
        return str.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`).join(' ')
      }
    },
    mounted () {
      setTimeout(() => {
        this.loading = !this.loading
      }, Math.random() * (3000 - 500) + 500)
      const containerMonitor = scrollMonitor.createContainer(this.$el.parentNode)
      this.elementWatcher = containerMonitor.create(this.$el)
       this.elementWatcher.enterViewport(() => {
        console.log(`${this.businessCapability.name} entered viewport`)
      })
      this.elementWatcher.exitViewport(() => {
        console.log(`${this.businessCapability.name} left viewport`)
      })
    }
  }
</script>