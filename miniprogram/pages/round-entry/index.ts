import { AppState, ChaDaJiaoSettlement, CurrentRoundState, GangSettlement, HuSettlement, PlayerNameTuple, ScoreMap } from '../../types/game'
import { createChaDaJiaoSettlement, createGangSettlement, createHuSettlement } from '../../utils/score'
import { appendSettlement, canFinishRound, removeSettlementById, undoLastSettlement } from '../../utils/round'

const app = getApp<IAppOption>()

interface RoundEntryData {
  playerNames: PlayerNameTuple
  scoreKeys: PlayerNameTuple
  activePlayerNames: string[]
  totalScores: ScoreMap
  roundScores: ScoreMap
  currentRound: CurrentRoundState | null
  modeLabel: string
  remainingText: string
  extraText: string
  huFormVisible: boolean
  gangFormVisible: boolean
  chadajiaoFormVisible: boolean
  availableWinners: string[]
  availableLosers: string[]
  canFinishRound: boolean
  riverHint: string
  finishHint: string
  emptySettlementText: string
}

Page<RoundEntryData>({
  data: {
    playerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    scoreKeys: ['玩家A', '玩家B', '玩家C', '玩家D'],
    activePlayerNames: ['玩家A', '玩家B', '玩家C', '玩家D'],
    totalScores: {},
    roundScores: {},
    currentRound: null,
    modeLabel: '',
    remainingText: '',
    extraText: '',
    huFormVisible: false,
    gangFormVisible: false,
    chadajiaoFormVisible: false,
    availableWinners: [],
    availableLosers: [],
    canFinishRound: false,
    riverHint: '',
    finishHint: '',
    emptySettlementText: '',
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

    const activePlayerNames =
      currentRound.config.mode === 'blood_battle'
        ? state.playerNames.filter((name) => !currentRound.battleState.eliminated.includes(name))
        : [...state.playerNames]
    const availableWinners = [...activePlayerNames]
    const availableLosers = [...activePlayerNames]
    const modeLabel = currentRound.config.mode === 'blood_battle' ? '血战到底' : '血流成河'
    const remainingText =
      currentRound.config.mode === 'blood_battle'
        ? `剩余 ${currentRound.battleState.remaining} 家`
        : `已录入 ${currentRound.settlements.length} 条结算`
    const extraText =
      currentRound.config.mode === 'blood_river'
        ? state.playerNames.map((name) => `${name} ${currentRound.riverState.huCount[name] ?? 0}胡`).join(' / ')
        : `带根 ${currentRound.config.enableGen ? '开启' : '关闭'}`
    const riverHint =
      currentRound.config.mode === 'blood_river'
        ? '血流成河中，同一玩家后续仍可再次胡牌；点炮时支持一炮多响，并分别录入每位胡牌者。'
        : '血战到底中，已胡玩家会退出后续选择；剩余 1 人时，本局可进入确认。'

    const nextCanFinishRound = canFinishRound(currentRound)
    const finishHint = nextCanFinishRound
      ? '确认后将进入本局确认页。'
      : '请先录入至少一条结算，再进入本局确认。'
    const emptySettlementText =
      currentRound.config.mode === 'blood_river'
        ? '当前还没有本局结算。请先记录当前这次胡牌或其他结算。'
        : '当前还没有本局结算。请先记录胡牌、杠牌或查大叫结果。'

    this.setData({
      playerNames: app.globalData.session.displayPlayerNames,
      scoreKeys: state.playerNames,
      activePlayerNames,
      totalScores: state.totalScores,
      roundScores: currentRound.tempScores,
      currentRound,
      modeLabel,
      remainingText,
      extraText,
      availableWinners,
      availableLosers,
      canFinishRound: nextCanFinishRound,
      riverHint,
      finishHint,
      emptySettlementText,
    })
  },
  handleEditName(event: WechatMiniprogram.CustomEvent<{ index: number; name: string }>) {
    app.setDisplayPlayerName(event.detail.index, event.detail.name)
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
      winnerDetails: Array<{
        winner: string
        baseFan: number
        genCount: number
      }>
    }
  }>) {
    const currentRound = app.globalData.state.currentRound
    if (!currentRound) {
      return
    }

    const nextRound = event.detail.value.winnerDetails.reduce<CurrentRoundState>((roundState, detail) => {
      const settlement: HuSettlement = createHuSettlement({
        config: roundState.config,
        playerNames: app.globalData.state.playerNames,
        winners: [detail.winner],
        loser: event.detail.value.isZimo ? null : event.detail.value.loser,
        isZimo: event.detail.value.isZimo,
        baseFan: detail.baseFan,
        genCount: detail.genCount,
      })

      return appendSettlement(app.globalData.state.playerNames, roundState, settlement)
    }, currentRound)

    app.setState({
      ...app.globalData.state,
      currentRound: nextRound,
    })

    this.setData({ huFormVisible: false })
    this.syncFromState(app.globalData.state)
    if (app.globalData.state.currentRound?.config.mode === 'blood_river') {
      wx.showToast({ title: '已记录胡牌，可继续录入下一次胡牌', icon: 'none' })
    }
    this.maybePromptRoundComplete(app.globalData.state.currentRound)
  },
  handleGangTap() {
    this.setData({ gangFormVisible: true })
  },
  handleChaDaJiaoTap() {
    this.setData({ chadajiaoFormVisible: true })
  },
  closeGangForm() {
    this.setData({ gangFormVisible: false })
  },
  closeChaDaJiaoForm() {
    this.setData({ chadajiaoFormVisible: false })
  },
  handleGangConfirm(event: WechatMiniprogram.CustomEvent<{
    value: {
      winner: string
      loser: string
      gangType: 'an' | 'ming' | 'jia'
    }
  }>) {
    const currentRound = app.globalData.state.currentRound
    if (!currentRound) {
      return
    }

    const settlement: GangSettlement = createGangSettlement({
      config: currentRound.config,
      playerNames: app.globalData.state.playerNames,
      winner: event.detail.value.winner,
      loser: event.detail.value.gangType === 'ming' ? event.detail.value.loser : null,
      gangType: event.detail.value.gangType,
    })

    app.setState({
      ...app.globalData.state,
      currentRound: appendSettlement(app.globalData.state.playerNames, currentRound, settlement),
    })

    this.setData({ gangFormVisible: false })
    this.syncFromState(app.globalData.state)
  },
  handleChaDaJiaoConfirm(event: WechatMiniprogram.CustomEvent<{ tingPlayers: string[] }>) {
    const currentRound = app.globalData.state.currentRound
    if (!currentRound) {
      return
    }

    const settlement: ChaDaJiaoSettlement = createChaDaJiaoSettlement({
      config: currentRound.config,
      playerNames: app.globalData.state.playerNames,
      tingPlayers: event.detail.tingPlayers,
    })

    app.setState({
      ...app.globalData.state,
      currentRound: appendSettlement(app.globalData.state.playerNames, currentRound, settlement),
    })

    this.setData({ chadajiaoFormVisible: false })
    this.syncFromState(app.globalData.state)
    wx.navigateTo({ url: '/pages/round-confirm/index' })
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

    app.setState({
      ...app.globalData.state,
      currentRound: removeSettlementById(app.globalData.state.playerNames, currentRound, event.detail.id),
    })
    this.syncFromState(app.globalData.state)
    this.maybePromptRoundComplete(app.globalData.state.currentRound)
  },
  handleFinish() {
    if (!this.data.currentRound || !this.data.canFinishRound) {
      wx.showToast({ title: '当前不能，请先录入至少一条结算', icon: 'none' })
      return
    }

    wx.navigateTo({ url: '/pages/round-confirm/index' })
  },
  maybePromptRoundComplete(round: CurrentRoundState | null) {
    if (!round || round.status !== 'completed') {
      return
    }

    wx.showModal({
      title: '本局可结束',
      content: '血战到底剩余人数小于等于 1，可进入本局确认页。',
      confirmText: '去确认',
      success: (result) => {
        if (result.confirm) {
          wx.navigateTo({ url: '/pages/round-confirm/index' })
        }
      },
    })
  },
})
