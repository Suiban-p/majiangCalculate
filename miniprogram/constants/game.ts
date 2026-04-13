import { AppState, BaseScore, CurrentRoundState, MaxFan, PlayerNameTuple, RoundConfig } from '../types/game'

export const STORAGE_KEYS = {
  totalScores: 'mj_total_scores',
  playerNames: 'mj_player_names',
  currentRound: 'mj_current_round',
  defaultConfig: 'mj_default_config',
} as const

export const DEFAULT_PLAYER_NAMES: PlayerNameTuple = ['玩家A', '玩家B', '玩家C', '玩家D']

export const DEFAULT_CONFIG: RoundConfig = {
  mode: 'blood_battle',
  enableGen: true,
  maxFan: 5,
  baseScore: 1,
}

export const MAX_FAN_OPTIONS: MaxFan[] = [3, 5, 8]

export const BASE_SCORE_OPTIONS: BaseScore[] = [1, 2, 5, 10]

export const BASE_FAN_OPTIONS = [1, 2, 3, 4, 5, 6] as const

export const GEN_COUNT_OPTIONS = [0, 1, 2, 3] as const

export const EMPTY_SCORE_MAP = (playerNames: PlayerNameTuple) =>
  playerNames.reduce<Record<string, number>>((result, playerName) => {
    result[playerName] = 0
    return result
  }, {})

export const createDefaultCurrentRound = (
  config: RoundConfig,
  playerNames: PlayerNameTuple,
): CurrentRoundState => ({
  config,
  settlements: [],
  tempScores: EMPTY_SCORE_MAP(playerNames),
  status: 'ongoing',
  battleState: {
    eliminated: [],
    remaining: playerNames.length,
  },
  riverState: {
    huCount: EMPTY_SCORE_MAP(playerNames),
    wallRemaining: null,
  },
})

export const createDefaultAppState = (): AppState => ({
  totalScores: EMPTY_SCORE_MAP(DEFAULT_PLAYER_NAMES),
  playerNames: DEFAULT_PLAYER_NAMES,
  currentRound: null,
  lastCompletedRound: null,
  defaultConfig: DEFAULT_CONFIG,
})
