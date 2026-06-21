# general

## 职责
Configures core Mihomo/YAML top-level settings: mode, logging, external controller, connections, GeoData, and profile.

## 文件
- `src/components/editors/general/GeneralEditor.tsx`

## UI 结构
页面标题与 NavTree 子项统一为 **全局设置**。表单在窄屏使用单列，`md` 及以上使用双列，并按用户任务分为五组：

- **核心运行**（常显）– mode, log-level, ipv6, interface-name
- **进程与连接优化**（默认折叠，仅 mihomo）– find-process-mode, keep-alive-interval, disable-keep-alive, tcp-concurrent, unified-delay
- **外部控制**（默认折叠，仅 mihomo）– external-controller, secret, external-controller-tls, external-ui
- **GEO 数据管理**（默认折叠，仅 mihomo）– geodata-mode, geodata-loader, geo-auto-update, geo-update-interval
- **状态持久化**（默认折叠，仅 mihomo）– store-selected, store-fake-ip

高级内容通过 `EditorSection` 整组展开或折叠，不再逐字段折叠。全组仅支持 mihomo 时，适用范围标记显示在分组标题；混合分组中的例外字段仍显示字段级标记。

字段名旁的带圈问号在 hover 或键盘 focus 时显示中文说明、YAML 字段名，以及适用的默认值、单位和示例。迁移后的字段不再常驻显示浅色英文说明。

普通下拉框使用 `emptyPlaceholder="未设置"`：仅字段为空时显示，展开列表时该选项保持 `disabled + hidden`，不提供清空操作。

## 配置字段
- `mode`
- `log-level`
- `ipv6`
- `interface-name`
- `find-process-mode`
- `external-controller`
- `secret`
- `external-controller-tls`
- `external-ui`
- `keep-alive-interval`
- `disable-keep-alive`
- `tcp-concurrent`
- `unified-delay`
- `geodata-mode`
- `geodata-loader`
- `geo-auto-update`
- `geo-update-interval`
- `profile.store-selected`
- `profile.store-fake-ip`

## 使用组件
- `BoolField`（所有布尔字段统一渲染为 shadcn Switch）
- `EditorSection`
- `FieldWrapper`
- `SelectField`
- `NumberField`
- `TextField`
- `SensitiveField`
- Constants: `MODES`, `LOG_LEVELS`, `FIND_PROCESS_MODES`, `GEODATA_LOADERS`

共享组件 API 和后续编辑器迁移规则见 `docs/EDITOR_COMPONENT_GUIDE.md`。

## 关联引擎
- `src/lib/constants.ts` – provides allowed values for selects

## 关联测试
- `src/__tests__/components/GeneralEditor.test.tsx`
- `src/__tests__/components/EditorLayouts.test.tsx`

组件测试覆盖标题、字段分组、默认折叠、Tooltip、下拉空值和响应式网格。
