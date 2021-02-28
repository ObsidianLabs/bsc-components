import { Map } from 'immutable'

export default {
  default: Map(),
  persist: true,
  actions: {
    ABI_ADD: {
      reducer: (state, { payload }) => {
        return state.set(payload.codeHash, Map(payload))
      }
    },
    ABI_DELETE: {
      reducer: (state, { payload }) => state.remove(payload)
    },
    ADD_DEFAULT_ABIS: {
      reducer: state => state
    },
  }
}