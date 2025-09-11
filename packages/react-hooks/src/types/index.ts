export interface WindowSize {
  width: number;
  height: number;
}

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface CounterActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  set: (value: number) => void;
}