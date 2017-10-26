<template>
  <div class="report">
    <div class="row table-width no-print">
      <input v-model="searchQuery" type="text" placeholder="Search">
      <div class="spacer"/>
    </div>
    <table class="noselect">
      <thead @click.stop="toggleSorted" class="card-1">
        <tr>
          <th>Application
            <i :parameter="'application'" @click.stop="toggleSorted" :class="getSortIconClass('application')"/>
          </th>
          <th>Completion
            <i :parameter="'completion'" @click.stop="toggleSorted" :class="getSortIconClass('completion')"/>
          </th>
        </tr>
      </thead>
      <transition name="fade">
        <tbody v-if="!loading" class="custom-scrollbar">
          <tr v-for="(application, idx) in appDataset" :key="application.id" :class="getRowClass(application)">
            <td class="display-name" v-html="application.displayName"/>
            <td v-html="application.completion.percentage + ' %'"/>
          </tr>
        </tbody>
      </transition>
      <div v-if="loading" class="icon-loading-frame">
          <i class="fa fa-spinner fa-pulse fa-fw"/>
      </div>
    </table>
  </div>
</template>

<script>
import '@leanix/reporting'

const SORTING_PARAMETER = {
  APPLICATION: 'application',
  COMPLETION: 'completion'
}

const SORTING_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
}

export default {
  data () {
    return {
      data: [],
      searchQuery: '',
      sortingParameter: SORTING_PARAMETER.NONE,
      sortingOrder: SORTING_ORDER.ASC,
      setup: {},
      loading: true
    }
  },
  computed: {
    appDataset () {
      return this.data
        .filter(factSheet => factSheet.type === 'Application') // This filtering criteria shall be made at the source
        .filter(factSheet => factSheet.displayName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1)
        .map(factSheet => {
          let displayName = factSheet.displayName
          if (this.searchQuery) {
            const indices = []
            let startIndex = 0
            let index
            while ((index = displayName.toLowerCase().indexOf(this.searchQuery.toLowerCase(), startIndex)) > -1) {
              indices.push(index)
              startIndex = index + this.searchQuery.length
            }
            const substrings = indices.map(idx => displayName.substring(idx, idx + this.searchQuery.length))
              .filter((value, index, self) => self.indexOf(value) === index) // Filter repeated substrings

            substrings.forEach((substring, idx) => displayName = displayName.split(substring).join(`{{${idx}}}`))

            substrings.forEach((substring, idx) => {
              const tag = `<span style="color: #094153; font-weight: bold">${substring}</span>`
              displayName = displayName.split(`{{${idx}}}`).join(tag)
            })
          }
          return Object.assign({}, factSheet, { displayName })
        })
        .sort((a, b) => {
          if (this.sortingParameter === SORTING_PARAMETER.COMPLETION) {
            return this.sortingOrder === SORTING_ORDER.ASC ? a.completion.percentage - b.completion.percentage : b.completion.percentage - a.completion.percentage
          } else if (this.sortingParameter === SORTING_PARAMETER.APPLICATION) {
            return this.sortingOrder === SORTING_ORDER.ASC ? a.displayName.localeCompare(b.displayName) : b.displayName.localeCompare(a.displayName)
          }
        })
    }
  },
  methods: {
    toggleSorted (evt) {
      const sortingParameter = evt && evt.target ? evt.target.getAttribute('parameter') : ''
      if (Object.values(SORTING_PARAMETER).indexOf(sortingParameter) < 0) {}
      else if (this.sortingParameter !== sortingParameter) this.sortingOrder = SORTING_ORDER.ASC
      else this.sortingOrder = this.sortingOrder === SORTING_ORDER.ASC ? SORTING_ORDER.DESC : SORTING_ORDER.ASC
      this.sortingParameter = sortingParameter
    },
    getRowClass (application) {
      let clazz
      if (application && application.completion) {
        const completion = application.completion
        if (completion.percentage >= 30) clazz = 'success-on-hover'
        else if (completion.percentage > 15 && completion.percentage < 30) clazz = 'warning-on-hover'
        else if (completion.percentage <= 15) clazz = 'danger-on-hover'
      }
      return clazz
    },
    getSortIconClass (sortingParameter) {
      const clazz = ['fa']
      if (this.sortingParameter !== sortingParameter) {
        clazz.push('fa-unsorted disabled')
      } else {
        clazz.push('active')
        if (sortingParameter === SORTING_PARAMETER.APPLICATION)
          clazz.push(this.sortingOrder === SORTING_ORDER.DESC ? 'fa-sort-alpha-desc' : 'fa-sort-alpha-asc')
        else if (sortingParameter === SORTING_PARAMETER.COMPLETION)
          clazz.push(this.sortingOrder === SORTING_ORDER.DESC ? 'fa-sort-numeric-desc' : 'fa-sort-numeric-asc')
        else
          clazz.push(this.sortingOrder === SORTING_ORDER.DESC ? 'fa-sort-desc' : 'fa-sort-asc')
      }
      return clazz.join(' ')
    },
    createConfig() {
      return {
        allowEditing: false,
        menuActions: {},
        facets: [{
          key: 'main',
          attributes: ['displayName', 'type', 'description', 'completion { percentage }'],
          callback: data => { this.data = data; this.loading = false; console.log('data', data) }
        }]
      }
    }
  },
  mounted () {
    lx.init()
      .then(setup => {
        this.setup = setup
        const config = this.createConfig()
        lx.ready(config)
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~font-awesome/css/font-awesome.css'

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
