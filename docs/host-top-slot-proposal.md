# 宿主提案：侧边栏新增 `sidebar.top.action` 槽

> dsh-today 顶部并排的正路设计。宿主发版前，dsh-today ≥ 0.2.0 用 DOM 领养过渡（见 `client.js` `startMover`），视觉效果与本提案一致；宿主落地后插件切槽、删过渡代码。

## 背景

现行契约（`@deepseek-ai/dsh-client-ui-sidebar` 的 `contract/slots.d.ts`）规定 shell 硬拥有 brand 行、New Session 按钮与折叠开关；插件洞只有 `sidebar.brand.mark` / `sidebar.brand.name` / `sidebar.workspaces` / `sidebar.settings` / `sidebar.footer.action`。

后果：

1. 「新会话在今天工作区」这类高频动作只能挂在底部 `sidebar.footer.action`，与重启、手机配对等低频动作混排，位置与频率错配。
2. footer 事实上成为「插件杂项抽屉」，且是全侧边栏最不显眼的位置。
3. New Session 与「今天开新」是同族动作（都是开始新会话），却被放在侧边栏两极，流程割裂。

## 目标

- New Session 按钮语义**不动**（继承当前/最近 workspace 的原逻辑保留）。
- 在其右侧开放一个插件 action 座位，高频动作与 New Session 并排成行。
- 折叠 rail 态：图标竖排于 New Session 图标之下，间距与 rail 一致。

## 契约改动

`SlotMap` 新增：

```ts
'sidebar.top.action': {
    kind: 'list';
    scope: 'root';
    owner: SidebarTopActionOwnerProps; // { wide: boolean }，与 footer 同构
};
```

- `kind: 'list'`：多个插件可共驻，渲染顺序 = 注册声明的 `order`（数值，缺省 0，同值按注册时间稳定排序）。
- 溢出规则：wide 态最多渲染 3 个，超出收进宿主自带的「…」菜单（v1 也可简单截断并让插件自行改挂 footer，菜单为 v2）。

## 宿主布局改动（SidebarRoot）

- wide：New Session 行改 flex row——按钮 `flex:1`，右侧 `renderSlot('sidebar.top.action', { wide })`，每个 action 36px、gap 8px，行高保持 38px。
- collapsed：rail 中 New Session 图标后按序竖排 slot 图标（36px）。
- 无注册者时不渲染任何内容，视觉零差异；`sidebar.footer.action` 语义不变。
- 参考落点：现行 `client.js` 中 `newSession` 按钮之后、`regionArea` 之前；CSS 约 10 行。

## 为什么不选其他形态

- **Split button（New Session 加下拉）**：高频动作多一次点击，箭头热区小；适合中低频反向入口，不适合主路径。
- **改 New Session 语义（策略注入）**：把个人约定写进宿主主按钮，覆盖「继承最近 workspace」原语义，需要反向入口补偿；可作为本槽之上的增强另议。
- **插件 DOM 搬家（现状过渡）**：依赖宿主内部 hashed class 与 DOM 结构，升版即碎；只配做过渡，不配做形态。

## 迁移计划（dsh-today 侧）

1. 宿主发版含 `sidebar.top.action` 后：`client.js` 注册名 `sidebar.footer.action` → `sidebar.top.action`。
2. 删除 `startMover` 及 `/* Top placement stopgap */` 段 CSS（约 25 行）。
3. 版本号抬到 0.3.0，README 移除「过渡」字样；dsh-setup 清单同步。

## 过渡态防御约定（0.2.x）

- 找不到 `button[class*="_newSession"]` 或其父容器结构变化 → 按钮自动回底部 footer 原座位，功能不丢。
- 启动 3 秒内未判定完成 → 解除隐藏、按 footer 态展示，避免按钮消失。
- 过渡代码全部集中在 `startMover` 与标注 CSS 段，删除即净。
