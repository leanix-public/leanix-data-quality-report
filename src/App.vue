<template>
  <div class="report-container custom-scrollbar">
    <card v-for="(businessCapability, idx) in businessCapabilitiesL1" :key="idx" :businessCapability="businessCapability" :idx="idx"/>
    <collapsible>
      <template slot="header">Level 1 header</template>
      <template slot="body">
        <collapsible>
          <template slot="header">Level 2 header (#1)</template>
          <template slot="body">Body from app!</template>
        </collapsible>
        <collapsible>
          <template slot="header">Level 2 header (#2)</template>
          <template slot="body">Body from app!</template>
        </collapsible>
        <collapsible>
          <template slot="header">Level 2 header (#3)</template>
          <template slot="body">Body from app!</template>
        </collapsible>
        <collapsible>
          <template slot="header">Level 2 header (#4)</template>
          <template slot="body">Body from app!</template>
        </collapsible>
        <collapsible>
          <template slot="header">Level 2 header (#5)</template>
          <template slot="body">
            <collapsible>
              <template slot="header">Level 3 header (#1)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
             <collapsible>
              <template slot="header">Level 3 header (#2)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
             <collapsible>
              <template slot="header">Level 3 header (#3)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
            <collapsible>
              <template slot="header">Level 3 header (#4)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
          </template>
        </collapsible>
        <collapsible>
          <template slot="header">Level 2 header (#6)</template>
          <template slot="body">
            <collapsible>
              <template slot="header">Level 3 header (#1)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
             <collapsible>
              <template slot="header">Level 3 header (#2)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
             <collapsible>
              <template slot="header">Level 3 header (#3)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
            <collapsible>
              <template slot="header">Level 3 header (#4)</template>
              <template slot="body">Body from app!</template>
            </collapsible>
          </template>
        </collapsible>
      </template>
    </collapsible>
  </div>
</template>

<script>
import '@leanix/reporting'
import graphql from './graphql'
import Card from './components/Card'
import Collapsible from './components/Collapsible'

export default {
  components: { Card, Collapsible },
  data () {
    return {
      setup: {},
      nodes: {},
      loading: 0
    }
  },
  methods: {
    fetchLevel1BusinessCapabilities () {
      const query = graphql.queries.FETCH_BUSINESS_CAPABILITIES
      const variables = {
        filter: {
          facetFilters: [
            { facetKey: 'FactSheetTypes', keys: ['BusinessCapability'] },
            { facetKey: 'hierarchyLevel', keys: ['1'] },
          ]
        }
      }
      this.loading++
      lx.executeGraphQL(query, variables)
        .then(res => {
          this.loading--
          if (res.allFactSheets) {
            this.nodes = res.allFactSheets.edges
              .map(edge => edge.node)
              .reduce((nodes, node) => {
                nodes[node.id] = node
                delete nodes[node.id]['id']
                return nodes
              }, {})
          }
        })
        .catch(error => {
          this.loading--
          console.error(error)
        })
    }
  },
  computed: {
    businessCapabilitiesL1 () {
      return Object.keys(this.nodes).filter(id => this.nodes[id].level === 1).map(id => this.nodes[id])
    }
  },
  mounted () {
    lx.init()
      .then(setup => {
        this.setup = setup
        lx.ready({})
        this.fetchLevel1BusinessCapabilities()
      })
  }
}
</script>

<style lang="stylus" scoped>

font-size = 14px
grey-100 = #F5F5F5
grey-500 = #9E9E9E
grey-800 = #424242
grey-leanix = #e6e6e6
blue-leanix = #094153
green-leanix = #028512

success = green-leanix
warning = #F57F17
danger = #C62828

.noselect
  -webkit-touch-callout: none
  -webkit-user-select: none
  -khtml-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

.spacer
  flex: 1

.report
  &-container
    display flex
    flex-flow column
    align-items center
    justify-content flex-start
    font-family Arial, Helvetica, sans-serif
    font-size 12px
    color grey-800
    height calc(100vh - 17px)
    overflow-y auto

input[type=text]
    width 400px
    @media screen and (max-width: 600px)
      width: 100%
    padding: 0.5rem 1rem
    display: inline-block
    border: 1px solid grey-leanix
    border-radius: 3px
    box-sizing: border-box
    transition: all 0.2s
    &:focus
      outline none !important
      border 1px solid grey-500
      box-shadow 0 0 5px grey-500


.card-1
  box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)

.fade-enter-active, .fade-leave-active
  transition opacity .5s

.fade-enter, .fade-leave-to
  opacity 0

.custom-scrollbar
  &::-webkit-scrollbar-track
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
    background-color: grey-100
  &::-webkit-scrollbar
    width: 0.5em
    background-color: transparent
  &::-webkit-scrollbar-thumb
    background-color: #a9a9a9
    outline: 1px solid #708090

</style>
