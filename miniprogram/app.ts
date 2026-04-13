import { loadAppState, persistAppState } from './utils/app-state'

App<IAppOption>({
  globalData: {
    state: loadAppState(),
  },
  onLaunch() {
    persistAppState(this.globalData.state)
  },
  setState(nextState) {
    this.globalData.state = nextState
    persistAppState(nextState)
  },
  refreshState() {
    const nextState = loadAppState()
    this.globalData.state = nextState
    return nextState
  },
})
