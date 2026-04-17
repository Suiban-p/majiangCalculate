# Progress

## 当前阶段
- `Phase 4` 进行中。
- 当前范围仍然只聚焦主流程的交互反馈、必要空态和文案一致性。

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
- 已完成 `Phase 4` 第一轮：
  - `scoreboard` 信息层级收敛
  - `round-entry` / `round-confirm` / `hu-form` 基础样式收敛
  - 全局按钮与禁用态基础样式统一
- 已完成 `Phase 4` 第二轮：
  - 结果录入页增加完成提示与页面级空态
  - 本局确认页增加确认说明、页面级空态与确认按钮禁用反馈
  - `hu-form` 增加无候选提示与确认前说明
- 已完成当前这一轮文案一致性修正：
  - 移除重复空态，改为页面层统一控制
  - 主流程文案统一为四类模板：
    - `empty`：`当前还没有`
    - `warning`：`请先`
    - `confirm`：`确认后将`
    - `disabled`：`当前不能，请先`
  - 血战到底与血流成河说明改为对称表达
  - 首页规则配置页增加模式说明

## 当前状态
- 主流程可走通：
  - 首页配置规则并开始本局
  - 结果录入页录入胡牌 / 杠牌 / 查大叫
  - 本局确认页确认并累计总分
- 主流程反馈已基本收口：
  - 页面级空态
  - warning / confirm / disabled 文案
  - 血战到底 / 血流成河模式差异说明

## 工程环境说明
- 仓库级 `tsc --noEmit` 仍无法完全通过。
- 主要原因不是当前业务代码，而是现有微信 typings 不完整，缺失文件包括：
  - `typings/types/wx/lib.wx.canvas.d.ts`
  - `typings/types/wx/lib.wx.wasm.d.ts`
  - `typings/types/wx/lib.wx.xr-frame.d.ts`
- 在脱离微信开发者工具环境时，`wx` 全局类型也无法被完整识别。
- 这属于工程环境层面的限制，不是当前 MVP 主流程功能缺陷。
- 当前验收以微信开发者工具中的可运行性、主流程可走通、核心结算正确为主。

## 未完成事项
- `Phase 4` 剩余重点：
  - 主流程手工回归检查
  - 文案在微信开发者工具中的实际显示核对
  - 必要的极小文本修正
- 后续可单独安排工程任务：
  - 补齐微信 typings
  - 恢复完整 TypeScript 校验

## 2026-04-16 UI P0 修复记录
- 已完成截图巡检后确认的 P0 范围修复：
  - 修复全局累计记分板 sticky 顶部避让，避免滚动吸顶后与状态栏 / 微信胶囊区重叠。
  - 修复 `round-entry` 页面底部 safe-area padding，避免底部内容贴近 home indicator。
  - 修复 `round-confirm` 页面底部 safe-area padding。
  - 将 `round-confirm` 页面底部确认操作区改为 sticky，使多条结算记录时确认按钮保持可达。
- 本轮严格未处理的事项：
  - 未调整文案。
  - 未调整空态、warning、disabled 状态。
  - 未调整胡牌表单提示。
  - 未修改业务逻辑。
- 涉及文件：
  - `miniprogram/components/scoreboard/index.less`
  - `miniprogram/pages/round-entry/index.less`
  - `miniprogram/pages/round-confirm/index.less`

## 2026-04-17 UI P0 回归修复记录
- 已完成第二轮 UI 回归巡检后确认的两个 P0 布局回归修复：
  - 取消累计记分板的 sticky 吸顶行为，改回正常文档流，避免滚动后覆盖页面内容。
  - 保留 `round-confirm` 底部确认操作区 sticky，同时增加页面底部滚动占位，避免最后的结算记录被按钮区遮挡。
  - 微调 `round-entry` 中记分板下方首个内容区间距，保证内容分隔稳定。
- 本轮严格未处理的事项：
  - 未修改业务逻辑。
  - 未调整文案。
  - 未处理表单密度、记分板高度、空态重复等非本轮 P0 范围问题。
- 涉及文件：
  - `miniprogram/components/scoreboard/index.less`
  - `miniprogram/pages/round-entry/index.less`
  - `miniprogram/pages/round-confirm/index.less`

## 2026-04-17 Final P0 UI 修复记录
- 已完成第三轮 UI 回归后剩余的最后一个 P0 布局问题修复：
  - 在 `round-confirm` 的结算记录 section 增加底部滚动占位。
  - 解决 sticky 底部操作区覆盖最后一条 settlement 的问题。
  - 保留底部操作区 sticky 行为，未改按钮结构、文案或业务逻辑。
- 涉及文件：
  - `miniprogram/pages/round-confirm/index.less`

## 2026-04-17 round-confirm 底部留白细调记录
- 已完成 Final P0 后的底部留白收紧：
  - 将 `round-confirm` 页面底部预留从过大的 `180rpx + safe-area` 收紧为 `128rpx + safe-area`。
  - 将 sticky 底部操作区前间距从 `64rpx` 收紧为 `28rpx`。
  - 目标是在不重新引入 settlement 遮挡的前提下，减少最后一条记录与底部按钮之间的异常空白。
- 本轮未修改：
  - 业务逻辑。
  - 文案。
  - 按钮结构。
  - 其它页面或组件。
- 涉及文件：
  - `miniprogram/pages/round-confirm/index.less`
