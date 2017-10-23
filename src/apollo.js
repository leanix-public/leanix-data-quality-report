import Vue from 'vue'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

const getToken = () => {
  const apiBaseUrl = 'https://app.leanix.net'
  const apiToken = 'wE3QF4D7SFDzBTq7vVMXZXdBu84FktRwxmXHrYyg'
  return new Promise((resolve, reject) => {
    const url = `${apiBaseUrl}/services/mtm/v1/oauth2/token`
    const auth = btoa("apitoken:" +  apiToken);
    const settings = {
      async: true,
      url,
      method: 'POST',
      headers: { authorization: `Basic ${auth}` },
      data: { grant_type: 'client_credentials' }
    }
    $.ajax(settings).done(res => resolve(res.access_token))
  })
}

const networkInterface = createNetworkInterface({
  uri: 'https://app.leanix.net/services/pathfinder/v1/graphql',
  transportBatching: true
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) req.options.headers = {}
    getToken()
    .then(token => {
      req.options.headers.authorization = `Bearer ${token}`
      next()
    })
  }
}])

networkInterface.useAfter([{
  applyAfterware ({ response }, next) {
    console.log('RES', response)
    if (response.status === 401) {
      console.warn('GOT 401, should get another token')
    }
    next()
  }
}])

const apolloClient = new ApolloClient({
  networkInterface,
  connectToDevTools: true
})


export default new VueApollo({ defaultClient: apolloClient })