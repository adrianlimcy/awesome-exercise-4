import {firebaseAuth} from 'boot/firebase'
import {LocalStorage, Notify} from 'quasar'

const state = {
	loggedIn: false,
	email: ''
}

const mutations = {
	setLoggedIn(state, value) {
		state.loggedIn = value
	},
	setEmail(state, value) {
		state.email = value
	}

}

const actions = {
	registerUser({}, payload) {
		firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
		.then(response => {
			console.log('success');
		})
    .catch( error=> {
			console.log(error.message);
			Notify.create(error.message)
		})
	},
	signInUser({}, payload) {
		firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
		.then(response => {
			console.log('success');
		})
    .catch( error=> {
			console.log(error.message);
			Notify.create(error.message)
		})
	},
	logoutUser() {
		firebaseAuth.signOut()
	},
	handleAuthStateChange({commit, dispatch}) {
		firebaseAuth.onAuthStateChanged(user => {
		  if (user) {
		    commit('setLoggedIn', true)
				commit('setEmail', user.email)
				LocalStorage.set('loggedIn', true)
				this.$router.push('/').catch(error=>{})
				dispatch('foods/fbReadData', null, {root: true})
		  } else {
				commit('foods/clearFoods', null, {root: true} )
				commit('setLoggedIn', false)
				LocalStorage.set('loggedIn', false)
				this.$router.replace('/auth').catch(error=>{})
			}
		})
	}

}

const getters = {

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
