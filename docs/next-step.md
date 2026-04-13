# Next Step

## Phase 2 目标
- 完成共享组件骨架。
- 完成首页骨架。
- 完成结果录入页骨架。
- 完成本局确认页骨架。
- 完成页面与 Phase 1 工具层的基础接线。

## 任务拆分顺序
1. 实现 `scoreboard` 组件
2. 实现 `rule-config-panel` 组件
3. 实现 `/pages/home`
4. 实现 `settlement-list` 组件
5. 实现 `action-buttons` 组件
6. 实现 `round-status` 组件
7. 实现 `score-summary` 组件
8. 实现 `hu-form` 组件
9. 实现 `/pages/round-entry`
10. 实现 `/pages/round-confirm`
11. 接通首页创建单局流程
12. 接通结果录入页与 settlement 展示
13. 接通确认页的本局汇总展示

## 验收标准

### 组件层
- `scoreboard` 可在多个页面复用
- `scoreboard` 能正确显示 4 位玩家累计分
- `settlement-list` 能正确展示 settlement 列表
- `hu-form` 能以 modal 形式在录入页弹出

### 页面层
- 首页可展示规则配置和累计记分板
- 结果录入页可展示本局状态、操作入口、实时分和记录列表
- 本局确认页可展示本局明细和本局合计

### 数据接线
- 首页可以创建并保存 `currentRound`
- 结果录入页可以读取当前局状态
- 确认页可以读取当前局 settlement 和 `tempScores`

### 工程约束
- 页面内不直接实现核心计分逻辑
- 仍保持微信原生小程序结构
- 不引入新框架
- 代码可继续在微信开发者工具中演进

## 当前注意事项
- 继续复用现有 `navigation-bar` 组件
- 首页必须保留为独立 page
- `hu-form` 保持为 `round-entry` 页内组件，不改成独立 page
- 查大叫和血流成河的高级逻辑留在 Phase 3

