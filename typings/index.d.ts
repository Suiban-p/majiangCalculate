/// <reference path="./types/index.d.ts" />

type AppState = import('../miniprogram/types/game').AppState

interface IAppOption {
  globalData: {
    state: AppState,
  }
  setState: (nextState: AppState) => void,
  refreshState: () => AppState,
}
