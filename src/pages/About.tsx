import { useUiStore } from '@/store/ui-store'

export function AboutPage() {
  const { setActiveSection } = useUiStore()

  return (
    <div className="p-4 max-w-2xl">
      <button onClick={() => setActiveSection('dashboard')} className="text-xs text-muted-foreground hover:text-foreground mb-4 inline-block">
        &larr; 返回工作台
      </button>

      <h2 className="text-sm font-semibold mb-4">关于 mihomo-yaml</h2>

      <div className="space-y-4 text-xs text-muted-foreground">
        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium text-foreground mb-2">项目说明</h3>
          <p>mihomo-yaml 是一个纯前端 Web 应用，用于创建、导入、图形化编辑并导出 mihomo / Stash YAML 配置文件。</p>
          <p className="mt-1">本项目是第三方工具，不是 mihomo、MetaCubeX 或 Stash 的官方项目。</p>
        </div>

        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium text-foreground mb-2">License / 协议</h3>
          <p>本项目基于 <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)</a> 协议发布。</p>
          <ul className="list-disc ml-4 mt-1 space-y-0.5">
            <li>允许分享和改编</li>
            <li>必须署名</li>
            <li>不得用于商业用途</li>
            <li>修改后的内容需要明确标注变更</li>
          </ul>
        </div>

        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium text-foreground mb-2">Attribution / Credits</h3>
          <ul className="space-y-1">
            <li>
              <a href="https://github.com/MetaCubeX/mihomo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mihomo (MetaCubeX)</a>
              <span className="mx-1">—</span>配置字段定义与文档参考
            </li>
            <li>
              <a href="https://wiki.metacubex.one/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mihomo 官方文档</a>
              <span className="mx-1">—</span>配置参数说明
            </li>
            <li>
              <a href="https://github.com/MetaCubeX/meta-rules-dat" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">MetaCubeX meta-rules-dat</a>
              <span className="mx-1">—</span>内置规则集模板
            </li>
            <li>
              <a href="https://stash.wiki/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stash 文档</a>
              <span className="mx-1">—</span>Stash 兼容字段参考
            </li>
          </ul>
        </div>

        <div className="border border-border rounded-md p-3">
          <h3 className="text-xs font-medium text-foreground mb-2">技术栈</h3>
          <p>React + TypeScript + Vite · Tailwind CSS · Radix UI · CodeMirror · React Flow · Zustand · Dexie · js-yaml · zod</p>
        </div>
      </div>
    </div>
  )
}
