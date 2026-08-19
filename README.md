# DSH 会话导航插件(dsh-conversation-navigator)

Codex 风格的 **DeepSeek Harness(DSH)Web 端会话导航面板**:在对话页**右侧**悬浮展示按轮折叠的对话大纲,点击任意节点平滑跳转,滚动对话时实时高亮当前阅读位置,步次徽标配色与内置"轨迹"视图统一。

纯浏览器插件(无宿主行为)、纯 JavaScript、零构建、零 npm 依赖(按钮/图标复用 DSH 内核 seed 的官方 primitives)。

## 功能

- **按轮折叠大纲**:默认只显示"第 N 轮 + 你的问题"列表,长对话一目了然
- **关键词过滤**:顶部搜索框只按「你的提问 + 助手实际回复文本」过滤(上下文、工具、命令、压缩、推理等不参与匹配),命中词高亮,列表文本自动定位到关键词处
- **展开/折叠步次**:点击轮次行右侧的 `▸ N` / `▾` 展开或折叠该轮的步次明细(助手回复、工具调用、命令、压缩点等)
- **点击定位**:点击轮次主体或步次条目,平滑滚动跳转到对话中对应位置(不改变折叠状态)
- **加载更早 / 加载全部**:面板顶部两个按钮——「加载更早」向后翻一页、「加载全部」一键把所有历史轮次载入导航,之后可任意跳转(页面默认仍懒加载,只有点按钮才补载)
- **位置跟踪**:手动滚动对话时,面板自动高亮并跟随当前正在阅读的轮次
- **右侧定位**:面板锚定视口右侧,收起/展开左侧边栏时纹丝不动
- **回到最新 / 全部折叠**:面板底部两个快捷按钮
- **轨迹配色**:用户/插话 = 业务蓝、上下文 = 成功绿、助手 = 紫罗兰、工具 = 琥珀、压缩 = 中性灰(取自 `dsh-client-ui-trajectory` 的 kindTag 主题 token,自动适配明暗主题)
- **DSH 原生按钮与图标**:所有操作按钮复用官方 `Button` 组件与 `ic_ds_*` 图标集,与 DSH 界面完全同款
- 切换工作区/会话自动跟随并重建大纲

## 安装

本插件是官方规范的**组合包**(`dsh.bundle` manifest + `dsh.client` 声明),纯 JavaScript、无构建步骤,推荐用官方 CLI 安装:

```sh
# 方式一:npm(发布后,用户无需任何构建授权)
dsh plugin --profile web add dsh-conversation-navigator

# 方式二:GitHub(纯 JS 包无需 prepare/allowBuilds,直接可用)
dsh plugin --profile web add github:gjj-star/dsh-conversation-navigato

# 方式三:本地 tarball
pnpm pack
dsh plugin --profile web add ./dsh-conversation-navigator-<version>.tgz
```

`dsh plugin` 在 profile 目录内转发给 pnpm,因此需要 **pnpm 在 PATH 上**;安装会自动把本包追加进 profile 的 `dsh.profile.bundles`,其自带的 `cordis.patch.yml` 层负责插入插件行。重启 `dsh web` 后生效,面板默认展开。

> 手动方式(不依赖 pnpm):把仓库放进 `<DSH_HOME>\profiles\<profile>\node_modules\dsh-conversation-navigator`,并在 profile 的 `cordis.patch.yml` 顶层数组追加 [`example.patch.yml`](./example.patch.yml) 的内容。

## 更新

修改 `lib/client.js` 后重启 `dsh web` 即可;插件没有持久状态,展开/折叠状态仅存于页面会话内。

## 工作原理

- 注册槽位:`conversation.session.header.utilities`(标题栏「导航」开关)+ `shell.overlay`(浮动面板)
- 数据来源:会话级标准 props 的 `useSession`(选择 `ConversationSnapshot.chat` 的稳定渲染顺序 `order` + `ChatNodeStore`),按 `node.location` 的 turn 分组
- 历史补载:通过 `sessions` 服务的 `binding(sessionId).session.loadOlder()` 分页向后加载,「加载全部」循环至 `hasMore=false`
- 跳转定位:复用 DSH 聊天视图自身的稳定 DOM 锚点 `[data-chat-anchor-key]`(与产品内部 paging/scroll 定位同源),`scrollIntoView` 平滑滚动
- 位置跟踪:捕获 `[data-conversation-scroll]` 滚动容器的 scroll 事件(节流 120ms),计算视口顶部首个可见节点
- 关键词过滤:仅为 `user` 与 `assistant-step` 节点提取检索文本(`dialogueText`),大小写不敏感匹配,命中片段以 `<mark>` 高亮并按首个命中位置截取显示窗口
- 样式:按钮/图标复用 `@deepseek-ai/dsh-client-ui-primitives`;面板容器自建 `<style>` 注入,颜色使用 `--dsw-*` 主题 token;插件卸载时随 fiber 清理

## 兼容性说明

- 目标平台:DSH Web 端(`dsh.client.platform: web`),依赖内核 seed 的 `react`、`slots`、`sessions` 服务与 `@deepseek-ai/dsh-client-ui-primitives`,以及 `dsh-client-runtime`、`dsh-client-ui-conversation` 提供的标准能力(`dsh.client.inject` 已声明 runtime 与 conversation)
- **版本敏感点**:`[data-chat-anchor-key]` / `[data-conversation-scroll]` 是当前 DSH 聊天视图的 DOM 锚点约定,DSH 升级后若锚点变化,只需调整 `lib/client.js` 中 `findAnchor` / `computeActiveKey` 两个函数
- 未声明 `timer` 硬依赖:客户端的 timer 服务存在则用于节流,不存在时自动退化为未节流模式

## 目录结构

```
lib/
  index.js   # 宿主侧空入口(纯浏览器插件)
  client.js  # 浏览器端完整实现(window.__ModuleLoader__ 模块格式)
cordis.patch.yml     # 组合包补丁层(插入插件行)
example.patch.yml    # 手动安装时的补丁示例
```

## License

MIT
