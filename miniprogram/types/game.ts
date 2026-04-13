export type PlayerName = string

export type PlayerNameTuple = [PlayerName, PlayerName, PlayerName, PlayerName]

export type GameMode = 'blood_battle' | 'blood_river'

export type SettlementType = 'hu' | 'gang' | 'chadajiao'

export type GangType = 'an' | 'ming' | 'jia'

export type RoundStatus = 'ongoing' | 'completed'

export type MaxFan = 3 | 5 | 8

export type BaseScore = 1 | 2 | 5 | 10

export type ScoreMap = Record<PlayerName, number>

export interface SettlementDistribution {
  [playerName: string]: number
}

export interface RoundConfig {
  mode: GameMode
  enableGen: boolean
  maxFan: MaxFan
  baseScore: BaseScore
}

export interface SettlementBase {
  id: string
  type: SettlementType
  timestamp: number
  points: number
  distribution: SettlementDistribution
}

export interface HuSettlement extends SettlementBase {
  type: 'hu'
  winners: PlayerName[]
  loser: PlayerName | null
  isZimo: boolean
  baseFan: number
  genCount: number
  totalFan: number
  labels?: string[]
}

export interface GangSettlement extends SettlementBase {
  type: 'gang'
  winner: PlayerName
  loser: PlayerName | null
  gangType: GangType
}

export interface ChaDaJiaoSettlement extends SettlementBase {
  type: 'chadajiao'
  tingPlayers: PlayerName[]
  lossPlayers: PlayerName[]
  fanValue: 1
}

export type Settlement = HuSettlement | GangSettlement | ChaDaJiaoSettlement

export interface BloodBattleState {
  eliminated: PlayerName[]
  remaining: number
}

export interface BloodRiverState {
  huCount: Record<PlayerName, number>
  wallRemaining: number | null
}

export interface CurrentRoundState {
  config: RoundConfig
  settlements: Settlement[]
  tempScores: ScoreMap
  status: RoundStatus
  battleState: BloodBattleState
  riverState: BloodRiverState
}

export interface AppState {
  totalScores: ScoreMap
  playerNames: PlayerNameTuple
  currentRound: CurrentRoundState | null
  defaultConfig: RoundConfig
}

export interface HuCalculationInput {
  config: RoundConfig
  playerNames: PlayerNameTuple
  winners: PlayerName[]
  loser: PlayerName | null
  isZimo: boolean
  baseFan: number
  genCount: number
  labels?: string[]
}

export interface GangCalculationInput {
  config: RoundConfig
  playerNames: PlayerNameTuple
  winner: PlayerName
  loser: PlayerName | null
  gangType: GangType
}

export interface ChaDaJiaoCalculationInput {
  config: RoundConfig
  playerNames: PlayerNameTuple
  tingPlayers: PlayerName[]
}

export interface HuFormValue {
  winners: PlayerName[]
  isZimo: boolean
  loser: PlayerName
  baseFan: number
  genCount: number
}

