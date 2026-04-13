Component({
  properties: {
    title: {
      type: String,
      value: '本局分数',
    },
    playerNames: {
      type: Array,
      value: ['玩家A', '玩家B', '玩家C', '玩家D'],
    },
    scores: {
      type: Object,
      value: {},
    },
  },
})
