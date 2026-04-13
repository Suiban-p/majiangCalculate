Component({
  properties: {
    playerNames: {
      type: Array,
      value: ['玩家A', '玩家B', '玩家C', '玩家D'],
    },
    totalScores: {
      type: Object,
      value: {},
    },
    roundScores: {
      type: Object,
      value: {},
    },
    editableNames: {
      type: Boolean,
      value: false,
    },
    fixedTop: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    handlePlayerTap(event: WechatMiniprogram.TouchEvent) {
      const index = Number(event.currentTarget.dataset.index)
      const playerNames = this.data.playerNames as string[]
      const name = playerNames[index]

      this.triggerEvent('playertap', { index, name })

      if (!this.data.editableNames) {
        return
      }

      wx.showModal({
        title: '修改玩家名',
        editable: true,
        placeholderText: name,
        success: (result) => {
          const nextName = (result.content ?? '').trim()
          if (!result.confirm || !nextName) {
            return
          }

          this.triggerEvent('editname', { index, name: nextName })
        },
      })
    },
  },
})
