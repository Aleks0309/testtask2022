import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    positions: [],
    token: "",
    displaySize: document.body.clientWidth,
    firstLink: 'https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=',
    totalPages: null,
    nextLink: null
  },
  mutations: {
    SET_USERS_TO_STATE: (state, users) => {
      state.users = users.users;
      state.totalPages = users.total_pages;
      state.nextLink = users.links.next_url;
    },

    SET_NEW_USER: (state, users) => {
        state.users = users.users;
        state.totalPages = users.total_pages;
        state.nextLink = users.links.next_url;
        document.querySelector('#singup').classList.add('d-none')
        document.querySelector('#success').classList.remove('d-none')
        setTimeout(function(){
                document.querySelector('#singup').classList.remove('d-none')
                document.querySelector('#success').classList.add('d-none')
        }, 3000);
    },

    SET_MORE_USERS: (state, users) => {
      state.users.push(...users.users);
      if(users.page == state.totalPages){
        state.nextLink = null
      } else state.nextLink = users.links.next_url;
    },

    SET_POSITIONS_TO_STATE: (state, positions) => {
      state.positions = positions.positions;
    },

    SET_TOKEN_TO_STATE: (state, token) => {
        state.token = token.token
    }
  },
  actions: {
    GET_USERS_FROM_API({commit}){
      let count = 6;

      return axios
          .get(this.state.firstLink + count)
          .then((users) => {
            commit('SET_USERS_TO_STATE', users.data);
            return users;
          })
          .catch((error) => {
            console.log(error);
            return error;
          })
    },

    GET_MORE_USERS({commit}){
      return axios
          .get(this.state.nextLink)
          .then((users) => {
            commit('SET_MORE_USERS', users.data);
            return users
          })
          .catch((error) => {
            console.log(error);
            return error;
          })
    },

    GET_POSITIONS_FROM_API({commit}){
      return axios
          .get('https://frontend-test-assignment-api.abz.agency/api/v1/positions')
          .then((positions) => {
            commit('SET_POSITIONS_TO_STATE', positions.data);
            return positions;
          })
          .catch((error) => {
            console.log(error);
            return error;
          })
    },

    GET_TOKEN_FROM_API({commit}) {
        return axios
            .get('https://frontend-test-assignment-api.abz.agency/api/v1/token' )
            .then((token) => {
                commit('SET_TOKEN_TO_STATE', token.data);
                return token;
            })
            .catch(error => console.log(error));
    },

    POST_USER_TO_API({commit}, fdata) {
        let formData = new FormData();
        let fileField = document.querySelector('input[type="file"]');
        formData.append('position_id', fdata.position_id);
        formData.append('name', fdata.name);
        formData.append('email', fdata.email);
        formData.append('phone', fdata.phone);
        formData.append('photo', fileField.files[0]);
        const config = {
            headers:{
                'Token': fdata.token
            }
        }
        return axios
            .post('https://frontend-test-assignment-api.abz.agency/api/v1/users', formData, config)
            .then(data => {
                if(data.data.success){
                    axios
                        .get('https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=6')
                        .then((users) => {
                            commit('SET_NEW_USER', users.data);
                            return users;
                        })
                        .catch((error) => {
                            console.log(error);
                            return error;
                        })
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }
  },
  getters: {
    USERS(state){
      return state.users
    },
    POSITIONS(state){
      return state.positions
    },
    NEXT_LINK(state){
      return state.nextLink
    },
    TOKEN(state){
        return state.token
    }
  }

})
