Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    playerNames: {
      type: Array,
      value: ['玩家A', '玩家B', '玩家C', '玩家D'],
      observer: 'syncSelected',
    },
  },
  data: {
    selectedPlayers: [] as string[],
  },
  lifetimes: {
    attached() {
      this.syncSelected()
    },
  },
  methods: {
    syncSelected() {
      const playerNames = this.data.playerNames as string[]
      this.setData({
        selectedPlayers: playerNames.length ? [playerNames[0]] : [],
      })
    },
    togglePlayer(event: WechatMiniprogram.TouchEvent) {
      const player = event.currentTarget.dataset.value as string
      const selectedPlayers = this.data.selectedPlayers as string[]
      const nextSelected = selectedPlayers.includes(player)
        ? selectedPlayers.filter((item) => item !== player)
        : [...selectedPlayers, player]

      this.setData({
        selectedPlayers: nextSelected,
      })
    },
    handleCancel() {
      this.triggerEvent('cancel')
    },
    handleConfirm() {
      const selectedPlayers = this.data.selectedPlayers as string[]
      if (!selectedPlayers.length) {
        wx.showToast({ title: '至少选择一位听牌玩家', icon: 'none' })
        return
      }
      this.triggerEvent('confirm', { tingPlayers: selectedPlayers })
    },
  },
})
