<template>
  <collapsible>
    <template slot="header">{{header}}</template>
  </collapsible>
</template>

<script>
  import Collapsible from './Collapsible'

  export default {
    components: { Collapsible },
    props: ['header']
  }
</script>