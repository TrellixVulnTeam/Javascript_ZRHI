const { gql } = require('graphql-tag')
const mutations = {
    buyFood: gql`mutation ($id: ID!){
        buyFood(id: $id) {
          id
          name
        }
      }`
}

module.exports = mutations;
