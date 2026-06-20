# 编辑器共享组件与迁移规范

本文档定义配置编辑器的表单分组、字段帮助和下拉空值交互。后续重构 DNS、TUN、Sniffer 等编辑器时，应优先复用本文组件和约定，避免继续复制 GeneralEditor 的旧式标题、逐字段折叠和常驻英文说明。

## 适用范围

- 适用于 `src/components/editors/` 下以字段表单为主体的编辑器。
- 不改变配置模型、默认值、store 更新方式或 YAML 序列化逻辑。
- 列表、表格、拓扑图等专用编辑器可复用字段帮助，但不强制使用 `EditorSection`。
- 当前参考实现为 `src/components/editors/general/GeneralEditor.tsx`。

## 组件位置

| 组件 | 路径 | 职责 |
|------|------|------|
| `EditorSection` | `src/components/editors/shared/EditorSection.tsx` | 统一字段分组标题、说明、适用范围和整组折叠 |
| `FieldWrapper` | `src/components/editors/shared/FieldWrapper.tsx` | 统一字段名、状态标记、帮助 Tooltip 和输入控件间距 |
| `SelectField` | `src/components/editors/shared/fields.tsx` | 提供原生下拉框和仅空值显示的占位符 |

## EditorSection

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | 必填 | 面向用户的中文分组名，按任务而不是 YAML 前缀命名 |
| `description` | `string` | 必填 | 一句话说明该组影响的行为 |
| `children` | `ReactNode` | 必填 | 分组内字段网格或其他内容 |
| `collapsible` | `boolean` | `false` | 是否允许整组展开和折叠 |
| `defaultOpen` | `boolean` | `true` | 可折叠组的初始状态 |
| `stashSupport` | `boolean` | 未设置 | 传入 `false` 时在组标题显示“仅 mihomo” |

### 分组规则

1. 每页只保留一个高频核心组常显，使用 `collapsible={false}`。
2. 除核心组外，其他字段组使用 `collapsible` 和 `defaultOpen={false}`。
3. 分组按用户任务命名，例如“外部控制”“状态持久化”，不要直接使用 `Profile` 等内部结构名。
4. 整组字段均不支持 Stash 时，在 `EditorSection` 上传入 `stashSupport={false}`。
5. 混合支持的组不显示组级徽标，只在例外字段的 `FieldWrapper` 上标记 `stashSupport={false}`。
6. 不再为组内每个高级字段设置 `advanced`，避免同时出现组级和字段级两层折叠。

## FieldWrapper

### 新字段帮助 API

| 属性 | 类型 | 说明 |
|------|------|------|
| `help` | `ReactNode` | 面向普通用户的中文行为说明；传入后显示带圈问号 |
| `yamlKey` | `string` | Tooltip 中显示的完整 YAML 路径 |
| `defaultValue` | `string \| number \| boolean` | 已确认的默认值；不确定时不要填写 |
| `example` | `string` | 示例值；使用 `help` 时显示在 Tooltip 中 |
| `required` | `boolean` | 显示“必填”状态 |
| `sensitive` | `boolean` | 显示“敏感”状态 |
| `stashSupport` | `boolean` | 传入 `false` 时显示字段级“仅 mihomo” |

`description`、`advanced` 和 `defaultExpanded` 为旧编辑器保留，迁移后的页面不应继续用它们展示 YAML 字段名或实现逐字段折叠。

### 帮助文案格式

- 第一段说明字段会改变什么行为，以及用户何时需要它。
- YAML 字段名通过 `yamlKey` 提供，不要拼进 `help`。
- 仅在语义明确时提供默认值、单位或示例，避免把输入框 placeholder 当成真实默认值。
- 文案使用中文，协议名、枚举值和 YAML key 保留原文。
- Tooltip 支持鼠标悬停、键盘聚焦和 `Esc` 关闭；触发按钮必须保留自动生成的可访问名称。

```tsx
<FieldWrapper
  label="日志级别"
  help="控制内核日志详细程度，排查问题时可临时使用 debug。"
  yamlKey="log-level"
  defaultValue="info"
>
  <SelectField
    value={config['log-level'] || ''}
    onChange={(value) => set('log-level', value)}
    options={LOG_LEVELS}
    emptyPlaceholder="未设置"
  />
</FieldWrapper>
```

## SelectField 空值

- 新编辑器使用 `emptyPlaceholder="未设置"` 表示配置中没有该字段。
- 该选项渲染为 `disabled + hidden`，只在当前值为空时显示，不出现在展开列表中。
- `emptyPlaceholder` 不提供清空操作，也不会主动写入空字符串。
- 旧 `placeholder` 仍保留可选择空项的历史行为；同一个下拉框不要同时传入两者。
- 必填字段也应处理导入配置缺失的情况，因此可以使用 `emptyPlaceholder`。

## 标准页面结构

```tsx
const FIELD_GRID_CLASS = 'grid grid-cols-1 gap-4 md:grid-cols-2'

export function ExampleEditor() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 p-6">
      <h2 className="text-sm font-semibold">页面标题</h2>

      <EditorSection
        title="核心设置"
        description="放置最常用且需要立即看到的字段。"
      >
        <div className={FIELD_GRID_CLASS}>{/* fields */}</div>
      </EditorSection>

      <EditorSection
        title="高级设置"
        description="放置低频或需要背景知识的字段。"
        collapsible
        defaultOpen={false}
        stashSupport={false}
      >
        <div className={FIELD_GRID_CLASS}>{/* fields */}</div>
      </EditorSection>
    </div>
  )
}
```

## 迁移步骤

1. 对照模型、metadata、验证规则和兼容性逻辑列出页面实际支持的字段。
2. 以用户任务重新分组，确定唯一核心组和其余默认折叠组。
3. 将旧 `h3 + grid` 替换为 `EditorSection + 响应式 grid`。
4. 将字段名下方的英文说明迁移到 `help`、`yamlKey`、`defaultValue` 和 `example`。
5. 将普通下拉框的选择提示替换为 `emptyPlaceholder="未设置"`。
6. 把完全相同的“仅 mihomo”字段标记提升到组级，混合组保留字段级例外。
7. 删除迁移页面中的逐字段 `advanced` 折叠，但不要改变未迁移页面的旧行为。
8. 同步对应 `docs/specs/editors/*.md` 和组件测试。

## 测试与验收

- 标题必须与 NavTree 的编辑器子项一致。
- 核心组字段初始可见，其他组初始 `aria-expanded="false"` 且内容未挂载。
- 点击组标题后全部字段一起出现，第二次点击可收起。
- Tooltip 覆盖 hover、键盘 focus、中文说明、YAML key 和 `Esc` 关闭。
- 空配置下，下拉框显示“未设置”，空选项同时具有 `disabled` 和 `hidden`。
- 修改字段后 store 和 YAML 预览保持原有行为。
- 字段网格在窄屏为单列，`md` 及以上为双列，无水平溢出。
- 修改组件后至少运行对应组件测试、`npm run typecheck`、`npm run lint` 和 `npm run build`；合并前运行完整 `npm test`。

## 不应做的事

- 不要为了接入 UI 组件修改配置字段默认值或导出结构。
- 不要把未经确认的 placeholder 写成“默认值”。
- 不要在同一字段上同时使用组级折叠和 `FieldWrapper.advanced`。
- 不要为所有字段重复显示相同的“仅 mihomo”徽标。
- 不要在迁移一个页面时批量改变其他编辑器的旧交互。
