# hosts

## 职责
Configures static domain-to-IP mappings (`hosts` section).

## 文件
- `src/components/editors/hosts/HostsEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **Hosts**。**静态解析**使用与路由规则相同的共享边框列表：所有记录位于一个容器中并以分隔线区分，不再使用逐条卡片。每行在宽屏使用两列输入和操作按钮，在窄屏纵向排列。空列表显示带创建入口的空状态，删除按钮具有可访问名称。

## 配置字段
- `hosts` (map of `domain → string | string[]`)

## 使用组件
- `TextField`
- `EditorSection`
- `EditorList`, `EditorListRow`
- `lucide-react` (Plus, Trash2)

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`（标题、空状态、增删和响应式布局）

## 关联测试
None.
