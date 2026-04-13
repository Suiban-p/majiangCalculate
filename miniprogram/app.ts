import { loadAppState, persistAppState } from './utils/app-state'
import { PlayerNameTuple } from './types/game'

App<IAppOption>({
  globalData: {
    state: loadAppState(),
    session: {
      displayPlayerNames: loadAppState().playerNames,
    },
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
    if (!this.globalData.session.displayPlayerNames?.length) {
      this.globalData.session.displayPlayerNames = nextState.playerNames
    }
    return nextState
  },
  setDisplayPlayerName(index, name) {
    const nextNames = [...this.globalData.session.displayPlayerNames] as PlayerNameTuple
    nextNames[index] = name
    this.globalData.session.displayPlayerNames = nextNames
  },
  resetDisplayPlayerNames() {
    this.globalData.session.displayPlayerNames = this.globalData.state.playerNames
  },
})
