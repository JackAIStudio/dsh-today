# dsh-today

侧栏一颗「今天」：在 dshspace 下打开（没有就建）`days/YYYY-MM-DD`，登记成 DSH 工作区并开新会话。

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

装完或改 host/client 后需要重启 `dsh web` 才生效。**不要自己重启正在跑的进程**；告诉用户。云端可在 `cordis.patch.yml` 里写 `root`，或设 `DSHSPACE`。
