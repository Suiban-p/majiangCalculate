# Architecture

## 1. 系统结构

### 页面层
- 负责页面展示、交互触发、调用工具函数、同步页面数据。
- 当前规划页面：
  - `/pages/home`
  - `/pages/round-entry`
  - `/pages/round-confirm`

### 组件层
- 负责共享 UI 和局部交互，不承载核心计分逻辑。
- 当前规划组件：
  - `scoreboard`
  - `hu-form`
  - `settlement-list`
  - `action-buttons`
  - `rule-config-panel`
  - `round-status`
  - `score-summary`
  - 现有 `navigation-bar`

### 工具层
- 负责业务规则计算、状态重算和 storage 操作。
- 当前已实现模块：
  - `utils/storage.ts`
  - `utils/score.ts`
  - `utils/round.ts`
  - `utils/app-state.ts`

### 类型层
- 集中在 `types/game.ts`
- 已定义核心类型：
  - `AppState`
  - `RoundConfig`
  - `Settlement`
  - `SettlementDistribution`
  - `BloodBattleState`
  - `BloodRiverState`

## 2. 数据流

### 全局数据
- `AppState` 作为全局状态入口。
- 当前全局持久化数据包括：
  - `totalScores`
  - `playerNames`
  - `currentRound`
  - `lastCompletedRound`
  - `defaultConfig`

### 会话数据
- 当前会话显示名不进入持久化 `AppState`。
- 会话态数据用于支持“玩家名临时修改，仅当前会话有效”。
- 展示组件通过：
  - `playerNames` 作为显示名
  - `scoreKeys` 作为分数字典 key

### 启动流程
1. `app.ts` 启动时加载 `AppState`
2. `utils/app-state.ts` 从 storage 恢复持久化数据
3. 页面读取全局状态并展示

### 单局流程
1. 首页选择规则并创建 `currentRound`
2. 结果录入页录入 settlement
3. `utils/score.ts` 负责计算 distribution
4. `utils/round.ts` 负责根据 settlement 列表重算：
   - `tempScores`
   - 血战状态
   - 血流状态
5. 确认页确认后将 `tempScores` 累加到 `totalScores`
6. 当前局写入 `lastCompletedRound`
7. 更新后的状态再次写回 storage

### 显示名流程
1. storage 中保留持久化 `playerNames`
2. 当前会话单独维护显示名
3. 记分板和分数摘要显示会话名
4. 计分和累计分仍按持久化 key 计算

### 撤销流程
1. 结果录入页触发撤销
2. 删除最近一条 settlement
3. `utils/round.ts` 重算本局状态
4. 页面刷新实时分和状态展示

## 3. Stitch 页面映射

### 结果录入页
- Stitch screen：`结算录入页`
- 小程序落地：page
- 路径规划：`/pages/round-entry`

### 胡牌登记
- Stitch screen：`胡牌登记表单`
- 小程序落地：component / modal
- 路径规划：`/components/hu-form`

### 本局确认页
- Stitch screen：`本局结果确认页`
- 小程序落地：page
- 路径规划：`/pages/round-confirm`

### UI 风格页
- Stitch screen：`绿色系的卡.jpg`
- 小程序落地：不作为 page
- 用途：
  - spacing
  - colors
  - typography
  - component styles

## 4. 当前实现状态

### 已实现
- Phase 1 基础层
- AppState 初始化与持久化入口
- 核心类型、常量、storage、score、round 工具骨架

### 未实现
- 页面层
- 组件层
- 页面和工具层联动
- Stitch 风格转译
