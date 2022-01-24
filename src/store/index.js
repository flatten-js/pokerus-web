import Vue from 'vue'
import Vuex from 'vuex'

import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _init: false,
    logs: []
  },

  getters: {
    init(state) {
      return state._init
    },
    logs(state) {
      return state.logs
    },
    counters(state) {
      const data = state.logs.reduce((acc, cur) => {
        return { ...acc, [cur.name]: (acc[cur.name] || 0) + 1 }
      }, {})

      return Object.keys(data).reduce((acc, cur) => {
        return [...acc, { name: cur, count: data[cur] }]
      }, [])
    }
  },

  mutations: {
    _init(state) {
      state._init = true
    },
    update(state, payload) {
      Object.keys(payload).forEach(k => state[k] = payload[k])
    },
    add_log(state, payload) {
      const { frame_path, name, status = 'auto' } = payload
      state.logs.unshift({
        uuid: uuidv4(),
        status,
        frame_path,
        name,
        updated_at: moment().format()
      })
      window.eel.update_py(state.logs)
    },
    delete_logs(state, payload) {
      const { selected } = payload
      state.logs = state.logs.filter(item => !selected.includes(item.uuid))
      window.eel.update_py(state.logs)
    }
  },

  actions: {
    async init({ getters, commit }) {
      if (getters.init) return

      const eel = window.eel
      eel.set_host('ws://localhost:8000')

      const logs = await window.eel.init_py()()
      commit('update', { logs })

      window.eel.expose(logs => {
        commit('update', { logs })
      }, 'sync_js')

      window.eel.expose((frame_path, name) => {
        commit('add_log', { frame_path, name })
      }, 'update_js')

      commit('_init')
    }
  },

  modules: {
  }
})
