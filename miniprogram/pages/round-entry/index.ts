import { AppState, CurrentRoundState, HuSettlement, PlayerNameTuple, ScoreMap } from '../../types/game'
import { createHuSettlement } from '../../utils/score'
import { appendSettlement, recomputeRound, undoLastSettlement } from '../../utils/round'

const app = getApp<IAppOption>()

interface RoundEntryData {
  playerNames: PlayerNameTuple
  totalScores: ScoreMap
  roundScores: ScoreMap
  currentRound: CurrentRoundState | null
  modeLabel: string
  remainingText: string
  extraText: string
  huFormVisible: boolean
  availableWinners: string[]
  availableLosers: string[]
}

Page<RoundEntryData>({
  data: {
    playerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    totalScores: {},
    roundScores: {},
    currentRound: null,
    modeLabel: '',
    remainingText: '',
    extraText: '',
    huFormVisible: false,
    availableWinners: [],
    availableLosers: [],
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
    const currentRound = state.currentRound
    if (!currentRound) {
      return
    }

    const availableWinners =
      currentRound.config.mode === 'blood_battle'
        ? state.playerNames.filter((name) => !currentRound.battleState.eliminated.includes(name))
        : [...state.playerNames]
    const availableLosers = [...state.playerNames]
    const modeLabel = currentRound.config.mode === 'blood_battle' ? '血战到底' : '血流成河'
    const remainingText =
      currentRound.config.mode === 'blood_battle'
        ? `剩余 ${currentRound.battleState.remaining} 家`
        : `已录入 ${currentRound.settlements.length} 条结算`
    const extraText =
      currentRound.config.mode === 'blood_river'
        ? state.playerNames.map((name) => `${name} ${currentRound.riverState.huCount[name] ?? 0}胡`).join(' / ')
        : `带根 ${currentRound.config.enableGen ? '开启' : '关闭'}`

    this.setData({
      playerNames: state.playerNames,
      totalScores: state.totalScores,
      roundScores: currentRound.tempScores,
      currentRound,
      modeLabel,
      remainingText,
      extraText,
      availableWinners,
      availableLosers,
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
  openHuForm() {
    this.setData({ huFormVisible: true })
  },
  closeHuForm() {
    this.setData({ huFormVisible: false })
  },
  handleHuConfirm(event: WechatMiniprogram.CustomEvent<{
    value: {
      winners: string[]
      isZimo: boolean
      loser: string
      baseFan: number
      genCount: number
    }
  }>) {
    const currentRound = app.globalData.state.currentRound
    if (!currentRound) {
      return
    }

    const settlement: HuSettlement = createHuSettlement({
      config: currentRound.config,
      playerNames: app.globalData.state.playerNames,
      winners: event.detail.value.winners,
      loser: event.detail.value.isZimo ? null : event.detail.value.loser,
      isZimo: event.detail.value.isZimo,
      baseFan: event.detail.value.baseFan,
      genCount: event.detail.value.genCount,
    })

    app.setState({
      ...app.globalData.state,
      currentRound: appendSettlement(app.globalData.state.playerNames, currentRound, settlement),
    })

    this.setData({ huFormVisible: false })
    this.syncFromState(app.globalData.state)
  },
  handleGangTap() {
    wx.showToast({ title: '杠牌登记在 Phase 3 细化', icon: 'none' })
  },
  handleChaDaJiaoTap() {
    wx.showToast({ title: '查大叫在 Phase 3 细化', icon: 'none' })
  },
  handleUndo() {
    const currentRound = app.globalData.state.currentRound
    if (!currentRound) {
      return
    }

    app.setState({
      ...app.globalData.state,
      currentRound: undoLastSettlement(app.globalData.state.playerNames, currentRound),
    })
    this.syncFromState(app.globalData.state)
  },
  handleDeleteSettlement(event: WechatMiniprogram.CustomEvent<{ id: string }>) {
    const currentRound = app.globalData.state.currentRound
    if (!currentRound) {
      return
    }

    const nextRound: CurrentRoundState = {
      ...currentRound,
      settlements: currentRound.settlements.filter((item) => item.id !== event.detail.id),
      status: 'ongoing',
    }

    app.setState({
      ...app.globalData.state,
      currentRound: recomputeRound(app.globalData.state.playerNames, nextRound),
    })
    this.syncFromState(app.globalData.state)
  },
  handleFinish() {
    if (!this.data.currentRound?.settlements.length) {
      wx.showToast({ title: '请先录入至少一条结算', icon: 'none' })
      return
    }

    wx.navigateTo({ url: '/pages/round-confirm/index' })
  },
})
