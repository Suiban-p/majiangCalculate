import {
  ChaDaJiaoCalculationInput,
  ChaDaJiaoSettlement,
  GangCalculationInput,
  GangSettlement,
  HuCalculationInput,
  HuSettlement,
  PlayerNameTuple,
  ScoreMap,
  SettlementDistribution,
} from '../types/game'

const createScoreMap = (playerNames: PlayerNameTuple): ScoreMap =>
  playerNames.reduce<ScoreMap>((result, playerName) => {
    result[playerName] = 0
    return result
  }, {})

const createSettlementId = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

export const calculateHuBasePoints = (baseScore: number, totalFan: number, maxFan: number): number => {
  const effectiveFan = Math.min(totalFan, maxFan)
  const multiplier = Math.pow(2, Math.max(effectiveFan - 1, 0))
  return baseScore * multiplier
}

export const calculateHuDistribution = (input: HuCalculationInput): SettlementDistribution => {
  const distribution = createScoreMap(input.playerNames)
  const totalFan = input.baseFan + (input.config.enableGen ? input.genCount : 0)
  const points = calculateHuBasePoints(input.config.baseScore, totalFan, input.config.maxFan)

  if (input.isZimo) {
    const payerCount = input.playerNames.length - input.winners.length
    input.playerNames.forEach((playerName) => {
      if (input.winners.includes(playerName)) {
        distribution[playerName] += points * payerCount
      } else {
        distribution[playerName] -= points
      }
    })
    return distribution
  }

  if (!input.loser) {
    throw new Error('点炮结算必须传入点炮玩家')
  }

  input.winners.forEach((winner) => {
    distribution[winner] += points
    distribution[input.loser as string] -= points
  })

  return distribution
}

export const createHuSettlement = (input: HuCalculationInput): HuSettlement => {
  const totalFan = input.baseFan + (input.config.enableGen ? input.genCount : 0)
  const points = calculateHuBasePoints(input.config.baseScore, totalFan, input.config.maxFan)

  return {
    id: createSettlementId('hu'),
    type: 'hu',
    timestamp: Date.now(),
    winners: input.winners,
    loser: input.isZimo ? null : input.loser,
    isZimo: input.isZimo,
    baseFan: input.baseFan,
    genCount: input.config.enableGen ? input.genCount : 0,
    totalFan,
    labels: input.labels,
    points,
    distribution: calculateHuDistribution(input),
  }
}

export const createGangSettlement = (input: GangCalculationInput): GangSettlement => {
  const distribution = createScoreMap(input.playerNames)
  const unit = input.config.baseScore
  let points = 0

  switch (input.gangType) {
    case 'an':
      points = unit * 2
      input.playerNames.forEach((playerName) => {
        if (playerName === input.winner) {
          distribution[playerName] += points * 3
        } else {
          distribution[playerName] -= points
        }
      })
      break
    case 'ming':
      if (!input.loser) {
        throw new Error('明杠结算必须传入点杠玩家')
      }
      points = unit * 2
      distribution[input.winner] += points
      distribution[input.loser] -= points
      break
    case 'jia':
      points = unit
      input.playerNames.forEach((playerName) => {
        if (playerName === input.winner) {
          distribution[playerName] += points * 3
        } else {
          distribution[playerName] -= points
        }
      })
      break
    default:
      throw new Error(`未知杠牌类型: ${String(input.gangType)}`)
  }

  return {
    id: createSettlementId('gang'),
    type: 'gang',
    timestamp: Date.now(),
    winner: input.winner,
    loser: input.gangType === 'ming' ? input.loser : null,
    gangType: input.gangType,
    points,
    distribution,
  }
}

export const createChaDaJiaoSettlement = (input: ChaDaJiaoCalculationInput): ChaDaJiaoSettlement => {
  const distribution = createScoreMap(input.playerNames)
  const tingPlayerSet = new Set(input.tingPlayers)
  const lossPlayers = input.playerNames.filter((playerName) => !tingPlayerSet.has(playerName))
  const points = input.config.baseScore

  if (!input.tingPlayers.length || !lossPlayers.length) {
    return {
      id: createSettlementId('chadajiao'),
      type: 'chadajiao',
      timestamp: Date.now(),
      tingPlayers: input.tingPlayers,
      lossPlayers,
      fanValue: 1,
      points,
      distribution,
    }
  }

  lossPlayers.forEach((lossPlayer) => {
    input.tingPlayers.forEach((tingPlayer) => {
      distribution[lossPlayer] -= points
      distribution[tingPlayer] += points
    })
  })

  return {
    id: createSettlementId('chadajiao'),
    type: 'chadajiao',
    timestamp: Date.now(),
    tingPlayers: input.tingPlayers,
    lossPlayers,
    fanValue: 1,
    points,
    distribution,
  }
}

export const SCORE_SELF_CHECKS = {
  huZimo3Fan1Gen: {
    input: { baseScore: 1, totalFan: 4, maxFan: 5 },
    expectedPoints: 8,
  },
  mingGangBase1: {
    input: { baseScore: 1, gangType: 'ming' as const },
    expectedPoints: 2,
  },
  chaDaJiaoBase1: {
    input: { baseScore: 1, tingPlayers: 1, lossPlayers: 3 },
    expectedWinnerIncome: 3,
  },
}
