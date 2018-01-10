export default {
  FETCH_BUSINESS_CAPABILITIES: `query ($filter: FilterInput!) {
    allFactSheets(filter: $filter) {
      edges {
        node {
          id
          name
          level
        }
      }
    }
  }`
}