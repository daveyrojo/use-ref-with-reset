import { describe, it, expect, vi } from 'vitest'
import { ref, reactive } from 'vue'
import { useRefWithReset } from '../src'

describe('useRefWithReset', () => {
  it('tracks changes and resets correctly for primitives', () => {
    const { value, original, reset, isModified } = useRefWithReset('hello')

    expect(value.value).toBe('hello')
    expect(original.value).toBe('hello')
    expect(isModified.value).toBe(false)

    value.value = 'world'

    expect(value.value).toBe('world')
    expect(isModified.value).toBe(true)

    reset()

    expect(value.value).toBe('hello')
    expect(isModified.value).toBe(false)
  })

  it('handles objects with deep copy and reset', () => {
    const initial = { count: 1, tags: ['a', 'b'] }
    const { value, original, reset, isModified } = useRefWithReset(initial)

    expect(value.value.count).toBe(1)
    value.value.count = 2
    value.value.tags.push('c')

    expect(isModified.value).toBe(true)

    reset()
    expect(value.value).toEqual(original.value)
    expect(value.value.tags).toEqual(['a', 'b'])
  })

  it('updates value and optionally original when watchSource changes', async () => {
    const source = ref({ a: 1 })
    const { value, original, isModified } = useRefWithReset({ a: 1 }, {
      watchSource: source,
      syncOriginalOnSourceChange: true,
      deepWatch: true
    })

    expect(value.value.a).toBe(1)

    source.value = { a: 99 }

    await Promise.resolve() // flush microtask
    expect(value.value.a).toBe(99)
    expect(original.value.a).toBe(99)
    expect(isModified.value).toBe(false)
  })

  it('can track watchSource without syncing original', async () => {
    const source = ref({ a: 42 })
    const { value, original, isModified } = useRefWithReset({ a: 42 }, {
      watchSource: source,
      syncOriginalOnSourceChange: false,
      deepWatch: true
    })

    source.value = { a: 100 }
    await Promise.resolve()

    expect(value.value.a).toBe(100)
    expect(original.value.a).toBe(42)
    expect(isModified.value).toBe(true)
  })

  it('works with reactive() sources', async () => {
    const source = reactive({ foo: 'bar' })
    const { value, original, reset } = useRefWithReset(source, {
      watchSource: source,
      deepWatch: true,
    })

    source.foo = 'baz'
    await Promise.resolve()

    expect(value.value.foo).toBe('baz')
    reset()
    expect(value.value.foo).toBe('baz') // original was updated too
  })
})
