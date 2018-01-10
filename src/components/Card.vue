<template>
  <collapsible :level="businessCapability.level">
    <template slot="header">{{businessCapability.name}}</template>
  </collapsible>
</template>

<script>
  import Collapsible from './Collapsible'

  export default {
    components: { Collapsible },
    props: ['businessCapability']
  }
</script>