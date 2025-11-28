import { UseBoundStore } from 'zustand';

declare module 'zustand' {
  interface UseStore<T> {
    (): T;
    <U>(selector: (state: T) => U): U;
  }
}