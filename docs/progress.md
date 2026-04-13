# Progress

## 当前阶段
- `Phase 3` 进行中。

## 已完成内容
- 已读取并对齐：
  - `plain.md`
  - `AGENTS.md`
- 已梳理当前项目代码结构：
  - 现有仓库仍以微信原生小程序 TypeScript 模板为基础
  - Phase 2 前项目页面主要还是模板页，业务页面尚未落地
- 已完成 Phase 1 基础架构：
  - 建立核心类型定义
  - 建立常量与默认状态工厂
  - 建立 storage 封装
  - 建立计分工具骨架
  - 建立单局重算与撤销骨架
  - 建立全局 AppState 加载与持久化入口
- 已完成 Stitch 相关工作：
  - 已列出可用 Stitch MCP 工具
  - 已读取现有 Stitch 项目和 screens
  - 已完成 Stitch 页面到小程序页面/组件的映射分析
- 已完成 Phase 2 前置设计：
  - 页面结构规划
  - 组件目录规划
  - 组件契约表
  - Phase 2 实施计划
- 已完成 Phase 2 骨架实现：
  - 首页 page
  - 结果录入页 page
  - 本局确认页 page
  - 共享组件与胡牌 modal 骨架
- 已完成 Phase 3 部分闭环：
  - 杠牌登记表单与写入
  - 查大叫录入与写入
  - 确认后的“下一局 / 重开”流程
  - 血战到底已胡玩家候选过滤
  - 玩家名临时修改改为会话态显示

## 当前状态
- 当前业务代码处于“Phase 3 业务闭环进行中”的状态。
- `miniprogram/types`、`miniprogram/constants`、`miniprogram/utils` 已有 Phase 1 实现。
- `miniprogram/pages/home`、`miniprogram/pages/round-entry`、`miniprogram/pages/round-confirm` 已建立。
- `miniprogram/components/scoreboard`、`rule-config-panel`、`settlement-list`、`action-buttons`、`round-status`、`score-summary`、`hu-form` 已建立。
- `/docs` 文档体系已建立。
- 首页、结果录入页、确认页、共享组件骨架已实现。
- 杠牌登记、查大叫录入、确认后的下一步流程已接入主流程。
- `hu-form` 已补充一炮多响录入边界：
  - 点炮人自动排除胡牌人
  - 自摸限制单赢家
  - 血流成河下支持多赢家选择提示
- 录入页已收紧血战到底下的后续可选玩家范围：
  - 已胡玩家不会继续出现在胡牌/点炮/杠牌候选中
- 删除 settlement 后会重新走统一重算和自动结束提示判断
- 玩家名临时修改已改为会话态显示名：
  - 不再直接写回持久化 `playerNames`
  - 页面显示名与分数字典 key 已分离
- 最近完成局回看已落地：
  - `lastCompletedRound` 已接入持久化
  - 首页可展示最近完成局摘要
  - 支持手动清除最近完成局卡片

## 已知问题
- 全量 `tsc --noEmit` 当前无法完全通过。
- 主要原因不是 Phase 1 新增代码语法错误，而是仓库现有微信 typings 不完整。
- 当前缺失的 typings 文件包括：
  - `typings/types/wx/lib.wx.canvas.d.ts`
  - `typings/types/wx/lib.wx.wasm.d.ts`
  - `typings/types/wx/lib.wx.xr-frame.d.ts`
- 在脱离微信开发者工具环境单独做定向 TypeScript 校验时，`wx` 全局类型也无法完整识别。
- `plain.md` 中部分描述与 `AGENTS.md` 的 V1 约束存在口径差异。
  - 当前实现口径以 `AGENTS.md` 为工程执行约束，尤其是查大叫规则。

## 未完成事项
- Phase 3 业务闭环：
  - 血流成河 V1 细节补全
  - 血流成河多次胡牌与一炮多响体验继续打磨
  - 更完整的撤销和回滚细节
- Phase 4 视觉对齐与边界处理
  - Stitch 风格精修
  - 页面状态反馈
  - 异常处理
