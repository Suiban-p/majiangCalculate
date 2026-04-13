import { DEFAULT_CONFIG } from '../../constants/game'
import { HuFormValue, RoundConfig } from '../../types/game'
import { calculateHuBasePoints } from '../../utils/score'

interface WinnerDetailInput {
  winner: string
  baseFan: number
  genCount: number
}

const DEFAULT_FORM_VALUE: HuFormValue = {
  winners: [],
  isZimo: true,
  loser: '',
  winnerDetails: [],
}

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    config: {
      type: Object,
      value: DEFAULT_CONFIG,
    },
    availableWinners: {
      type: Array,
      value: [],
      observer: 'syncFormWithPlayers',
    },
    availableLosers: {
      type: Array,
      value: [],
      observer: 'syncFormWithPlayers',
    },
    allowMultipleWinners: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    formValue: DEFAULT_FORM_VALUE,
    previewPoints: 1,
    loserOptions: [] as string[],
    previewText: '',
    formHint: '',
  },
  lifetimes: {
    attached() {
      this.syncFormWithPlayers()
    },
  },
  methods: {
    createWinnerDetail(winner: string): WinnerDetailInput {
      return {
        winner,
        baseFan: 1,
        genCount: 0,
      }
    },
    syncWinnerDetails(winners: string[], currentDetails: WinnerDetailInput[]): WinnerDetailInput[] {
      return winners.map((winner) => currentDetails.find((item) => item.winner === winner) ?? this.createWinnerDetail(winner))
    },
    syncFormWithPlayers() {
      const availableWinners = this.data.availableWinners as string[]
      const availableLosers = this.data.availableLosers as string[]
      const winners = availableWinners.length ? [availableWinners[0]] : []
      const nextFormValue: HuFormValue = {
        ...(this.data.formValue as HuFormValue),
        winners,
        loser: availableLosers[0] ?? '',
        winnerDetails: this.syncWinnerDetails(winners, (this.data.formValue as HuFormValue).winnerDetails || []),
      }

      this.setData({
        formValue: nextFormValue,
        loserOptions: this.getLoserOptions(nextFormValue),
        previewPoints: this.computePreviewPoints(nextFormValue),
        previewText: this.getPreviewText(nextFormValue),
        formHint: this.getFormHint(nextFormValue),
      })
    },
    getFormHint(formValue: HuFormValue): string {
      if (!formValue.winners.length) {
        return '请先选择胡牌人。'
      }
      if (!formValue.isZimo && !this.getLoserOptions(formValue).length) {
        return '当前没有可选的点炮人，请检查本次胡牌人选择。'
      }
      if (!formValue.isZimo && !formValue.loser) {
        return '点炮结算需要先选择点炮人。'
      }
      return formValue.isZimo ? '确认后将写入一条自摸结算。' : '确认后将按当前输入写入点炮结算。'
    },
    getLoserOptions(formValue: HuFormValue): string[] {
      const availableLosers = this.data.availableLosers as string[]
      return availableLosers.filter((player) => !formValue.winners.includes(player))
    },
    computePreviewPoints(formValue: HuFormValue): number {
      const detail = formValue.winnerDetails[0]
      if (!detail) {
        return 0
      }
      const config = this.data.config as RoundConfig
      const totalFan = detail.baseFan + (config.enableGen ? detail.genCount : 0)
      return calculateHuBasePoints(config.baseScore, totalFan, config.maxFan)
    },
    getPreviewText(formValue: HuFormValue): string {
      if (formValue.isZimo) {
        const detail = formValue.winnerDetails[0]
        if (!detail) {
          return '预览：请选择胡牌人'
        }
        const points = this.computePreviewPoints(formValue)
        return `预览：${detail.baseFan}番 + ${((this.data.config as RoundConfig).enableGen ? detail.genCount : 0)}根，自摸单家 ${points} 分，胡牌者共收 ${points * 3} 分`
      }
      const winnerSummaries = formValue.winnerDetails.map((detail) => {
        const config = this.data.config as RoundConfig
        const totalFan = detail.baseFan + (config.enableGen ? detail.genCount : 0)
        const points = calculateHuBasePoints(config.baseScore, totalFan, config.maxFan)
        return `${detail.winner} ${detail.baseFan}番${config.enableGen ? `+${detail.genCount}根` : ''}=${points}分`
      })
      return `预览：${winnerSummaries.join('；')}`
    },
    toggleWinner(event: WechatMiniprogram.TouchEvent) {
      const winner = event.currentTarget.dataset.value as string
      const current = (this.data.formValue as HuFormValue).winners
      const allowMultiple = Boolean(this.data.allowMultipleWinners)
      const isZimo = (this.data.formValue as HuFormValue).isZimo
      let winners = allowMultiple
        ? current.includes(winner)
          ? current.filter((item) => item !== winner)
          : [...current, winner]
        : [winner]

      if (isZimo) {
        winners = [winner]
      }

      if (!winners.length) {
        winners = [winner]
      }

      const loserOptions = this.getLoserOptions({
        ...(this.data.formValue as HuFormValue),
        winners,
      })
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        winners,
        loser: loserOptions[0] ?? '',
        winnerDetails: this.syncWinnerDetails(winners, (this.data.formValue as HuFormValue).winnerDetails || []),
      }
      this.setData({
        formValue: nextFormValue,
        loserOptions,
        previewPoints: this.computePreviewPoints(nextFormValue),
        previewText: this.getPreviewText(nextFormValue),
        formHint: this.getFormHint(nextFormValue),
      })
    },
    setZimo(event: WechatMiniprogram.TouchEvent) {
      const isZimo = event.currentTarget.dataset.value === 'zimo'
      const currentWinners = (this.data.formValue as HuFormValue).winners
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        isZimo,
        winners: isZimo
          ? currentWinners.length
            ? [currentWinners[0]]
            : (this.data.availableWinners as string[]).slice(0, 1)
          : currentWinners,
      }
      nextFormValue.winnerDetails = this.syncWinnerDetails(nextFormValue.winners, nextFormValue.winnerDetails || [])
      const loserOptions = this.getLoserOptions(nextFormValue)
      this.setData({
        formValue: nextFormValue,
        loserOptions,
        previewPoints: this.computePreviewPoints(nextFormValue),
        previewText: this.getPreviewText(nextFormValue),
        formHint: this.getFormHint(nextFormValue),
      })
    },
    setLoser(event: WechatMiniprogram.TouchEvent) {
      const loser = event.currentTarget.dataset.value as string
      this.setData({
        formValue: {
          ...(this.data.formValue as HuFormValue),
          loser,
        },
        formHint: this.getFormHint({
          ...(this.data.formValue as HuFormValue),
          loser,
        }),
      })
    },
    setBaseFan(event: WechatMiniprogram.TouchEvent) {
      const baseFan = Number(event.currentTarget.dataset.value)
      const winner = event.currentTarget.dataset.winner as string
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        winnerDetails: (this.data.formValue as HuFormValue).winnerDetails.map((item) =>
          item.winner === winner ? { ...item, baseFan } : item,
        ),
      }
      this.setData({
        formValue: nextFormValue,
        loserOptions: this.getLoserOptions(nextFormValue),
        previewPoints: this.computePreviewPoints(nextFormValue),
        previewText: this.getPreviewText(nextFormValue),
        formHint: this.getFormHint(nextFormValue),
      })
    },
    setGenCount(event: WechatMiniprogram.TouchEvent) {
      const genCount = Number(event.currentTarget.dataset.value)
      const winner = event.currentTarget.dataset.winner as string
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        winnerDetails: (this.data.formValue as HuFormValue).winnerDetails.map((item) =>
          item.winner === winner ? { ...item, genCount } : item,
        ),
      }
      this.setData({
        formValue: nextFormValue,
        loserOptions: this.getLoserOptions(nextFormValue),
        previewPoints: this.computePreviewPoints(nextFormValue),
        previewText: this.getPreviewText(nextFormValue),
        formHint: this.getFormHint(nextFormValue),
      })
    },
    handleCancel() {
      this.triggerEvent('cancel')
    },
    handleConfirm() {
      const formValue = this.data.formValue as HuFormValue
      if (!formValue.winners.length) {
        wx.showToast({ title: '请选择胡牌人', icon: 'none' })
        return
      }
      if (formValue.isZimo && formValue.winners.length > 1) {
        wx.showToast({ title: '自摸只允许单人胡牌', icon: 'none' })
        return
      }
      if (formValue.winnerDetails.length !== formValue.winners.length) {
        wx.showToast({ title: '胡牌配置不完整', icon: 'none' })
        return
      }
      if (!formValue.isZimo && !formValue.loser) {
        wx.showToast({ title: '请选择点炮人', icon: 'none' })
        return
      }
      this.triggerEvent('confirm', { value: formValue })
    },
  },
})
