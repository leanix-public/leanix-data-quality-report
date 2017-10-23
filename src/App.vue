<template>
  <div class="report">
    <div class="row table-width no-print">
      <input v-model="searchQuery" type="text" placeholder="Search">
      <div class="spacer"/>
    </div>
    <table class="noselect">
      <thead @click.stop="toggleSorted">
        <tr>
          <th>Application
            <i :parameter="'application'" @click.stop="toggleSorted" :class="getSortIconClass('application')"/>
          </th>
          <th>Completion
            <i :parameter="'completion'" @click.stop="toggleSorted" :class="getSortIconClass('completion')"/>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(application, idx) in appDataset" :key="application.id">
          <td v-html="application.displayName"/>
          <td v-html="application.percentage + ' %'"/>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import '@leanix/reporting'
import gql from 'graphql-tag'

const graphQLQuery = gql`
{
  allFactSheets (filter: {facetFilters: [{facetKey: "FactSheetTypes", keys: ["Application"]}]}) {
    edges {
      node {
        id
        displayName
        completion {
          percentage
        }
      }
    }
  }
}
`
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
      searchQuery: '',
      sortingParameter: SORTING_PARAMETER.NONE,
      sortingOrder: SORTING_ORDER.ASC,
      setup: {},
      applicationCompletionQuery: {},
      loading: 0
    }
  },
  apollo: {
    allFactSheets: {
      query: graphQLQuery,
      loadingKey: 'loading',
      error: error => console.error('ERROR IN GRAPHQL', error)
    },
  },
  computed: {
    appDataset () {
      if (this.allFactSheets && this.allFactSheets.edges) {
        return this.allFactSheets.edges
          .filter(edge => edge.node.displayName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1)
          .map(edge => {
            const node = edge.node
            let displayName = node.displayName
            if (this.searchQuery) {
              const idx = displayName.toLowerCase().indexOf(this.searchQuery.toLowerCase())
              const substring = displayName.substring(idx, this.searchQuery.length)
              displayName = displayName.replace(substring, `<span style="color: #1E88E5; font-weight: bold">${substring}</span>`)
            }
            return { id: node.id, displayName, percentage: node.completion ? node.completion.percentage : 0 }
          })
          .sort((a, b) => {
            if (this.sortingParameter === SORTING_PARAMETER.COMPLETION) {
              return this.sortingOrder === SORTING_ORDER.ASC ? a.percentage - b.percentage : b.percentage - a.percentage
            } else if (this.sortingParameter === SORTING_PARAMETER.APPLICATION) {
              return this.sortingOrder === SORTING_ORDER.ASC ? a.displayName.localeCompare(b.displayName) : b.displayName.localeCompare(a.displayName)
            }
          })
      } else return []
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
        menuActions: {},
        facets: [{
          key: 'main',
          attributes: ['displayName', 'type', 'description'],
          callback: data => {
            this.data = data
            this.groups = _.groupBy(data, 'type')
          }
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
grey-400 = #BDBDBD
grey-800 = #424242
blue-600 = #1E88E5

table-max-width = 980px

.active
  color: blue-600

.disabled
  color: grey-400

.noselect
  -webkit-touch-callout: none
  -webkit-user-select: none
  -khtml-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

.spacer
  flex: 1

.tagged-substring
  color: blue

.report
  display: flex
  flex-flow: column
  align-items: center
  justify-content: center
  font-family: Arial, Helvetica, sans-serif
  font-size: 14px
  color: #555

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
    border: 1px solid #ccc
    border-radius: 3px
    box-sizing: border-box

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
  background: grey-100
  display:table
  width:calc(100% - 18px)
  font-size: 1.2rem
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
  margin-bottom: 1px
  & tr th
    @media screen and (max-width: 600px)
      font-size 0.9rem
    & i
      padding: 0 0.7rem
      font-size: 1rem
      cursor: pointer

tbody
  max-height: 500px
  overflow: auto
  overflow-x: hidden
  display: block
  width: 100%
  & tr:hover 
    font-size: 1.2rem
    font-weight: bold
    color: blue-600

  & tr:nth-child(even)
    background-color: grey-100

tbody tr
  display:table
  width:100%
  table-layout: fixed
  -webkit-transition: all 0.2s ease
  -moz-transition: all 0.2s ease
  -o-transition: all 0.2s ease
  transition: all 0.2s ease

.card-1 {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

@media print
  .no-print, .no-print *
    display: none !important

</style>
