import { type Ref, ref, watch, computed, toRaw } from 'vue'
import { toValue, type MaybeRefOrGetter } from '@vueuse/core'
import { clone } from './utils/clone'

/**
 * Options for `useRefWithReset` composable.
 */
export interface UseRefWithResetOptions<T> {
  /**
   * A source to watch for changes and sync original value.
   * If provided, the composable will automatically update
   * `value` and `original` when the source changes.
   */
  watchSource?: MaybeRefOrGetter<T>

  /**
   * Whether to synchronize `original` with the source when it changes.
   * @default true
   */
  syncOriginalOnSourceChange?: boolean

  /**
   * Whether to perform deep watching for the `watchSource`.
   * Can be helpful when watching objects or arrays.
   * @default false
   */
  deepWatch?: boolean

  /**
   * Whether to freeze the `original` value to prevent accidental mutation.
   * @default false
   */
  freezeOriginal?: boolean
}

/**
 * Return type of `useRefWithReset`.
 */
export interface UseRefWithResetReturn<T> {
  /**
   * The current value, which can be modified.
   */
  value: Ref<T>

  /**
   * The original value, used for comparison and resetting.
   */
  original: Ref<T>

  /**
   * Resets the `value` back to the original value.
   */
  reset: () => void

  /**
   * Resets both `value` and `original` to a new given value.
   * This is useful if you need to redefine the original state.
   * 
   * @param newOriginal The new original value to set.
   */
  resetTo: (newOriginal: T) => void

  /**
   * Sets the `value` to a new state.
   * 
   * @param newValue The new value to set.
   */
  set: (newValue: T) => void

  /**
   * A computed boolean that tells if the value has been modified
   * compared to the original value.
   */
  isModified: Ref<boolean>
}

/**
 * A composable that tracks a value and provides methods to reset
 * it to its original state, track if it's been modified, and modify it.
 * 
 * @param initial The initial value of the state.
 * @param options Options for watching, syncing, and deep comparison.
 * 
 * @returns An object containing `value`, `original`, `reset()`, `resetTo()`, `set()`, and `isModified`.
 */
export function useRefWithReset<T>(
  initialValue: MaybeRefOrGetter<T>,
  options: UseRefWithResetOptions<T> = {}
): UseRefWithResetReturn<T> {
  const {
    watchSource,
    syncOriginalOnSourceChange = true,
    deepWatch = false,
    freezeOriginal = false,
  } = options

  const _initial = toValue(initialValue)
  const original = ref<T>(clone(_initial))
  const value = ref<T>(clone(_initial))

  /**
   * Resets the value back to the original value.
   */
  function reset() {
    value.value = structuredClone(original.value)
  }

  /**
   * Resets the original and value to the new given original value.
   * 
   * @param newOriginal The new value to set as the original and current state.
   */
  function resetTo(newOriginal: T) {
    original.value = freezeOriginal ? Object.freeze(structuredClone(newOriginal)) : structuredClone(newOriginal)
    value.value = structuredClone(clone(original.value))
  }

  /**
   * Sets the value to a new state, overwriting the current state.
   * 
   * @param newValue The new value to set.
   */
  function set(newValue: T) {
    value.value = structuredClone(newValue)
  }

  /**
   * Computed boolean that tracks if the value has changed
   * from the original state.
   */
  const isModified = computed(() => {
    return JSON.stringify(toRaw(value.value)) !== JSON.stringify(toRaw(original.value))
  })

  if (watchSource) {
    watch(
      () => toValue(watchSource),
      (newVal) => {
        const rawVal = toRaw(toValue(newVal))
        value.value = structuredClone(rawVal)
        if (syncOriginalOnSourceChange)
          original.value = freezeOriginal ? Object.freeze(structuredClone(rawVal)) : structuredClone(rawVal)
      },
      { deep: deepWatch }
    )
  }

  return {
    value,
    original,
    reset,
    resetTo,
    set,
    isModified
  } as UseRefWithResetReturn<T>
}
