import axios from 'axios'
import firebase from "firebase/app"
const key = process.env.VUE_APP_TMDB

export default {

	async getSearchResults({commit}, search) {
		try {
			const responseMovie = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}
				&language=en-US
				&query=${search}
				&page=1
				&include_adult=false
			`)
			const responseTv = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${key}
				&language=en-US
				&query=${search}
				&page=1&include_adult=false
			`)
			commit('searchResults', [...responseMovie.data.results, ...responseTv.data.results])
		} catch(e) { console.log(e) }
	},


	async getTrending({commit}) {
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${key}`)
			commit('trending', response.data.results)
		} catch(e) { console.log(e) }
	},
 

	async getMyList({commit, dispatch, state}) {
		try {
			const id = await dispatch('getUid')
			if (id) {
				await firebase
					.database()
					.ref(`users/${id}/my-list`)
					.orderByChild('timestamp')
					.on('value', (snapshot) => {
						const data = snapshot.val() || {}
						commit('myList', data)
					})
			}
		} catch(e) { console.log(e) }
	},


	async changeMyList({dispatch, state, commit}, content) {
		const id = await dispatch('getUid')
		const isThereContent = Object.prototype.hasOwnProperty.call(state.myList, content.id)

		if (!isThereContent && id) {
			try {
				firebase.database()
								.ref(`users/${id}/my-list`)
								.child(content.id)
								.set(content)
			} catch(e) { console.log(e) }
			
		} else if (isThereContent && id) {
			try {
				firebase.database()
								.ref(`users/${id}/my-list`)
								.child(content.id)
								.remove()
			} catch(e) { console.log(e) }
		}
	},

	async getFilms({commit}) {
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`)
			commit('films', response.data.results)
		} catch(e) { console.log(e) }
	},


	async getShows({commit}) {
		try {
			const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${key}&language=en-US&page=1`)
			commit('shows', response.data.results)
		} catch(e) { console.log(e) }
	},


	async getGenres({commit}, routeName) {
		let type
		try {

			if (routeName === 'films') type = 'movie'
			else if (routeName === 'shows') type = 'tv'

			const response = await axios.get(`https://api.themoviedb.org/3/genre/${type}/list?api_key=${key}&language=en-US`)
			commit('genres', response.data.genres)
		} catch(e) { console.log(e) }
	},
}





/////////////////////////////////
// export default {

	// 	try {
	// 		const trending = await firebase.database().ref('trending/')

	// 		trending.on('value', (payload) => {
	// 			const data = payload.val();
	// 			commit('trending', data);
	// 		})
	// 	} catch(e) { console.log(e) }
	// },

	// getMyList({commit}) {
	// 	const myList = firebase.database().ref('my-list/')

	// 	myList.on('value', (payload) => {
	// 		const data = payload.val();
	// 		commit('myList', data);
	// 	})
	// },

	// getFilms({commit}) {
	// 	const films = firebase.database().ref('films/')

	// 	films.on('value', (payload) => {
	// 		const data = payload.val();
	// 		commit('films', data);
	// 	})
	// },

	// getShows({commit}) {
	// 	const shows = firebase.database().ref('shows/')

	// 	shows.on('value', (payload) => {
	// 		const data = payload.val();
	// 		commit('shows', data);
	// 	})
	// },

	// getGenres({commit}) {
	// 	const genres = firebase.database().ref('genres/')

	// 	genres.on('value', (payload) => {
	// 		const data = payload.val();
	// 		commit('genres', data);
	// 	})
	// },
// }

// export default {
	// getTrending({commit}) {
	// 	axios('http://localhost:3000/trending', {
	// 		method: 'GET'
	// 	})
	// 	.then(response => {
	// 		commit('trending', response.data)
	// 	})
	// 	.catch(e => console.log(e))
	// },

// 	getMyList({commit}) {
// 		axios('http://localhost:3000/my-list', {
// 			method: 'GET'
// 		})
// 		.then(response => {
// 			commit('myList', response.data)
// 		})
// 		.catch(e => console.log(e))
// 	},

// 	getFilms({commit}) {
// 		axios('http://localhost:3000/films', {
// 			method: 'GET'
// 		})
// 		.then(response => {
// 			commit('films', response.data)
// 		})
// 		.catch(e => console.log(e))
// 	},

// 	getShows({commit}) {
// 		axios('http://localhost:3000/shows', {
// 			method: 'GET'
// 		})
// 		.then(response => {
// 			commit('shows', response.data)
// 		})
// 		.catch(e => console.log(e))
// 	},

// 	getGenres({commit}) {
// 		axios('http://localhost:3000/genres', {
// 			method: 'GET'
// 		})
// 		.then(response => {
// 			commit('genres', response.data)
// 		})
// 		.catch(e => console.log(e))
// 	},
// }
