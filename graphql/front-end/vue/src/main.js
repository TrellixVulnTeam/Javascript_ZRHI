import Vue from 'vue'
import App from './App.vue'
// import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import VueApollo from "vue-apollo";
import vuetify from './plugins/vuetify'
import { HttpLink } from 'apollo-link-http';
// import { WebSocketLink } from 'apollo-link-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities';
const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'http://localhost:4000/graphql',
})

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}));

// Create the subscription websocket link
// const wsLink = new GraphQLWsLink({
//   uri: 'ws://localhost:4000/graphql',
//   options: {
//     reconnect: true,
//   },
// })

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})


Vue.use(VueApollo) //middleware

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  vuetify,
  render: h => h(App)
}).$mount('#app')
