import Vue from 'vue'
import { uid, Notify } from 'quasar'
import { firebaseDb, firebaseAuth } from 'boot/firebase'

const state = {
	foods: {
	// 	'id1': {
	// 		name: 'Burger',
	// 		description: 'A burger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun.',
	// 		imageUrl: 'https://i.imgur.com/0umadnY.jpg',
	// 		rating: 4
	// 	},
	// 	'id2': {
	// 		name: 'Pizza',
	// 		description: 'Pizza is a savory dish of Italian origin, consisting of a usually round, flattened base of leavened wheat-based dough.',
	// 		imageUrl: 'https://i.imgur.com/b9zDbyb.jpg',
	// 		rating: 5
	// 	},
	// 	'id3': {
	// 		name: 'Sprouts',
	// 		description: 'The Brussels sprout is a member of the Gemmifera Group of cabbages, grown for its edible buds.',
	// 		imageUrl: 'https://i.imgur.com/RbKjUjB.jpg',
	// 		rating: 1
	// 	}
	},
	foodDownloaded: false
}

const mutations = {
	deleteFood(state, id) {
		Vue.delete(state.foods, id)
	},
	addFood(state, payload) {
		Vue.set(state.foods, payload.id, payload.food)
	},
	updateFood(state, payload) {
		Object.assign(state.foods[payload.id], payload.updates)
	},
	setFoodDownloaded(state, value) {
		state.foodDownloaded = value
	},
	clearFoods(state) {
		state.foods={}
	}
}

const actions = {
	deleteFood({ dispatch }, id) {
		dispatch('fbDeleteFood', id)
	},
	addFood({ dispatch }, food) {
		let newId = uid()
		let payload = {
			id: newId,
			food: food
		}
		dispatch('fbAddFood', payload)
	},
	updateFood({ dispatch }, payload) {
		dispatch('fbUpdateFood', payload)
	},
	fbReadData({commit}){
		let userId = firebaseAuth.currentUser.uid
		// console.log(userId);
		let userFoods = firebaseDb.ref('foods/'+userId)
		// console.log(userFoods);

		// userFoods.once('value', snapshot=> {
		// 	commit('setFoodDownloaded', true)
		// }, error=> {
		// 	console.log(error.message);
		// 	this.$router.replace('/auth')
		// })
		userFoods.on('child_added', snapshot => {
			let food = snapshot.val()
			let payload = {
				id: snapshot.key,
				food: food
			}
			commit('addFood', payload)
		})

		userFoods.on('child_changed', snapshot => {
			let food = snapshot.val()
			let payload = {
				id: snapshot.key,
				updates: food
			}
			commit('updateFood', payload)
		})

		userFoods.on('child_removed', snapshot => {
			let foodId = snapshot.key
			commit('deleteFood', foodId)
		})
	},
	fbAddFood({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let foodRef = firebaseDb.ref('foods/'+userId+'/'+payload.id)
		foodRef.set(payload.food, error=>{
			if (error) {
				console.log(error.message);
				Notify.create(error.message)
			}
		})
	},
	fbUpdateFood({}, payload) {
		let userId = firebaseAuth.currentUser.uid
		let foodRef = firebaseDb.ref('foods/'+userId+'/'+payload.id)
		foodRef.update(payload.updates, error=>{
			if (error) {
				console.log(error.message);
				Notify.create(error.message)
			}
		})
	},
	fbDeleteFood({}, foodId) {
		let userId = firebaseAuth.currentUser.uid
		let foodRef = firebaseDb.ref('foods/'+userId+'/'+foodId)

		foodRef.remove(error=>{
			if (error) {
				console.log(error.message);
				Notify.create(error.message)
			}
		})

	}
}

const getters = {
	foods: (state) => {
		return state.foods
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
