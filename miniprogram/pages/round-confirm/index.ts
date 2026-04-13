import { AppState, CurrentRoundState, PlayerNameTuple, ScoreMap } from '../../types/game'
import { applyRoundToTotalScores, restartSession, startNextRound } from '../../utils/app-state'

const app = getApp<IAppOption>()

interface RoundConfirmData {
  playerNames: PlayerNameTuple
  scoreKeys: PlayerNameTuple
  totalScores: ScoreMap
  roundScores: ScoreMap
  currentRound: CurrentRoundState | null
}

Page<RoundConfirmData>({
  data: {
    playerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    scoreKeys: ['玩家A', '玩家B', '玩家C', '玩家D'],
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
      playerNames: app.globalData.session.displayPlayerNames,
      scoreKeys: state.playerNames,
      totalScores: state.totalScores,
      roundScores: state.currentRound?.tempScores ?? {},
      currentRound: state.currentRound,
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
    if (!app.globalData.state.currentRound) {
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
