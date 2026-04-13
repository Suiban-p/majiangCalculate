import { AppState, PlayerNameTuple, RoundConfig, ScoreMap } from '../../types/game'
import { createRoundState } from '../../utils/app-state'

const app = getApp<IAppOption>()

interface HomePageData {
  playerNames: PlayerNameTuple
  scoreKeys: PlayerNameTuple
  totalScores: ScoreMap
  config: RoundConfig
  canResumeRound: boolean
}

Page<HomePageData>({
  data: {
    playerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    scoreKeys: ['玩家A', '玩家B', '玩家C', '玩家D'],
    totalScores: {},
    config: {
      mode: 'blood_battle',
      enableGen: true,
      maxFan: 5,
      baseScore: 1,
    },
    canResumeRound: false,
  },
  onShow() {
    this.syncFromState(app.refreshState())
  },
  syncFromState(state: AppState) {
    this.setData({
      playerNames: app.globalData.session.displayPlayerNames,
      scoreKeys: state.playerNames,
      totalScores: state.totalScores,
      config: state.defaultConfig,
      canResumeRound: Boolean(state.currentRound),
    })
  },
  handleConfigChange(event: WechatMiniprogram.CustomEvent<{ value: RoundConfig }>) {
    this.setData({ config: event.detail.value })
  },
  handleStart(event: WechatMiniprogram.CustomEvent<{ value: RoundConfig }>) {
    const nextState: AppState = {
      ...app.globalData.state,
      defaultConfig: event.detail.value,
      currentRound: createRoundState(event.detail.value, app.globalData.state.playerNames),
    }
    app.setState(nextState)
    wx.navigateTo({ url: '/pages/round-entry/index' })
  },
  handleResume() {
    if (!app.globalData.state.currentRound) {
      wx.showToast({ title: '没有可恢复的单局', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/round-entry/index' })
  },
  handleEditName(event: WechatMiniprogram.CustomEvent<{ index: number; name: string }>) {
    app.setDisplayPlayerName(event.detail.index, event.detail.name)
    this.syncFromState(app.globalData.state)
  },
})
