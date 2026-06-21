# clash-for-android

## 职责
Configures Android-specific Clash client options (`clash-for-android` section).

## 文件
- `src/components/editors/clash-for-android/ClashForAndroidEditor.tsx`

## UI 结构
页面标题与 NavTree 统一为 **Clash for Android**，位于高级分组第二项。两个字段位于常显的 **Android 客户端行为** 分组，并显示整组“仅 mihomo”标记。字段帮助通过中文 Tooltip 展示；窄屏单列、`md` 及以上双列。

## 配置字段
- `clash-for-android.append-system-dns`
- `clash-for-android.ui-subtitle-pattern`

## 使用组件
- `FieldWrapper`
- `EditorSection`
- `BoolField`
- `TextField`

## 关联引擎
- `src/__tests__/components/FormEditorUx.test.tsx`

## 关联测试
None.
