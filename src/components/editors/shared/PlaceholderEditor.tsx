interface PlaceholderEditorProps {
  title: string
}

export function PlaceholderEditor({ title }: PlaceholderEditorProps) {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-sm font-semibold mb-3">{title}</h2>
      <p className="text-xs text-muted-foreground mb-4">
        此配置区域的高级编辑器正在开发中。当前 YAML 编辑在预览面板中可用。
      </p>
      <textarea
        className="w-full h-48 rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
        readOnly
        value={`// ${title} YAML 配置预览\n// 当前已加载的配置内容将在右侧 YAML 预览面板中显示`}
      />
    </div>
  )
}
