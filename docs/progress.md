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
- 血流成河点炮多赢家输入已升级为“每个赢家独立番数/根数”：
  - 表单层只收集每位赢家各自的输入
  - 录入页逐赢家生成 settlement
  - 最终仍走统一重算路径
- 血流成河多次胡牌体验已补充基础引导：
  - 录入页明确提示同一玩家可再次胡牌
  - 胡牌录入完成后会提示可继续录入下一次胡牌
  - `hu-form` 明确说明本次只记录当前这一笔胡牌
- 录入页已收紧血战到底下的后续可选玩家范围：
  - 已胡玩家不会继续出现在胡牌/点炮/杠牌候选中
- 删除 settlement 后会重新走统一重算和自动结束提示判断
- `delete settlement` 与 `undo last settlement` 已收敛到 `utils/round.ts` 的统一重算路径
- `hu-form` 已补充自摸单赢家约束，避免血流成河下错误地把自摸录成多赢家
- 玩家名临时修改已改为会话态显示名：
  - 不再直接写回持久化 `playerNames`
  - 页面显示名与分数字典 key 已分离
- 最近完成局回看已落地：
  - `lastCompletedRound` 已接入持久化
  - 首页可展示最近完成局摘要
  - 支持手动清除最近完成局卡片

## 已知问题
- 当前仓库的全量 `tsc --noEmit` 仍无法完全通过。
- 主要原因不是当前阶段新增代码的语法或业务实现错误，而是仓库现有微信 typings 不完整。
- 当前缺失的 typings 文件包括：
  - `typings/types/wx/lib.wx.canvas.d.ts`
  - `typings/types/wx/lib.wx.wasm.d.ts`
  - `typings/types/wx/lib.wx.xr-frame.d.ts`
- 在脱离微信开发者工具环境单独执行 TypeScript 校验时，`wx` 全局类型也无法被完整识别。
- 当前问题属于“环境级遗留问题”，不是本阶段业务开发的主阻塞项。
- 现阶段验收以微信开发者工具中的可运行性、主流程可走通、核心结算结果正确为主，不以仓库全量 `tsc --noEmit` 通过作为唯一标准。
- 当前文档与实现存在局部不同步风险：
  - `architecture.md` 仍偏 Phase 1/2 视角
  - 当前代码已经进入 Phase 3 的部分闭环
  - 后续每轮开发后都需要同步文档，避免设计稿、文档和代码三者脱节
- `plain.md` 中部分描述与 `AGENTS.md` 的 V1 约束存在口径差异。
  - 当前工程实现以 `AGENTS.md` 为执行约束。
  - 尤其是查大叫规则，当前按 V1 简化口径实现。
- 当前仍存在未完全收口的执行约束风险：
  - 血流成河的交互细节还未完全补齐
  - Phase 4 样式精修尚未开始，当前 UI 仍以骨架和可用性优先
- 当前首页展示、录入页和确认页已经可用，但还未完成“全面边界回归”。
- 后续可单独安排一个工程任务：
  - 补齐微信 typings
  - 恢复完整 TypeScript 校验
  - 统一 `plain.md` 与 `AGENTS.md` 的规则口径
  

## 未完成事项
- Phase 3 业务闭环：
  - 血流成河 V1 细节补全
- Phase 4 视觉对齐与边界处理
  - Stitch 风格精修
  - 页面状态反馈
  - 异常处理
