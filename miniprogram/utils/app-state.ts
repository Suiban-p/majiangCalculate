import {
  createDefaultAppState,
  STORAGE_KEYS,
  createDefaultCurrentRound,
} from '../constants/game'
import {
  AppState,
  CurrentRoundState,
  PlayerNameTuple,
  RoundConfig,
  ScoreMap,
} from '../types/game'
import { recomputeRound } from './round'
import { getStorage, removeStorage, setStorage } from './storage'

export const loadAppState = (): AppState => {
  const defaults = createDefaultAppState()
  const playerNames = getStorage<PlayerNameTuple>(STORAGE_KEYS.playerNames, defaults.playerNames)
  const totalScores = getStorage<ScoreMap>(STORAGE_KEYS.totalScores, defaults.totalScores)
  const defaultConfig = getStorage<RoundConfig>(STORAGE_KEYS.defaultConfig, defaults.defaultConfig)
  const currentRound = getStorage<CurrentRoundState | null>(STORAGE_KEYS.currentRound, null)
  const lastCompletedRound = getStorage<CurrentRoundState | null>(STORAGE_KEYS.lastCompletedRound, null)

  return {
    totalScores,
    playerNames,
    defaultConfig,
    currentRound: currentRound ? recomputeRound(playerNames, currentRound) : null,
    lastCompletedRound: lastCompletedRound ? recomputeRound(playerNames, lastCompletedRound) : null,
  }
}

export const persistAppState = (state: AppState): void => {
  setStorage(STORAGE_KEYS.playerNames, state.playerNames)
  setStorage(STORAGE_KEYS.totalScores, state.totalScores)
  setStorage(STORAGE_KEYS.defaultConfig, state.defaultConfig)

  if (state.currentRound) {
    setStorage(STORAGE_KEYS.currentRound, state.currentRound)
  } else {
    removeStorage(STORAGE_KEYS.currentRound)
  }

  if (state.lastCompletedRound) {
    setStorage(STORAGE_KEYS.lastCompletedRound, state.lastCompletedRound)
  } else {
    removeStorage(STORAGE_KEYS.lastCompletedRound)
  }
}

export const createRoundState = (
  config: RoundConfig,
  playerNames: PlayerNameTuple,
): CurrentRoundState => createDefaultCurrentRound(config, playerNames)

export const updateCurrentRound = (
  state: AppState,
  currentRound: CurrentRoundState | null,
): AppState => {
  const nextState = {
    ...state,
    currentRound,
  }
  persistAppState(nextState)
  return nextState
}

export const applyRoundToTotalScores = (state: AppState): AppState => {
  if (!state.currentRound) {
    return state
  }

  const nextTotalScores = { ...state.totalScores }
  Object.keys(state.currentRound.tempScores).forEach((playerName) => {
    nextTotalScores[playerName] =
      (nextTotalScores[playerName] ?? 0) + state.currentRound!.tempScores[playerName]
  })

  const nextState: AppState = {
    ...state,
    totalScores: nextTotalScores,
    lastCompletedRound: state.currentRound,
    currentRound: null,
  }

  persistAppState(nextState)
  return nextState
}

export const startNextRound = (state: AppState): AppState => {
  const nextState: AppState = {
    ...state,
    currentRound: createDefaultCurrentRound(state.defaultConfig, state.playerNames),
  }
  persistAppState(nextState)
  return nextState
}

export const restartSession = (state: AppState, clearTotals: boolean): AppState => {
  const nextState: AppState = {
    ...state,
    currentRound: null,
    lastCompletedRound: null,
    totalScores: clearTotals ? createDefaultAppState().totalScores : state.totalScores,
  }
  persistAppState(nextState)
  return nextState
}

export const clearLastCompletedRound = (state: AppState): AppState => {
  const nextState: AppState = {
    ...state,
    lastCompletedRound: null,
  }
  persistAppState(nextState)
  return nextState
}
