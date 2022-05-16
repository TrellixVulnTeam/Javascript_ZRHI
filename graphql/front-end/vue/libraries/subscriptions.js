const { gql } = require('graphql-tag')
const subscriptions = {
    foodPurchased: gql`subscription foodPurchased {
        foodPurchased {
          id
          name
          description
          quantity
        }
      }`
}

module.exports = subscriptions