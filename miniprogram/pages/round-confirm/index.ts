import { AppState, CurrentRoundState, PlayerNameTuple, ScoreMap } from '../../types/game'
import { applyRoundToTotalScores, restartSession, startNextRound } from '../../utils/app-state'

const app = getApp<IAppOption>()

interface RoundConfirmData {
  playerNames: PlayerNameTuple
  scoreKeys: PlayerNameTuple
  totalScores: ScoreMap
  roundScores: ScoreMap
  currentRound: CurrentRoundState | null
  canConfirm: boolean
  confirmHint: string
}

Page<RoundConfirmData>({
  data: {
    playerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    scoreKeys: ['玩家A', '玩家B', '玩家C', '玩家D'],
    totalScores: {},
    roundScores: {},
    currentRound: null,
    canConfirm: false,
    confirmHint: '',
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
    const canConfirm = (state.currentRound?.settlements.length ?? 0) > 0
    this.setData({
      playerNames: app.globalData.session.displayPlayerNames,
      scoreKeys: state.playerNames,
      totalScores: state.totalScores,
      roundScores: state.currentRound?.tempScores ?? {},
      currentRound: state.currentRound,
      canConfirm,
      confirmHint: canConfirm
        ? '确认后将把本局分数累计到总分，并进入下一步操作。'
        : '当前不能，请先返回结果录入页完成至少一条结算。',
    })
  },
  handleEditName(event: WechatMiniprogram.CustomEvent<{ index: number; name: string }>) {
    app.setDisplayPlayerName(event.detail.index, event.detail.name)
    this.syncFromState(app.globalData.state)
  },
  handleBack() {
    wx.navigateBack()
  },
  handleConfirm() {
    if (!app.globalData.state.currentRound || !this.data.canConfirm) {
      wx.showToast({ title: '当前不能，请先完成至少一条结算', icon: 'none' })
      return
    }

    app.setState(applyRoundToTotalScores(app.globalData.state))
    wx.showActionSheet({
      itemList: ['下一局', '重开并保留总分', '重开并清空总分'],
      success: (result) => {
        if (result.tapIndex === 0) {
          app.setState(startNextRound(app.globalData.state))
          wx.reLaunch({ url: '/pages/round-entry/index' })
          return
        }

        if (result.tapIndex === 1) {
          app.setState(restartSession(app.globalData.state, false))
          wx.reLaunch({ url: '/pages/home/index' })
          return
        }

        app.setState(restartSession(app.globalData.state, true))
        wx.reLaunch({ url: '/pages/home/index' })
      },
      fail: () => {
        wx.reLaunch({ url: '/pages/home/index' })
      },
    })
  },
})
