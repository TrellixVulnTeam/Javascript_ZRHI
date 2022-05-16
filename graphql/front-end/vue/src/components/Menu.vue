<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="foodList"
      class="elevation-1"
      :loading="loading"
    >
    <!-- QUANTITY -->
    <template v-slot:[`item.quantity`]="{ item }">
      <div>
        <td v-if="item.quantity > 0">{{ item.quantity }}</td>
        <td v-else>SOLD OUT</td>
      </div>
    </template>

    <!-- SIDES -->
    <template v-slot:[`item.sides`]="{ item }">
      <div v-for="(side, index) in item.sides" :key="index">
        <td>{{ side.name }}</td>
      </div>
    </template>

    <!-- ACTIONS -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn  rounded color="secondary" @click="buy(item.id)">Buy</v-btn>

    </template>
    </v-data-table>

    <!-- SNACKBAR purchased -->
    <v-snackbar
      v-model="successSnackbar"
      :timeout="3000"
      absolute
      shaped
      top
      color="success"
    >
      {{ successMsg }}
    </v-snackbar>

    <!-- SNACKBAR no quantity -->
    <v-snackbar
      v-model="failSnackbar"
      :timeout="3000"
      absolute
      shaped
      top
      color="red accent-2"
    >
      {{ failMsg }}
    </v-snackbar>


  </v-container>
</template>

<script>

const queries = require('../../libraries/queries')
const subscriptions = require('../../libraries/subscriptions')
const mutations = require('../../libraries/mutations')

  export default {
    name: 'Menu',
    data: () => ({
      message: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Sides', value: 'sides'},
        { text: 'Actions', value: 'actions', sortable: false}
      ],
      foodList: [],
      loading: null,
      failMsg: '',
      successMsg: '',
      successSnackbar: false,
      failSnackbar: false

    }),
    watch: {
      // --- OPTION 1 --- 
      // remove item once there is no more quantity
      // foodList(arr){
      //   for(let i = 0; i < arr.length; i++){
      //     if(arr[i].quantity === 0){
      //       this.foodList.splice(i,1)
      //     }
      //   }
      // }
    },
    methods: {
      async buy(id){
          this.$apollo.mutate({
            // Query
            mutation: mutations.buyFood,
            // variables
            variables: {
              id: id,
            }
      })
      this.notif(id)
    },
    notif(id){
      // --- OPTION 2 --- 
      // when buy button clicked and item has no more quantity display toast message
      const selectedItem = this.foodList.find(item => item.id === id)
      if(selectedItem.quantity > 0){
        this.successMsg = `Thanks for purchasing ${selectedItem.name}!`
        this.failSnackbar = false
        this.successSnackbar = true
      } else {
        this.failMsg = `Sorry! ${selectedItem.name} is sold out!`
        this.successSnackbar = false
        this.failSnackbar = true
      }
    },
    },
    apollo: {
      food: {
        query: queries.getAllFood,
        // manual: false,
        result ({data, loading}) {
          // console.log(`APOLLO FOOD QUERY${JSON.stringify(data, null, 1)}, ${loading}, ${networkStatus}`);
          this.loading = loading
          this.foodList = data.food;
        },
        // -----------------
        subscribeToMore: {
          document: subscriptions.foodPurchased,
          updateQuery: (previousData, {subscriptionData}) => {
            // *** NOTICE : Unable to reach variables in data() for some reason ***
            // Get the index of the item to update
            const indexOfItemToUpdate = previousData.food.findIndex(item => item.id === subscriptionData.data.foodPurchased.id)
            // Use the index to modify the item directly and update the quantity
            previousData.food[indexOfItemToUpdate].quantity = subscriptionData.data.foodPurchased.quantity;
            // return { food: [...previousData, ...subscriptionData.data.foodPurchased] }
          }
        }
      }
    },
  }
</script>
