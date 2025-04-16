import { toRaw } from 'vue'

/**
 * Clones a value using structuredClone after converting it to its raw value.
 * This ensures that Vue reactivity is stripped before cloning.
 * 
 * @param value The value to clone, which could be reactive or not.
 * @returns A deep clone of the raw value.
 */
export function clone<T>(value: T): T {
  return structuredClone(toRaw(value))
}
