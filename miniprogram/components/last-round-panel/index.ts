import { CurrentRoundState } from '../../types/game'

interface SummaryItem {
  key: string
  score: number
}

Component({
  properties: {
    title: {
      type: String,
      value: '最近完成局',
    },
    playerNames: {
      type: Array,
      value: ['玩家A', '玩家B', '玩家C', '玩家D'],
    },
    scoreKeys: {
      type: Array,
      value: ['玩家A', '玩家B', '玩家C', '玩家D'],
    },
    round: {
      type: Object,
      value: null,
      observer: 'syncRound',
    },
  },
  data: {
    summaryItems: [] as SummaryItem[],
    roundCaption: '',
  },
  methods: {
    syncRound(round: CurrentRoundState | null) {
      if (!round) {
        this.setData({
          summaryItems: [],
          roundCaption: '',
        })
        return
      }

      const scoreKeys = this.data.scoreKeys as string[]
      const summaryItems = scoreKeys.map((key) => ({
        key,
        score: round.tempScores[key] ?? 0,
      }))
      const modeLabel = round.config.mode === 'blood_battle' ? '血战到底' : '血流成河'
      const roundCaption = `${modeLabel} · ${round.settlements.length} 条结算`

      this.setData({
        summaryItems,
        roundCaption,
      })
    },
    handleClear() {
      this.triggerEvent('clear')
    },
  },
})
