/// <reference types="bun-types" />

declare module "bun:test" {
  export function test(name: string, fn: () => void | Promise<void>): void
  export function expect<T>(actual: T): {
    toBe(expected: T): void
    toEqual(expected: T): void
    toBeTruthy(): void
    toBeFalsy(): void
    toBeNull(): void
    toBeUndefined(): void
    toHaveLength(length: number): void
  }
}
