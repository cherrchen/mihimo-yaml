# general

## 职责
Configures core Mihomo/YAML top-level settings: mode, logging, external controller, connections, GeoData, and profile.

## 文件
- `src/components/editors/general/GeneralEditor.tsx`

## UI 结构
Multi-section two-column form:
- **通用设置** – mode, log-level, ipv6, interface-name
- **进程匹配** – find-process-mode
- **External Controller** – external-controller, secret, external-controller-tls, external-ui
- **连接** – keep-alive-interval, disable-keep-alive, tcp-concurrent, unified-delay
- **GeoData** – geodata-mode, geodata-loader, geo-auto-update, geo-update-interval
- **Profile** – store-selected, store-fake-ip

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
- `FieldWrapper`
- `SelectField`
- `NumberField`
- `TextField`
- `SensitiveField`
- Constants: `MODES`, `LOG_LEVELS`, `FIND_PROCESS_MODES`, `GEODATA_LOADERS`

## 关联引擎
- `src/lib/constants.ts` – provides allowed values for selects

## 关联测试
- `src/__tests__/components/GeneralEditor.test.tsx`
- `src/__tests__/components/EditorLayouts.test.tsx`
