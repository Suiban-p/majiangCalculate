import { AppState, CurrentRoundState, PlayerNameTuple, ScoreMap } from '../../types/game'
import { applyRoundToTotalScores } from '../../utils/app-state'

const app = getApp<IAppOption>()

interface RoundConfirmData {
  playerNames: PlayerNameTuple
  totalScores: ScoreMap
  roundScores: ScoreMap
  currentRound: CurrentRoundState | null
}

Page<RoundConfirmData>({
  data: {
    playerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    totalScores: {},
    roundScores: {},
    currentRound: null,
  },
  onShow() {
    const state = app.refreshState()
    if (!state.currentRound) {
      wx.redirectTo({ url: '/pages/home/index' })
      return
    }
    this.syncFromState(state)
  },
  syncFromState(state: AppState) {
    this.setData({
      playerNames: state.playerNames,
      totalScores: state.totalScores,
      roundScores: state.currentRound?.tempScores ?? {},
      currentRound: state.currentRound,
    })
  },
  handleEditName(event: WechatMiniprogram.CustomEvent<{ index: number; name: string }>) {
    const nextNames = [...app.globalData.state.playerNames] as PlayerNameTuple
    nextNames[event.detail.index] = event.detail.name
    app.setState({
      ...app.globalData.state,
      playerNames: nextNames,
    })
    this.syncFromState(app.globalData.state)
  },
  handleBack() {
    wx.navigateBack()
  },
  handleConfirm() {
    if (!app.globalData.state.currentRound) {
      return
    }

    app.setState(applyRoundToTotalScores(app.globalData.state))
    wx.showToast({ title: '已累加到总分', icon: 'success' })
    wx.reLaunch({ url: '/pages/home/index' })
  },
})
