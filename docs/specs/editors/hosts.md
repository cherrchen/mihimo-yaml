# hosts

## 职责
Configures static domain-to-IP mappings (`hosts` section).

## 文件
- `src/components/editors/hosts/HostsEditor.tsx`

## UI 结构
Flat key-value list with domain and IP text fields per row. Add/delete buttons for each entry.

## 配置字段
- `hosts` (map of `domain → string | string[]`)

## 使用组件
- `TextField`
- `lucide-react` (Plus, Trash2)

## 关联引擎
None.

## 关联测试
None.
