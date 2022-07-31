const { gql } = require("apollo-server-core");


const typeDefs = gql`

type Food {
    id: ID
    name: String
    description: String
    price: Float
    sides: [Side]
    quantity: Int
}

type Side {
    name: String
    description: String
    price: Float
}

# QUERY
type Query {
    food: [Food]
}

# MUTATION
type Mutation {
    buyFood(id: ID!) : Food
}

# SUBSCRIPTION
type Subscription {
    foodPurchased: Food
}
`

module.exports = typeDefs;