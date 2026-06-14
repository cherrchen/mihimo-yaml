# mihomo-yaml

mihomo / Stash YAML 配置编辑器 —— 纯前端图形化配置工作台。

创建、导入、编辑、校验并导出 mihomo 和 Stash 兼容 YAML 配置文件。20 个配置模块编辑器，Zod 运行时校验，YAML diff 对比，120 个测试全部通过。

## 功能

- 从 YAML 文件、URL、剪贴板导入配置（URL 拉取支持 CORS 代理；浏览器直连不保证自定义 User-Agent 生效）
- Zod 运行时 schema 校验，导入时逐字段类型错误检测
- 图形化编辑 20 个 mihomo 配置模块（General、DNS、Proxies、Proxy Groups、Rules、iptables、ebpf 等）
- 实时 YAML 预览与校验（CodeMirror 6）
- YAML diff 对比（撤销/重做后自动显示差异）
- 导出 mihomo 完整配置与 Stash 兼容配置（含 DNS 多服务器策略交互、兼容性报告）
- 引用完整性检查、循环检测、链路验证
- external-controller 连接（测试代理延迟）
- 保留未知字段（round-trip 不丢失）
- YAML 注释提取（yaml 包）
- 拖拽排序（DNS 服务器列表、路由规则、代理组成员）
- 撤销/重做（50 步历史深度）
- 自动保存（localStorage + Dexie IndexedDB）
- 浅色 / 深色 / 跟随系统 三模式
- 响应式布局（桌面优先，基本移动端适配）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# TypeScript 类型检查
npm run typecheck

# ESLint 检查
npm run lint

# 生产构建（输出到 dist/）
npm run build

# 运行测试（vitest）
npm test

# 测试 Watch 模式
npm run test:watch
```

### 技术栈

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Zustand · Dexie · CodeMirror 6 · React Flow · Zod 4 · yaml · diff · @dnd-kit

### 测试

```
120 tests · 22 test files · 0 ESLint warnings
```

## License / 协议

本项目基于 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 协议发布。

- 允许分享和改编
- 必须署名
- 不得用于商业用途
- 修改后的内容需要明确标注变更

## Attribution / Credits

本项目引用以下开源项目和资源：

- [mihomo (MetaCubeX)](https://github.com/MetaCubeX/mihomo) — 配置字段定义与文档参考
- [mihomo 官方文档](https://wiki.metacubex.one/) — 配置参数说明
- [MetaCubeX meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat) — 内置规则集模板
- [Stash 文档](https://stash.wiki/) — Stash 兼容字段参考

本项目是第三方纯前端配置编辑器，不是 mihomo、MetaCubeX 或 Stash 官方项目。
