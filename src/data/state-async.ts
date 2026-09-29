import type {HookDoc} from "@/types";

export const stateAsyncHooks: Record<string, HookDoc> = {
    usestatehistory: {
        name: 'useStateHistory',
        description: 'State with undo, redo and a browsable history. Use it for editors, drawing tools and forms where people expect to step back.',
        category: 'State',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useStateHistory<T>(initial: T | (() => T), options?: StateHistoryOptions): StateHistory<T>',
        usage: `import { useStateHistory } from '@zenuilabs/react-hooks';

export default function App() {
  const { state, set, undo, redo, canUndo, canRedo, history, pointer, go } =
    useStateHistory('Hello', { capacity: 50 });

  return (
    <div>
      <textarea value={state} onChange={(e) => set(e.target.value)} rows={4} />
      <div>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
      <input
        type="range"
        min={0}
        max={history.length - 1}
        value={pointer}
        onChange={(e) => go(Number(e.target.value))}
      />
      <p>Version {pointer + 1} of {history.length}</p>
    </div>
  );
}`,
        api: [
            {param: 'initial', type: 'T | (() => T)', description: 'The first history entry. Pass a function to compute it lazily.'},
            {param: 'options.capacity', type: 'number', description: 'Maximum number of entries kept, including the current one. The oldest entries are dropped first. Defaults to 100.'},
        ],
        returns: [
            {name: 'state', type: 'T', description: 'The value at the current history position.'},
            {name: 'set', type: '(value: T | ((prev: T) => T)) => void', description: 'Record a new entry. Entries after the current position (the redo stack) are discarded. Setting the same value is ignored.'},
            {name: 'undo', type: '() => void', description: 'Move one entry back. Does nothing at the start.'},
            {name: 'redo', type: '() => void', description: 'Move one entry forward. Does nothing at the end.'},
            {name: 'canUndo', type: 'boolean', description: 'True when there is an earlier entry.'},
            {name: 'canRedo', type: 'boolean', description: 'True when there is a later entry.'},
            {name: 'history', type: 'readonly T[]', description: 'Every recorded entry, oldest first.'},
            {name: 'pointer', type: 'number', description: 'Index of the current entry in history.'},
            {name: 'go', type: '(index: number) => void', description: 'Jump to any entry. Out of range indexes are clamped.'},
            {name: 'clear', type: '() => void', description: 'Forget every entry except the current value.'},
        ],
    },
    usemap: {
        name: 'useMap',
        description: 'A Map in React state with immutable updates and stable action functions. Use it for keyed collections such as carts, caches and lookups by id.',
        category: 'State',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useMap<K, V>(initial?: Iterable<readonly [K, V]> | ReadonlyMap<K, V>): MapState<K, V>',
        usage: `import { useMap } from '@zenuilabs/react-hooks';

const products = ['Tea', 'Mug', 'Beans'];

export default function Cart() {
  const { map: cart, size, set, remove, clear } = useMap<string, number>([['Tea', 1]]);

  const add = (name: string) => set(name, (cart.get(name) ?? 0) + 1);

  return (
    <div>
      {products.map((name) => (
        <button key={name} onClick={() => add(name)}>Add {name}</button>
      ))}
      <ul>
        {Array.from(cart).map(([name, qty]) => (
          <li key={name}>
            {name} x {qty} <button onClick={() => remove(name)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>{size} products in the cart</p>
      <button onClick={clear}>Empty cart</button>
    </div>
  );
}`,
        api: [
            {param: 'initial', type: 'Iterable<readonly [K, V]> | ReadonlyMap<K, V>', description: 'Entries for the first render. Also used by reset. Defaults to an empty map.'},
        ],
        returns: [
            {name: 'map', type: 'ReadonlyMap<K, V>', description: 'The current map. A new Map object is created on every change, so it works in dependency arrays.'},
            {name: 'size', type: 'number', description: 'Number of entries.'},
            {name: 'set', type: '(key: K, value: V) => void', description: 'Add or replace an entry. Setting the same value again does not re-render.'},
            {name: 'setAll', type: '(entries: Iterable<readonly [K, V]>) => void', description: 'Add or replace several entries in one update.'},
            {name: 'remove', type: '(key: K) => void', description: 'Delete an entry. Named remove because delete cannot be destructured.'},
            {name: 'clear', type: '() => void', description: 'Delete every entry.'},
            {name: 'reset', type: '() => void', description: 'Restore the initial entries.'},
        ],
    },
    useset: {
        name: 'useSet',
        description: 'A Set in React state with add, remove and toggle. Use it for selections, tag filters and any list of unique values.',
        category: 'State',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useSet<T>(initial?: Iterable<T>): SetState<T>',
        usage: `import { useSet } from '@zenuilabs/react-hooks';

const rows = [
  { id: 'a1', name: 'Invoice 1041' },
  { id: 'b2', name: 'Invoice 1042' },
  { id: 'c3', name: 'Invoice 1043' },
];

export default function Selection() {
  const { size, has, toggle, clear } = useSet<string>();

  return (
    <div>
      {rows.map((row) => (
        <label key={row.id} style={{ display: 'block' }}>
          <input type="checkbox" checked={has(row.id)} onChange={() => toggle(row.id)} />
          {row.name}
        </label>
      ))}
      <p>{size} selected</p>
      <button onClick={clear} disabled={size === 0}>Clear selection</button>
    </div>
  );
}`,
        api: [
            {param: 'initial', type: 'Iterable<T>', description: 'Items for the first render. Also used by reset. Defaults to an empty set.'},
        ],
        returns: [
            {name: 'set', type: 'ReadonlySet<T>', description: 'The current set. A new Set object is created on every change.'},
            {name: 'size', type: 'number', description: 'Number of items.'},
            {name: 'has', type: '(item: T) => boolean', description: 'True when the item is in the set for this render.'},
            {name: 'add', type: '(item: T) => void', description: 'Add an item. Adding an existing item does not re-render.'},
            {name: 'remove', type: '(item: T) => void', description: 'Remove an item.'},
            {name: 'toggle', type: '(item: T, force?: boolean) => void', description: 'Add the item when missing, remove it when present. Pass force to always add (true) or remove (false).'},
            {name: 'clear', type: '() => void', description: 'Remove every item.'},
            {name: 'reset', type: '() => void', description: 'Restore the initial items.'},
        ],
    },
    usequeue: {
        name: 'useQueue',
        description: 'A first-in, first-out queue in state. dequeue returns the removed item right away, so a handler can take several items in one go.',
        category: 'State',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useQueue<T>(initial?: Iterable<T>): QueueState<T>',
        usage: `import { useQueue } from '@zenuilabs/react-hooks';

interface Toast {
  id: number;
  text: string;
}

let nextId = 1;

export default function Toasts() {
  const { queue, first, enqueue, dequeue, size } = useQueue<Toast>();

  return (
    <div>
      <button onClick={() => enqueue({ id: nextId++, text: 'Saved' })}>Save</button>
      <button onClick={() => enqueue({ id: nextId++, text: 'Upload failed' })}>Fail upload</button>

      {first && (
        <div role="status">
          {first.text} <button onClick={() => dequeue()}>Dismiss</button>
        </div>
      )}
      <p>{size > 1 ? \`\${size - 1} more waiting\` : 'No more messages'}</p>
      <ul>{queue.map((toast) => <li key={toast.id}>{toast.text}</li>)}</ul>
    </div>
  );
}`,
        api: [
            {param: 'initial', type: 'Iterable<T>', description: 'Items already in the queue, front first. Defaults to empty.'},
        ],
        returns: [
            {name: 'queue', type: 'readonly T[]', description: 'Every item, front first.'},
            {name: 'size', type: 'number', description: 'Number of items.'},
            {name: 'first', type: 'T | undefined', description: 'The front item, the next one dequeue returns.'},
            {name: 'last', type: 'T | undefined', description: 'The item added most recently.'},
            {name: 'enqueue', type: '(...items: T[]) => void', description: 'Add one or more items to the back.'},
            {name: 'dequeue', type: '() => T | undefined', description: 'Remove the front item and return it. Returns undefined when the queue is empty.'},
            {name: 'peek', type: '() => T | undefined', description: 'Return the front item without removing it. Reads the latest queue, even before a re-render.'},
            {name: 'clear', type: '() => void', description: 'Remove every item.'},
        ],
    },
    usestatemachine: {
        name: 'useStateMachine',
        description: 'A finite state machine from a typed config, with guards and entry and exit effects. State and event names are inferred, so sending an unknown event is a type error.',
        category: 'State',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useStateMachine<S extends string, E extends string>(config: StateMachineConfig<S, E>, options?: StateMachineOptions): StateMachine<S, E>',
        usage: `import { useStateMachine } from '@zenuilabs/react-hooks';

export default function UploadButton() {
  const { state, send, can } = useStateMachine({
    initial: 'idle',
    states: {
      idle: { on: { START: 'uploading' } },
      uploading: {
        on: { DONE: 'success', FAIL: 'error', CANCEL: 'idle' },
        entry: ({ send }) => {
          const timer = setTimeout(() => send(Math.random() > 0.3 ? 'DONE' : 'FAIL'), 1500);
          return () => clearTimeout(timer);
        },
      },
      success: { on: { RESET: 'idle' } },
      error: { on: { START: 'uploading', RESET: 'idle' } },
    },
  });

  return (
    <div>
      <p>Status: {state}</p>
      <button onClick={() => send('START')} disabled={!can('START')}>Upload</button>
      <button onClick={() => send('CANCEL')} disabled={!can('CANCEL')}>Cancel</button>
      <button onClick={() => send('RESET')} disabled={!can('RESET')}>Reset</button>
    </div>
  );
}`,
        api: [
            {param: 'config.initial', type: 'S', description: 'The state to start in. Must be a key of config.states.'},
            {param: 'config.states', type: 'Record<S, StateMachineStateConfig<S, E>>', description: 'One entry per state. State names are inferred from these keys.'},
            {param: 'config.states[s].on', type: '{ [event]: S | { target: S; guard?: (info) => boolean } }', description: 'Transitions out of the state. A guard returning false blocks the transition. Event names are inferred from these keys.'},
            {param: 'config.states[s].entry', type: '(info) => void | (() => void)', description: 'Runs after the state is entered. Receives from, to, event and send. A returned cleanup runs when the state is left or the component unmounts.'},
            {param: 'config.states[s].exit', type: '(info) => void', description: 'Runs when the state is left through a transition or reset. Not called on unmount.'},
            {param: 'options.historyLimit', type: 'number', description: 'How many transitions history keeps. Defaults to 20.'},
        ],
        returns: [
            {name: 'state', type: 'S', description: 'The current state name.'},
            {name: 'event', type: 'E | null', description: 'The event behind the latest transition. Null at first and after reset.'},
            {name: 'send', type: '(event: E) => boolean', description: 'Try a transition. Returns true when the machine moved. Several sends in one handler chain correctly.'},
            {name: 'can', type: '(event: E) => boolean', description: 'True when the event would cause a transition from the current state, guards included.'},
            {name: 'matches', type: '(...states: S[]) => boolean', description: 'True when the current state is one of the given states.'},
            {name: 'history', type: 'readonly { from: S; to: S; event: E; at: number }[]', description: 'Recent transitions, oldest first.'},
            {name: 'reset', type: '() => void', description: 'Go back to the initial state and clear history. Runs exit and entry effects.'},
        ],
    },
    usebroadcaststate: {
        name: 'useBroadcastState',
        description: 'State that stays in sync across every open tab of your site. Uses BroadcastChannel and falls back to the storage event.',
        category: 'State',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useBroadcastState<T>(channel: string, initial: T): [T, (value: T | ((prev: T) => T)) => void, BroadcastStateMeta]',
        usage: `import { useBroadcastState } from '@zenuilabs/react-hooks';

export default function CartBadge() {
  const [count, setCount, { isSupported, source }] = useBroadcastState('cart-count', 0);

  return (
    <div>
      <p>Items in cart: {count}</p>
      <button onClick={() => setCount((n) => n + 1)}>Add item</button>
      <button onClick={() => setCount(0)}>Empty cart</button>
      <p>
        {isSupported
          ? \`Open a second tab to see it sync. Last change: \${source}.\`
          : 'Tab sync is not available here.'}
      </p>
    </div>
  );
}`,
        api: [
            {param: 'channel', type: 'string', description: 'Channel name. Every hook using the same name, in any tab of the same origin, shares the value.'},
            {param: 'initial', type: 'T', description: 'Value used until another tab shares a newer one. Must be structured-cloneable and JSON-serializable.'},
        ],
        returns: [
            {name: '[0] state', type: 'T', description: 'The shared value.'},
            {name: '[1] setState', type: '(value: T | ((prev: T) => T)) => void', description: 'Update the value here and in every other tab. The newest write wins.'},
            {name: '[2].isSupported', type: 'boolean', description: 'True when updates can reach other tabs. False during SSR and before mount.'},
            {name: '[2].transport', type: "'broadcast-channel' | 'storage' | 'none'", description: 'The mechanism in use.'},
            {name: '[2].source', type: "'initial' | 'local' | 'remote'", description: 'Where the current value came from: the initial value, this tab or another tab.'},
        ],
    },
    usecachedfetch: {
        name: 'useCachedFetch',
        description: 'Stale-while-revalidate data fetching with a cache shared by every component. Cached data renders instantly while a background request refreshes it.',
        category: 'Async & Data',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useCachedFetch<T>(key: string | null, fetcher: (key: string) => Promise<T>, options?: CachedFetchOptions): CachedFetch<T>',
        usage: `import { useState } from 'react';
import { useCachedFetch } from '@zenuilabs/react-hooks';

interface Post {
  id: number;
  title: string;
  body: string;
}

const getJson = (url: string) => fetch(url).then((res) => res.json());

export default function PostViewer() {
  const [id, setId] = useState(1);
  const { data, error, isLoading, isValidating, revalidate } = useCachedFetch<Post>(
    \`https://jsonplaceholder.typicode.com/posts/\${id}\`,
    getJson,
    { ttl: 30_000 }
  );

  return (
    <div>
      <button onClick={() => setId((n) => Math.max(1, n - 1))}>Previous</button>
      <button onClick={() => setId((n) => n + 1)}>Next</button>
      <button onClick={() => revalidate()}>Refresh</button>
      {isValidating && <span> Updating...</span>}
      {error && <p>Failed: {error.message}</p>}
      {isLoading ? <p>Loading...</p> : data && <article><h2>{data.title}</h2><p>{data.body}</p></article>}
    </div>
  );
}`,
        api: [
            {param: 'key', type: 'string | null', description: 'Cache key, usually the URL. Every hook with the same key shares data and requests. Pass null to pause.'},
            {param: 'fetcher', type: '(key: string) => Promise<T>', description: 'Loads the data for a key. The latest function is always used.'},
            {param: 'options.ttl', type: 'number', description: 'Milliseconds cached data counts as fresh. Fresh data is served without a request. Defaults to 0, so every mount revalidates in the background.'},
            {param: 'options.dedupeInterval', type: 'number', description: 'Requests for the same key within this many milliseconds of the last one share it or are skipped. Defaults to 2000.'},
            {param: 'options.revalidateOnFocus', type: 'boolean', description: 'Revalidate stale data when the tab regains focus. Defaults to true.'},
            {param: 'options.revalidateOnReconnect', type: 'boolean', description: 'Revalidate when the browser comes back online. Defaults to true.'},
        ],
        returns: [
            {name: 'data', type: 'T | undefined', description: 'Cached data for the key. Kept when a later request fails.'},
            {name: 'error', type: 'Error | null', description: 'The error from the latest failed request, cleared by the next success.'},
            {name: 'isLoading', type: 'boolean', description: 'True when nothing is cached for the key yet and the first request is pending.'},
            {name: 'isValidating', type: 'boolean', description: 'True while any request for the key runs, including background revalidation.'},
            {name: 'updatedAt', type: 'number | null', description: 'When the cached value was written (Date.now()), or null.'},
            {name: 'mutate', type: '(data: T | ((current?: T) => T), options?: { revalidate?: boolean }) => Promise<T | undefined>', description: 'Write to the cache. Every consumer of the key updates. Revalidates afterwards unless revalidate is false. A request already in flight is ignored.'},
            {name: 'revalidate', type: '() => Promise<T | undefined>', description: 'Fetch now, joining a request that is already in flight.'},
        ],
    },
    useasyncretry: {
        name: 'useAsyncRetry',
        description: 'Run an async function and retry it when it fails, with a fixed delay or backoff. Use it for flaky network calls that usually succeed on a second try.',
        category: 'Async & Data',
        level: 'intermediate',
        since: '1.0.0',
        signature: 'useAsyncRetry<T = any>(asyncFunction: (...args: any[]) => Promise<T>, immediate?: boolean, maxRetries?: number, retryDelay?: number | ((attempt: number, error: unknown) => number)): AsyncRetryState<T> & AsyncRetryControls<T>',
        usage: `import { useAsyncRetry } from '@zenuilabs/react-hooks';

interface Todo {
  id: number;
  title: string;
}

async function loadTodos(): Promise<Todo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

export default function Todos() {
  // Up to 4 attempts, waiting 500, 1000, then 2000 ms between them.
  const { data, loading, error, attempts, execute } = useAsyncRetry(
    loadTodos,
    true,
    4,
    (attempt) => 250 * 2 ** attempt
  );

  if (loading) return <p>Loading (attempt {attempts + 1})...</p>;
  if (error) return <button onClick={() => execute()}>Failed after {attempts} attempts. Try again</button>;

  return <ul>{data?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>;
}`,
        api: [
            {param: 'asyncFunction', type: '(...args: any[]) => Promise<T>', description: 'The work to run. Arguments passed to execute are forwarded to every attempt.'},
            {param: 'immediate', type: 'boolean', description: 'Run once on mount. Defaults to true.'},
            {param: 'maxRetries', type: 'number', description: 'Total number of attempts, including the first one. The function runs at most maxRetries times. Defaults to 3.'},
            {param: 'retryDelay', type: 'number | ((attempt: number, error: unknown) => number)', description: 'Milliseconds between attempts. A function receives the number of the attempt that failed (1-based) for backoff. Defaults to 1000.'},
        ],
        returns: [
            {name: 'data', type: 'T | null', description: 'The result of the successful attempt.'},
            {name: 'loading', type: 'boolean', description: 'True from the first attempt until success or the final failure, including the waits in between.'},
            {name: 'error', type: 'any', description: 'The error from the last attempt once every attempt has failed. Null while retrying.'},
            {name: 'attempts', type: 'number', description: 'Attempts made in the current run: the successful attempt number on success, maxRetries after the final failure, 0 after reset.'},
            {name: 'execute', type: '(...args: any[]) => Promise<T | null>', description: 'Start a new run. Cancels a pending retry from the previous run and ignores its late results. Resolves to the data, or null on failure or cancellation.'},
            {name: 'reset', type: '() => void', description: 'Cancel any pending retry and clear data, error and attempts.'},
        ],
    },
    useoptimisticstate: {
        name: 'useOptimisticState',
        description: 'Show the result of an update immediately, run the real request, and roll back if it fails. Works on React 18 without useOptimistic.',
        category: 'Async & Data',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useOptimisticState<T, A = T>(value: T, updateFn?: (current: T, input: A) => T): OptimisticState<T, A>',
        usage: `import { useState } from 'react';
import { useOptimisticState } from '@zenuilabs/react-hooks';

async function saveTitle(title: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (title.trim() === '') throw new Error('Title cannot be empty');
  return title.trim();
}

export default function EditableTitle() {
  const [saved, setSaved] = useState('Quarterly report');
  const [draft, setDraft] = useState(saved);
  const { value: title, isPending, error, update } = useOptimisticState(saved);

  const submit = async () => {
    await update(draft, async () => {
      const confirmed = await saveTitle(draft);
      setSaved(confirmed);
    });
  };

  return (
    <div>
      <h2 style={{ opacity: isPending ? 0.6 : 1 }}>{title}</h2>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      <button onClick={submit}>Rename</button>
      {error && <p>{error.message}. The old title is back.</p>}
    </div>
  );
}`,
        api: [
            {param: 'value', type: 'T', description: 'The confirmed value, usually from props or your data layer. When it changes, pending updates are re-applied on top of it.'},
            {param: 'updateFn', type: '(current: T, input: A) => T', description: 'Combines a value with an update input, for example (count, delta) => count + delta. Defaults to replacing the value with the input.'},
        ],
        returns: [
            {name: 'value', type: 'T', description: 'The confirmed value with every pending update applied.'},
            {name: 'isPending', type: 'boolean', description: 'True while at least one commit is running.'},
            {name: 'error', type: 'Error | null', description: 'The error from the most recent failed commit. Cleared when the next update starts.'},
            {name: 'update', type: '(input: A, commit: (optimistic: T) => Promise<T | void>) => Promise<boolean>', description: 'Apply input right away and run commit. Resolve commit with the server value to adopt it, or with nothing to keep the optimistic result. If commit rejects, the update is rolled back. Resolves to true on success.'},
        ],
    },
    usetaskqueue: {
        name: 'useTaskQueue',
        description: 'Run async tasks in order with a limit on how many run at once. Use it for uploads, batch requests and any work that should not flood the network.',
        category: 'Async & Data',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useTaskQueue<R = unknown>(options?: TaskQueueOptions): TaskQueue<R>',
        usage: `import { useTaskQueue } from '@zenuilabs/react-hooks';

async function upload(file: File, signal: AbortSignal) {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body, signal });
  if (!res.ok) throw new Error(\`Upload failed: \${res.status}\`);
}

export default function Uploader() {
  const { add, tasks, running, pending, isPaused, pause, resume } = useTaskQueue({ concurrency: 3 });

  const onFiles = (files: FileList | null) => {
    Array.from(files ?? []).forEach((file) => add((signal) => upload(file, signal), file.name));
  };

  return (
    <div>
      <input type="file" multiple onChange={(e) => onFiles(e.target.files)} />
      <button onClick={isPaused ? resume : pause}>{isPaused ? 'Resume' : 'Pause'}</button>
      <p>{running} uploading, {pending} waiting</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.label}: {task.status}{task.duration !== null && \` in \${task.duration} ms\`}</li>
        ))}
      </ul>
    </div>
  );
}`,
        api: [
            {param: 'options.concurrency', type: 'number', description: 'Maximum number of tasks running at once. Raising it starts waiting tasks immediately. Defaults to 2.'},
            {param: 'options.paused', type: 'boolean', description: 'Start paused. Defaults to false.'},
        ],
        returns: [
            {name: 'add', type: '(task: (signal: AbortSignal) => Promise<R>, label?: string) => number', description: 'Queue a task and return its id. The signal aborts when the component unmounts.'},
            {name: 'tasks', type: 'readonly TaskQueueTask<R>[]', description: 'Every task with id, label, status (pending, running, done, failed), timestamps, duration, result and error.'},
            {name: 'running', type: 'number', description: 'Tasks running now.'},
            {name: 'pending', type: 'number', description: 'Tasks waiting to start.'},
            {name: 'isPaused', type: 'boolean', description: 'True after pause until resume.'},
            {name: 'pause', type: '() => void', description: 'Stop starting new tasks. Running tasks finish normally.'},
            {name: 'resume', type: '() => void', description: 'Start waiting tasks again.'},
            {name: 'clear', type: '() => void', description: 'Remove waiting and finished tasks. Running tasks keep going.'},
        ],
    },
    usedebouncedcallback: {
        name: 'useDebouncedCallback',
        description: 'Wrap a function so it only runs after calls stop for a given delay. Use it for search inputs, autosave and resize handlers.',
        category: 'Performance',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useDebouncedCallback<Args extends unknown[]>(fn: (...args: Args) => void, delay: number, options?: DebouncedCallbackOptions): DebouncedFunction<Args>',
        usage: `import { useState } from 'react';
import { useDebouncedCallback } from '@zenuilabs/react-hooks';

export default function Autosave() {
  const [text, setText] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const save = useDebouncedCallback(
    (value: string) => {
      localStorage.setItem('draft', value);
      setSavedAt(new Date().toLocaleTimeString());
    },
    800,
    { maxWait: 5000 }
  );

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          save(e.target.value);
        }}
        onBlur={save.flush}
      />
      <p>{save.isPending() ? 'Unsaved changes' : savedAt ? \`Saved at \${savedAt}\` : 'Nothing saved yet'}</p>
    </div>
  );
}`,
        api: [
            {param: 'fn', type: '(...args: Args) => void', description: 'The function to debounce. The latest version is always called.'},
            {param: 'delay', type: 'number', description: 'Milliseconds to wait after the last call.'},
            {param: 'options.leading', type: 'boolean', description: 'Also call on the first call of a burst. Defaults to false.'},
            {param: 'options.trailing', type: 'boolean', description: 'Call after the burst with the latest arguments. Defaults to true.'},
            {param: 'options.maxWait', type: 'number', description: 'Longest time a call can be put off during a continuous burst. Unset means no limit.'},
        ],
        returns: [
            {name: 'debounced', type: '(...args: Args) => void', description: 'The debounced function. Its identity never changes, so it is safe in dependency arrays.'},
            {name: 'debounced.cancel', type: '() => void', description: 'Drop the scheduled call.'},
            {name: 'debounced.flush', type: '() => void', description: 'Run the scheduled call now, if there is one.'},
            {name: 'debounced.isPending', type: '() => boolean', description: 'True when a trailing call is scheduled.'},
        ],
    },
    usethrottledcallback: {
        name: 'useThrottledCallback',
        description: 'Wrap a function so it runs at most once per interval while calls keep coming. Use it for scroll, pointer and resize handlers.',
        category: 'Performance',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useThrottledCallback<Args extends unknown[]>(fn: (...args: Args) => void, interval: number, options?: ThrottledCallbackOptions): ThrottledFunction<Args>',
        usage: `import { useEffect, useState } from 'react';
import { useThrottledCallback } from '@zenuilabs/react-hooks';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  const update = useThrottledCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [update]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      <div style={{ width: \`\${progress}%\`, height: 4, background: 'currentColor' }} />
      <span>{progress}% read</span>
    </div>
  );
}`,
        api: [
            {param: 'fn', type: '(...args: Args) => void', description: 'The function to throttle. The latest version is always called.'},
            {param: 'interval', type: 'number', description: 'Minimum milliseconds between calls.'},
            {param: 'options.leading', type: 'boolean', description: 'Call immediately on the first call of a burst. Defaults to true.'},
            {param: 'options.trailing', type: 'boolean', description: 'Call once more at the end of the interval with the latest arguments. Defaults to true.'},
        ],
        returns: [
            {name: 'throttled', type: '(...args: Args) => void', description: 'The throttled function. Its identity never changes.'},
            {name: 'throttled.cancel', type: '() => void', description: 'Drop the scheduled trailing call.'},
            {name: 'throttled.flush', type: '() => void', description: 'Run the scheduled trailing call now, if there is one.'},
            {name: 'throttled.isPending', type: '() => boolean', description: 'True when a trailing call is scheduled.'},
        ],
    },
};
