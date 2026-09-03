# dsh-today

侧栏一颗日历 logo（36px 圆标，没有「今天」文字）：在 dshspace 下打开（没有就建）`days/YYYY-MM-DD`，登记成 DSH 工作区并开新会话。

## 位置（0.2.0 起）

默认并排在 **New Session 按钮右侧**（宽栏同行、折叠 rail 竖排其下）。这是宿主 `sidebar.top.action` 槽发版前的 **DOM 领养过渡**：找不到宿主结构时自动回退到底部设置排原座位，功能不丢。正路设计见 `docs/host-top-slot-proposal.md`。

路径不写死操作系统：

1. 插件配置 `root`
2. 环境变量 `DSHSPACE`
3. 若存在 `~/Documents/dshspace`（Mac / Windows）
4. 否则 `~/dshspace`（Linux 容器）

## 安装

```sh
# 开发机
dsh plugin --profile web add link:$HOME/Documents/dshspace/plugins/dsh-today

# 新电脑
dsh plugin --profile web add github:JackAIStudio/dsh-today
```

改 host 侧（`index.js` / `cordis.patch.yml`）需要重启 `dsh web` 才生效；只改 client 侧（`client.js`）刷新页面即可。**不要自己重启正在跑的进程**；告诉用户。云端可在 `cordis.patch.yml` 里写 `root`，或设 `DSHSPACE`。
