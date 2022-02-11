import Vue from 'vue'
import Vuex from 'vuex'

import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    _init: false,
    close: false,
    appearances: [],
    logs: []
  },

  getters: {
    init(state) {
      return state._init
    },
    close(state) {
      return state.close
    },
    logs(state) {
      return state.logs
    },
    _counters(state) {
      return state.appearances.reduce((acc, cur) => ({ ...acc, [cur]: 0 }), {})
    },
    counters(state, getters) {
      const data = state.logs.reduce((acc, cur) => {
        return { ...acc, [cur.name]: (acc[cur.name] || 0) + 1 }
      }, getters._counters)

      return Object.keys(data).reduce((acc, cur) => {
        return [...acc, { name: cur, count: data[cur] }]
      }, [])
    }
  },

  mutations: {
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

      window.eel.set_host('ws://localhost:8000')

      window.eel.onclose(() => {
        commit('update', { close: true })
        window.eel = {}
      })

      const data = await window.eel.init_py()()
      commit('update', data)

      window.eel.expose(logs => {
        commit('update', { logs })
      }, 'sync_js')

      window.eel.expose((frame_path, name) => {
        commit('add_log', { frame_path, name })
      }, 'update_js')

      commit('update', { _init: true })
    }
  },

  modules: {
  }
})
