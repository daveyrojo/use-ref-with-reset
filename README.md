# use-ref-with-reset

> 💡 A tiny Vue 3 composable that tracks and resets reactive values to their original state — with optional deep watching, prop syncing, and helper methods like `resetTo()` and `set()`.

---

## ✨ Features

- ✅ Tracks changes and compares against an original reference
- 🔁 `reset()` support to roll back state
- 🧠 `isModified` to know if value has changed
- 🔄 `resetTo()` to redefine the original value
- 🔧 `set()` for safe, shallow updates
- 🔍 Optional deep watching
- 📦 Lightweight and tree-shakeable

---

## 📦 Installation

```bash
npm install use-ref-with-reset
# or
pnpm add use-ref-with-reset
```

## 🧪 Quick Example
```typescript
import { useRefWithReset } from 'use-ref-with-reset'

const { value, reset, isModified, set, resetTo } = useRefWithReset({ count: 1 })

value.value.count++             // Modify
console.log(isModified.value)   // true

reset()                         // Back to { count: 1 }
resetTo({ count: 100 })         // Redefine original
set({ count: 999 })             // Change value

```

## 🔧 Usage with Props

```typescript
const props = defineProps<{
  config: { visible: boolean }
}>()

const {
  value: config,
  original,
  reset,
  isModified
} = useRefWithReset(() => props.config, {
  watchSource: () => props.config,
  deepWatch: true
})

```

## 🧰 API

useRefWithReset<T>(initial, options)

```
argument,type,Description
initial, T | () => T | Ref<T>, The initial or reactive value
options, UseRefWithResetOptions<T>, Options for deep watch, syncing, etc.

```

## 🧩 Options
```typescript
interface UseRefWithResetOptions<T> {
  watchSource?: MaybeRefOrGetter<T>
  syncOriginalOnSourceChange?: boolean // default: true
  deepWatch?: boolean                  // default: false
  freezeOriginal?: boolean             // default: false
}

```

## ✅ When to Use

```
Use Case, ✅ Recommended?
Temporary form state, ✅ Yes
Compare props to modified local state, ✅ Yes
Undo history, ❌ No
Complex object diffs, ⚠️ Better with deep libraries like fast-deep-equal

```

## 🧪 Testing

```bash
npm run test
```
Includes a Vitest test suite in /test

## 🧑‍💻 Author

Made with ❤️ by David Eldridge

## 📄 License

MIT