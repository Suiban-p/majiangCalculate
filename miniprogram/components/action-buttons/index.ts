Component({
  properties: {
    canUndo: {
      type: Boolean,
      value: false,
    },
    canFinish: {
      type: Boolean,
      value: false,
    },
    showChadajiao: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    emitHu() {
      this.triggerEvent('hu')
    },
    emitGang() {
      this.triggerEvent('gang')
    },
    emitChaDaJiao() {
      this.triggerEvent('chadajiao')
    },
    emitUndo() {
      this.triggerEvent('undo')
    },
    emitFinish() {
      this.triggerEvent('finish')
    },
  },
})
