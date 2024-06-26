/* eslint-disable */
import { createStore } from "vuex";
import * as DataHandler from '../handlers/Datahandler'
import { createBucketClient } from '@cosmicjs/sdk';

export default createStore({
  state: {
    whoami: null,
  },
  mutations: {
    setWhoami(state, value) {
      state.whoami = value
    },
  },
  actions: {
    async fetchCompanies({ commit }, val) {
      try {
        const response = await DataHandler.fetchCompanies(val)
        if (response != undefined) {
          commit('setWhoami', response)
        }
        return response
      } catch (err) {
        console.log(err)
      }
    },
    async fetchMedia({ commit }, val) {
      const cosmic = createBucketClient({
        bucketSlug: 'meaghan-angel-tattoos-production',
        readKey: 'LGGedtiV9wzyTTOfrF7GvVwXq5s5a336UTw7SzEXNUnWGHMxsJ',
      });

      // Fetch content
      if(val.slug == 'flash'){
        // DO LOGIC FOR FLASH PAGE
        let query = {
          'metadata.isPortfolio': false
        }
        let resp = await cosmic.media.find(query).skip(val.page * val.size).limit(9)
        console.log(resp)
        return resp        
      } else {
        if (val.slug.length == 0 || val.slug == "all") {
        let query = {
          'metadata.isPortfolio': true
        }
        let resp = await cosmic.media.find(query).skip(val.page * val.size).limit(9)
        console.log(resp)
        return resp
      } else {
        let query = {
          folder: val.slug, 
        }
        let resp = await cosmic.media.find(query).skip(val.page * val.size).limit(9)
        console.log(resp)
        return resp

      }
      }
      

    }
  }
});