/// <reference path="./types/index.d.ts" />

type AppState = import('../miniprogram/types/game').AppState
type SessionState = import('../miniprogram/types/game').SessionState

interface IAppOption {
  globalData: {
    state: AppState,
    session: SessionState,
  }
  setState: (nextState: AppState) => void,
  refreshState: () => AppState,
  setDisplayPlayerName: (index: number, name: string) => void,
  resetDisplayPlayerNames: () => void,
}
