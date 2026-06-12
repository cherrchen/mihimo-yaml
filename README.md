# mihomo-yaml

mihomo / Stash YAML 配置编辑器 —— 纯前端图形化配置工作台。

创建、导入、编辑、校验并导出 mihomo 和 Stash 兼容 YAML 配置文件。

## 功能

- 从 YAML 文件、URL、剪贴板导入配置（URL 拉取支持自定义 User-Agent）
- 图形化编辑所有 mihomo 配置项（General、DNS、Proxies、Proxy Groups、Rules 等）
- 实时 YAML 预览与校验
- 导出 mihomo 完整配置与 Stash 兼容配置
- 引用完整性检查、循环检测、链路验证
- 保留未知字段（round-trip 不丢失）
- 拖拽排序（DNS 服务器列表、路由规则、代理组成员）
- 浅色 / 深色模式

## 开发

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm test
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
