import { DEFAULT_CONFIG } from '../../constants/game'
import { GangType, RoundConfig } from '../../types/game'

interface GangFormValue {
  winner: string
  loser: string
  gangType: GangType
}

const DEFAULT_FORM_VALUE: GangFormValue = {
  winner: '',
  loser: '',
  gangType: 'an',
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
    playerNames: {
      type: Array,
      value: ['玩家A', '玩家B', '玩家C', '玩家D'],
      observer: 'syncForm',
    },
  },
  data: {
    formValue: DEFAULT_FORM_VALUE,
    previewText: '',
  },
  lifetimes: {
    attached() {
      this.syncForm()
    },
  },
  methods: {
    syncForm() {
      const playerNames = this.data.playerNames as string[]
      const nextFormValue: GangFormValue = {
        ...(this.data.formValue as GangFormValue),
        winner: playerNames[0] ?? '',
        loser: playerNames[1] ?? playerNames[0] ?? '',
      }
      this.setData({
        formValue: nextFormValue,
        previewText: this.getPreviewText(nextFormValue),
      })
    },
    getPreviewText(formValue: GangFormValue): string {
      const config = this.data.config as RoundConfig
      if (formValue.gangType === 'an') {
        return `暗杠：三家各付 ${config.baseScore * 2} 分`
      }
      if (formValue.gangType === 'jia') {
        return `加杠：三家各付 ${config.baseScore} 分`
      }
      return `明杠：点杠者支付 ${config.baseScore * 2} 分`
    },
    setWinner(event: WechatMiniprogram.TouchEvent) {
      const winner = event.currentTarget.dataset.value as string
      const nextFormValue = {
        ...(this.data.formValue as GangFormValue),
        winner,
      }
      this.setData({
        formValue: nextFormValue,
        previewText: this.getPreviewText(nextFormValue),
      })
    },
    setLoser(event: WechatMiniprogram.TouchEvent) {
      const loser = event.currentTarget.dataset.value as string
      this.setData({
        formValue: {
          ...(this.data.formValue as GangFormValue),
          loser,
        },
      })
    },
    setGangType(event: WechatMiniprogram.TouchEvent) {
      const gangType = event.currentTarget.dataset.value as GangType
      const nextFormValue = {
        ...(this.data.formValue as GangFormValue),
        gangType,
      }
      this.setData({
        formValue: nextFormValue,
        previewText: this.getPreviewText(nextFormValue),
      })
    },
    handleCancel() {
      this.triggerEvent('cancel')
    },
    handleConfirm() {
      const formValue = this.data.formValue as GangFormValue
      if (!formValue.winner) {
        wx.showToast({ title: '请选择杠牌人', icon: 'none' })
        return
      }
      if (formValue.gangType === 'ming' && !formValue.loser) {
        wx.showToast({ title: '请选择点杠人', icon: 'none' })
        return
      }
      this.triggerEvent('confirm', { value: formValue })
    },
  },
})
