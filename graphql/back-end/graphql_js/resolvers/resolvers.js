const food = require("../meta_data/Food");
// const { PubSub } = require('graphql-subscriptions');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const pubSub = new RedisPubSub();

// const pubsub = new PubSub();

const resolvers = {
    Query: {
        food: () => food
    },
    Mutation: {
        buyFood: (_, {id}) => {
           const index = food.findIndex(f => f.id === parseInt(id));
           food[index].quantity--;
           const payload = food[index]
           pubSub.publish('FOOD_PURCHASED', {foodPurchased: payload})
           return payload
        }
    },
    Subscription: {
        foodPurchased: {
            subscribe: (root, args) => pubSub.asyncIterator(['FOOD_PURCHASED']) 
        }
    }
}

module.exports = resolvers;