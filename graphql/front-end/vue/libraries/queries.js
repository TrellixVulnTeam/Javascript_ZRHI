const { gql } = require('graphql-tag')
const queries = {
    getAllFood: gql`query GetAllFood {
      food {
        id
        name
        description
        price
        quantity
        sides {
          name
        }
      }
    }`
}

module.exports = queries;