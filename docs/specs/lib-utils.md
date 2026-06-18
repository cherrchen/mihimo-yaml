# lib-utils

## 职责
Utility for merging CSS class names with Tailwind CSS conflict resolution.

## 文件
`src/lib/utils.ts`

## 导出 API

| 导出 | 类型 | 说明 |
|------|------|------|
| `cn` | `function` | Merges class name inputs using `clsx` and resolves Tailwind conflicts via `twMerge` |

```typescript
function cn(...inputs: ClassValue[]): string
```

## 依赖
- `clsx` — class name construction (`clsx`, `ClassValue`)
- `tailwind-merge` — Tailwind CSS class conflict resolution (`twMerge`)

## 关键数据流
`cn` accepts any number of `ClassValue` arguments (strings, objects, arrays, null/undefined/false). It passes them through `clsx` to produce a single space-separated class string, then through `twMerge` to resolve conflicting Tailwind utility classes (e.g. `p-4 p-2` → `p-2`). The result is a single string suitable for React `className` props. This is the standard `cn` helper used throughout the component tree.

## 关联测试
- No dedicated test file
