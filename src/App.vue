<template>
  <div class="report">
    <card :header="'Business Capability Header'" />
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
import Card from './components/Card'
import Collapsible from './components/Collapsible'

export default {
  components: { Card, Collapsible },
  data () {
    return {
      setup: {}
    }
  },
  methods: {
    getData () {
      lx.executeGraphQL(`{
        allFactSheets(factSheetType: ITComponent) {
          edges {
            node {
              name
              type
              description
            }
          }
        }
      }`)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.error(error)
      })
    }
  },
  mounted () {
    lx.init()
      .then(setup => {
        this.setup = setup
        lx.ready({})
      })
    setTimeout(() => {
      console.log('gettiong data')
      this.getData()
    }, 5000)
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

table-max-width = 980px

.active
  color green-leanix

.disabled
  color grey-400

.success-on-hover
  &:hover
    color success 
.warning-on-hover
  &:hover
    color warning
.danger-on-hover
  &:hover
    color danger

.display-name
  color grey-800

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
  display: flex
  flex-flow: column
  align-items: center
  justify-content: center
  font-family: Arial, Helvetica, sans-serif
  font-size: 14px
  color: grey-800

.fullwidth
  width: 100%

.table-width
  width: 100%
  max-width: 980px

.row
  display: flex
  margin-bottom: 0.5rem

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

table
  width: 100%
  max-width: table-max-width
  table-layout: fixed
  margin: auto
  cursor: default
  color: grey-800

th, td
  padding: 5px 10px
  text-align: center

thead
  background: grey-leanix
  display:table
  width:calc(100% - 18px)
  font-size: 1.2rem
  margin-bottom: 1px
  & tr th
    @media screen and (max-width: 600px)
      font-size 0.9rem
    & i
      padding: 0 0.7rem
      font-size: 1rem
      cursor: pointer

tbody
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
  max-height: 500px
  overflow: auto
  overflow-x: hidden
  display: block
  width: 100%

  & tr:hover 
    font-size: 1.6rem
    font-weight: bold

  & tr:nth-child(even)
    background-color: grey-100

tbody tr
  display:table
  width:100%
  table-layout: fixed
  -webkit-transition: all 0.4s ease
  -moz-transition: all 0.4s ease
  -o-transition: all 0.4s ease
  transition: all 0.4s ease

.icon-loading-frame
  display flex
  justify-content center
  align-items center
  height 500px
  & i
    color grey-500
    font-size 6rem
  @media screen and (max-width: 600px)
    height 200px
    & i 
      font-size 5rem
  

.card-1
  box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)

.fade-enter-active, .fade-leave-active
  transition opacity .5s

.fade-enter, .fade-leave-to
  opacity 0

@media print
  .no-print, .no-print *
    display: none !important

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
