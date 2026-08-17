# DSH 会话导航插件(dsh-conversation-navigator)

Codex 风格的 **DeepSeek Harness(DSH)Web 端会话导航面板**:在对话页左侧悬浮展示按轮折叠的对话大纲,点击任意节点平滑跳转,滚动对话时实时高亮当前阅读位置,步次徽标配色与内置"轨迹"视图统一。

纯浏览器插件(无宿主行为)、纯 JavaScript、零构建、零运行时 npm 依赖。

## 功能

- **按轮折叠大纲**:默认只显示"第 N 轮 + 你的问题"列表,长对话一目了然
- **展开/折叠步次**:点击轮次行右侧的 `▸ N` / `▾` 展开或折叠该轮的步次明细(助手回复、工具调用、命令、压缩点等)
- **点击定位**:点击轮次主体或步次条目,平滑滚动跳转到对话中对应位置(不改变折叠状态)
- **位置跟踪**:手动滚动对话时,面板自动高亮并跟随当前正在阅读的轮次
- **回到最新 / 全部折叠**:面板底部两个快捷按钮
- **轨迹配色**:用户/插话 = 业务蓝、上下文 = 成功绿、助手 = 紫罗兰、工具 = 琥珀、压缩 = 中性灰(全部取自 `dsh-client-ui-trajectory` 的 kindTag 主题 token,自动适配明暗主题)
- 切换工作区/会话自动跟随并重建大纲

## 安装

DSH Web 端插件通过 profile 的补丁层(`cordis.patch.yml`)挂载,客户端代码由宿主在运行时扫描并注入页面,无需构建 Web 产物。

1. 把本仓库放进 profile 的 `node_modules`(裸包名必须能被 profile 目录的 node 解析找到):

   ```powershell
   # <DSH_HOME> 默认为 %USERPROFILE%\.dsh
   git clone https://github.com/<you>/dsh-conversation-navigator `
     "$env:USERPROFILE\.dsh\profiles\web\node_modules\dsh-conversation-navigator"
   ```

   > 也可以用软链接指向任意目录:`New-Item -ItemType Junction -Path ...\node_modules\dsh-conversation-navigator -Target <repo>`

2. 在 `<DSH_HOME>\profiles\<profile>\cordis.patch.yml` 的顶层数组追加一行(见 [`example.patch.yml`](./example.patch.yml)):

   ```yaml
   - insert:
       - id: ui-conversation-navigator
         name: 'dsh-conversation-navigator'
   ```

3. 重启 `dsh web`(插件集变更在启动时生效),刷新页面即可,面板默认展开。

## 更新

修改 `lib/client.js` 后重启 `dsh web` 即可;插件没有持久状态,展开/折叠状态仅存于页面会话内。

## 工作原理

- 注册槽位:`conversation.session.header.utilities`(标题栏"☰ 导航"开关)+ `shell.overlay`(浮动面板)
- 数据来源:会话级标准 props 的 `useSession`(选择 `ConversationSnapshot.chat` 的稳定渲染顺序 `order` + `ChatNodeStore`),按 `node.location` 的 turn 分组
- 跳转定位:复用 DSH 聊天视图自身的稳定 DOM 锚点 `[data-chat-anchor-key]`(与产品内部 paging/scroll 定位同源),`scrollIntoView` 平滑滚动
- 位置跟踪:捕获 `[data-conversation-scroll]` 滚动容器的 scroll 事件(节流 120ms),计算视口顶部首个可见节点
- 样式:自建 `<style>` 注入,颜色全部使用 `--dsw-*` 主题 token;插件卸载时随 fiber 清理

## 兼容性说明

- 目标平台:DSH Web 端(`dsh.client.platform: web`),依赖内核 seed 的 `react` 与 `slots` 服务、`dsh-client-runtime` 与 `dsh-client-ui-conversation` 提供的标准能力(已声明在 `dsh.client.inject` 中)
- **版本敏感点**:`[data-chat-anchor-key]` / `[data-conversation-scroll]` 是当前 DSH 聊天视图的 DOM 锚点约定,DSH 升级后若锚点变化,只需调整 `lib/client.js` 中 `findAnchor` / `computeActiveKey` 两个函数
- 未声明 `timer` 硬依赖:客户端的 timer 服务存在则用于节流,不存在时自动退化为未节流模式

## 目录结构

```
lib/
  index.js   # 宿主侧空入口(纯浏览器插件)
  client.js  # 浏览器端完整实现(window.__ModuleLoader__ 模块格式)
example.patch.yml   # composition 补丁示例
```

## License

MIT
