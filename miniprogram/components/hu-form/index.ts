import { DEFAULT_CONFIG } from '../../constants/game'
import { RoundConfig } from '../../types/game'
import { calculateHuBasePoints } from '../../utils/score'

interface HuFormValue {
  winners: string[]
  isZimo: boolean
  loser: string
  baseFan: number
  genCount: number
}

const DEFAULT_FORM_VALUE: HuFormValue = {
  winners: [],
  isZimo: true,
  loser: '',
  baseFan: 1,
  genCount: 0,
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
  },
  lifetimes: {
    attached() {
      this.syncFormWithPlayers()
    },
  },
  methods: {
    syncFormWithPlayers() {
      const availableWinners = this.data.availableWinners as string[]
      const availableLosers = this.data.availableLosers as string[]
      const nextFormValue: HuFormValue = {
        ...(this.data.formValue as HuFormValue),
        winners: availableWinners.length ? [availableWinners[0]] : [],
        loser: availableLosers[0] ?? '',
      }

      this.setData({
        formValue: nextFormValue,
        previewPoints: this.computePreviewPoints(nextFormValue),
      })
    },
    computePreviewPoints(formValue: HuFormValue): number {
      const config = this.data.config as RoundConfig
      const totalFan = formValue.baseFan + (config.enableGen ? formValue.genCount : 0)
      return calculateHuBasePoints(config.baseScore, totalFan, config.maxFan)
    },
    toggleWinner(event: WechatMiniprogram.TouchEvent) {
      const winner = event.currentTarget.dataset.value as string
      const current = (this.data.formValue as HuFormValue).winners
      const allowMultiple = Boolean(this.data.allowMultipleWinners)
      let winners = allowMultiple
        ? current.includes(winner)
          ? current.filter((item) => item !== winner)
          : [...current, winner]
        : [winner]

      if (!winners.length) {
        winners = [winner]
      }

      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        winners,
      }
      this.setData({
        formValue: nextFormValue,
        previewPoints: this.computePreviewPoints(nextFormValue),
      })
    },
    setZimo(event: WechatMiniprogram.TouchEvent) {
      const isZimo = event.currentTarget.dataset.value === 'zimo'
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        isZimo,
      }
      this.setData({
        formValue: nextFormValue,
        previewPoints: this.computePreviewPoints(nextFormValue),
      })
    },
    setLoser(event: WechatMiniprogram.TouchEvent) {
      const loser = event.currentTarget.dataset.value as string
      this.setData({
        formValue: {
          ...(this.data.formValue as HuFormValue),
          loser,
        },
      })
    },
    setBaseFan(event: WechatMiniprogram.TouchEvent) {
      const baseFan = Number(event.currentTarget.dataset.value)
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        baseFan,
      }
      this.setData({
        formValue: nextFormValue,
        previewPoints: this.computePreviewPoints(nextFormValue),
      })
    },
    setGenCount(event: WechatMiniprogram.TouchEvent) {
      const genCount = Number(event.currentTarget.dataset.value)
      const nextFormValue = {
        ...(this.data.formValue as HuFormValue),
        genCount,
      }
      this.setData({
        formValue: nextFormValue,
        previewPoints: this.computePreviewPoints(nextFormValue),
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
      if (!formValue.isZimo && !formValue.loser) {
        wx.showToast({ title: '请选择点炮人', icon: 'none' })
        return
      }
      this.triggerEvent('confirm', { value: formValue })
    },
  },
})
