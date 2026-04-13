import { EMPTY_SCORE_MAP } from '../constants/game'
import {
  BloodBattleState,
  BloodRiverState,
  CurrentRoundState,
  PlayerNameTuple,
  ScoreMap,
  Settlement,
} from '../types/game'

const mergeDistribution = (base: ScoreMap, delta: Record<string, number>): ScoreMap => {
  const next = { ...base }
  Object.keys(delta).forEach((playerName) => {
    next[playerName] = (next[playerName] ?? 0) + delta[playerName]
  })
  return next
}

const deriveBattleState = (playerNames: PlayerNameTuple, settlements: Settlement[]): BloodBattleState => {
  const eliminatedSet = settlements.reduce<Set<string>>((result, settlement) => {
    if (settlement.type === 'hu') {
      settlement.winners.forEach((winner) => result.add(winner))
    }
    return result
  }, new Set<string>())

  return {
    eliminated: playerNames.filter((playerName) => eliminatedSet.has(playerName)),
    remaining: playerNames.length - eliminatedSet.size,
  }
}

const deriveRiverState = (playerNames: PlayerNameTuple, settlements: Settlement[]): BloodRiverState => {
  const huCount = EMPTY_SCORE_MAP(playerNames)
  settlements.forEach((settlement) => {
    if (settlement.type === 'hu') {
      settlement.winners.forEach((winner) => {
        huCount[winner] = (huCount[winner] ?? 0) + 1
      })
    }
  })

  return {
    huCount,
    wallRemaining: null,
  }
}

export const recomputeRound = (
  playerNames: PlayerNameTuple,
  round: CurrentRoundState,
): CurrentRoundState => {
  const tempScores = round.settlements.reduce<ScoreMap>(
    (result, settlement) => mergeDistribution(result, settlement.distribution),
    EMPTY_SCORE_MAP(playerNames),
  )
  const battleState = deriveBattleState(playerNames, round.settlements)
  const riverState = deriveRiverState(playerNames, round.settlements)
  const shouldCompleteBattle =
    round.config.mode === 'blood_battle' && battleState.remaining <= 1

  return {
    ...round,
    tempScores,
    battleState,
    riverState,
    status: shouldCompleteBattle ? 'completed' : round.status,
  }
}

export const appendSettlement = (
  playerNames: PlayerNameTuple,
  round: CurrentRoundState,
  settlement: Settlement,
): CurrentRoundState => {
  const nextRound: CurrentRoundState = {
    ...round,
    settlements: [...round.settlements, settlement],
  }

  return recomputeRound(playerNames, nextRound)
}

export const undoLastSettlement = (
  playerNames: PlayerNameTuple,
  round: CurrentRoundState,
): CurrentRoundState => {
  if (!round.settlements.length) {
    return round
  }

  return recomputeRound(playerNames, {
    ...round,
    settlements: round.settlements.slice(0, -1),
    status: 'ongoing',
  })
}

