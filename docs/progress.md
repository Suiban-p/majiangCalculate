# Progress

## 当前阶段
- `Phase 4` 已开始。
- 当前只聚焦主流程的必要交互反馈和视觉收敛，不扩展业务范围。

## 已完成内容
- 已完成 `Phase 1` 基础层：
  - 核心类型定义
  - 常量与默认状态
  - storage 封装
  - score 工具骨架
  - round 重算与撤销骨架
  - AppState 加载与持久化入口
- 已完成 `Phase 2` 页面与组件骨架：
  - 首页 `home`
  - 结果录入页 `round-entry`
  - 本局确认页 `round-confirm`
  - 共享组件与 `hu-form` modal
- 已完成 `Phase 3` 业务闭环：
  - 胡牌、杠牌、查大叫录入与写入
  - 血战到底候选玩家过滤
  - 血流成河一炮多响
  - 血流成河多赢家独立番数/根数录入
  - 删除 settlement 与撤销最近 settlement 共用统一重算路径
  - 玩家名临时修改改为会话态显示名
  - 最近完成局回看

## 当前状态
- 主流程已可走通：
  - 首页配置规则并开始本局
  - 结果录入页录入胡牌 / 杠牌 / 查大叫
  - 本局确认页确认并累计总分
- 当前重点转为 `Phase 4`：
  - 优化 spacing、层级、可读性
  - 强化主流程中的状态反馈
  - 保持现有业务逻辑不变

## 本轮 Phase 4 范围
- 只处理主流程的必要交互反馈和样式收敛。
- 优先文件：
  - `miniprogram/components/scoreboard/index.less`
  - `miniprogram/pages/round-entry/index.less`
  - `miniprogram/pages/round-confirm/index.less`
  - `miniprogram/components/hu-form/index.less`
  - `miniprogram/app.less`（仅在必要时）
- 不新增组件，不重构页面结构，不做无关视觉扩张。

## 已知问题
- 仓库级 `tsc --noEmit` 仍无法完全通过。
- 主要原因不是当前业务代码，而是现有微信 typings 不完整，缺失文件包括：
  - `typings/types/wx/lib.wx.canvas.d.ts`
  - `typings/types/wx/lib.wx.wasm.d.ts`
  - `typings/types/wx/lib.wx.xr-frame.d.ts`
- 在脱离微信开发者工具环境时，`wx` 全局类型也无法被完整识别。
- 当前验收以微信开发者工具中的可运行性、主流程可走通、核心结算正确为主。

## 未完成事项
- `Phase 4` 主流程样式收敛与状态反馈补齐。
- 必要的边界回归检查：
  - 血流成河多次胡牌
  - 一炮多响后的删除 / 撤销
  - 确认后进入下一局 / 重开
- 后续可单独安排工程任务：
  - 补齐微信 typings
  - 恢复完整 TypeScript 校验
