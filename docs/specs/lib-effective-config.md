# lib-effective-config

## 职责
在不修改编辑器原始状态的前提下，生成参与校验、兼容转换和 YAML 输出的有效配置。

## 文件
`src/lib/effective-config.ts`

## 导出 API
| 导出 | 签名 | 说明 |
|------|------|------|
| `getEffectiveConfig` | `(config: MihomoConfig) => MihomoConfig` | `dns.enable !== true` 时返回省略整个 `dns` 的浅层投影，并过滤 DNS 路径的导入校验错误；DNS 开启或不存在时复用原对象 |

## 关键行为
- 不删除 Store 中的 DNS 字段，关闭再开启时可恢复原编辑值。
- YAML 序列化、后台派生、完整性检查和 mihomo/Stash 兼容报告共用此入口。
