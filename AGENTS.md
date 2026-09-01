# dsh-today 仓库与 Agent 维护规范（AGENTS.md）

> 本文件是本插件的**代码架构与维护硬性规范**。
> 所有 AI Agent 与人类贡献者在修改、重构或新增功能时，**必须严格遵守以下规则**。

---

## 1. 保持极简与零膨胀原则（Strict Simplicity Limits）

1. **单文件行数上限**：
   - 任何单个源码文件严禁超过 **150 行**。
   - 保持小而美，严禁塞入与「跳转今天工作区」无关的复杂业务逻辑。
2. **模块职责划分**：
   - **后端路径计算 (`resolve.js`)**：纯函数，负责从配置、环境变量或 `$HOME/dshspace` 解析出当日日期路径 `YYYY-MM-DD`。
   - **后端入口 (`index.js`)**：保持极简（< 60 行），仅负责 Cordis RPC 挂载与自动创建目录。
   - **前端交互 (`client.js`)**：专职负责侧栏「今天」快捷入口的渲染与点击跳转事件。

---

## 2. 运行宿主与跨平台铁律

本插件跟的是 DSH 宿主（跑 `dsh web` 的那台机器），必须全平台兼容：

1. **路径自适应**：
   - 统一走 `node:path` 与 `os.homedir()`，严禁硬编码 `/Users/...` 或绝对目录。
   - 云主机或容器内支持通过 `cordis.patch.yml` 的 `root` 配置覆盖基础目录（如 `/home/node/dshspace`）。
2. **时区友好**：
   - 优先使用本地机器时间格式化 `YYYY-MM-DD`。

---

## 3. 原生 ESM 与修改后自检

1. **零构建原生 ESM**：所有模块引用必须显式带 `.js` 扩展名。
2. **修改后门禁自检**：
   修改任何代码后，必须在插件根目录下运行以下命令：
   ```bash
   node --test test/*.test.js
   find . -name "*.js" -not -path "*/.*" -not -path "*/node_modules/*" -exec node --check {} +
   ```
