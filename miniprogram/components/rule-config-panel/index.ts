import { BaseScore, GameMode, MaxFan, RoundConfig } from '../../types/game'

const MODE_OPTIONS: Array<{ label: string; value: GameMode }> = [
  { label: '血战到底', value: 'blood_battle' },
  { label: '血流成河', value: 'blood_river' },
]

const MAX_FAN_OPTIONS: MaxFan[] = [3, 5, 8]
const BASE_SCORE_OPTIONS: BaseScore[] = [1, 2, 5, 10]

Component({
  properties: {
    value: {
      type: Object,
      value: {
        mode: 'blood_battle',
        enableGen: true,
        maxFan: 5,
        baseScore: 1,
      },
    },
    canResumeRound: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    modeOptions: MODE_OPTIONS,
    maxFanOptions: MAX_FAN_OPTIONS,
    baseScoreOptions: BASE_SCORE_OPTIONS,
  },
  methods: {
    emitChange(nextValue: RoundConfig) {
      this.triggerEvent('change', { value: nextValue })
    },
    handleModeTap(event: WechatMiniprogram.TouchEvent) {
      const mode = event.currentTarget.dataset.value as GameMode
      this.emitChange({ ...(this.data.value as RoundConfig), mode })
    },
    handleGenSwitch(event: WechatMiniprogram.SwitchChange) {
      this.emitChange({ ...(this.data.value as RoundConfig), enableGen: event.detail.value })
    },
    handleMaxFanTap(event: WechatMiniprogram.TouchEvent) {
      const maxFan = Number(event.currentTarget.dataset.value) as MaxFan
      this.emitChange({ ...(this.data.value as RoundConfig), maxFan })
    },
    handleBaseScoreTap(event: WechatMiniprogram.TouchEvent) {
      const baseScore = Number(event.currentTarget.dataset.value) as BaseScore
      this.emitChange({ ...(this.data.value as RoundConfig), baseScore })
    },
    handleStartTap() {
      this.triggerEvent('start', { value: this.data.value as RoundConfig })
    },
    handleResumeTap() {
      this.triggerEvent('resume')
    },
  },
})
