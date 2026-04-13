import { Settlement } from '../../types/game'

interface SettlementItemView {
  id: string
  title: string
  subtitle: string
}

Component({
  properties: {
    settlements: {
      type: Array,
      value: [],
      observer: 'syncItems',
    },
    editable: {
      type: Boolean,
      value: false,
    },
    emptyText: {
      type: String,
      value: '当前还没有结算记录',
    },
  },
  data: {
    items: [] as SettlementItemView[],
  },
  methods: {
    syncItems(settlements: Settlement[]) {
      const items = settlements.map<SettlementItemView>((settlement) => {
        if (settlement.type === 'hu') {
          const winners = settlement.winners.join('、')
          const actionText = settlement.isZimo ? '自摸' : `点炮 ${settlement.loser ?? ''}`
          return {
            id: settlement.id,
            title: `${winners} ${actionText} ${settlement.totalFan}番`,
            subtitle: `单家 ${settlement.points} 分`,
          }
        }

        if (settlement.type === 'gang') {
          const typeMap = {
            an: '暗杠',
            ming: '明杠',
            jia: '加杠',
          } as const
          return {
            id: settlement.id,
            title: `${settlement.winner} ${typeMap[settlement.gangType]}`,
            subtitle: `基础 ${settlement.points} 分`,
          }
        }

        return {
          id: settlement.id,
          title: `查大叫：${settlement.tingPlayers.join('、')}`,
          subtitle: `未听牌赔付 ${settlement.points} 分`,
        }
      })

      this.setData({ items })
    },
    handleDelete(event: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('delete', { id: event.currentTarget.dataset.id as string })
    },
  },
})
