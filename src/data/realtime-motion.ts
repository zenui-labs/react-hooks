import type {HookDoc} from "@/types";

export const realtimeMotionHooks: Record<string, HookDoc> = {
    usewebsocket: {
        name: 'useWebSocket',
        description: 'Connect to a WebSocket and track its status, the latest message and reconnect attempts. Use it for chat, live dashboards and multiplayer state when you need reconnects, heartbeats and a send queue without writing the socket lifecycle yourself.',
        category: 'Realtime',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useWebSocket<T = unknown>(url: string | null, options?: WebSocketOptions<T>): WebSocketResult<T>',
        usage: `import {useState, type FormEvent} from 'react';
import {useWebSocket} from '@zenuilabs/react-hooks';

type ChatMessage = {user: string; text: string};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');

  const {status, send, reconnectAttempt} = useWebSocket<ChatMessage>('wss://chat.example.com/room/42', {
    parse: (data) => JSON.parse(String(data)),
    reconnect: {attempts: 10, delay: (attempt) => Math.min(1000 * 2 ** attempt, 30000)},
    heartbeat: {message: '{"type":"ping"}', interval: 25000},
    onMessage: (message) => setMessages((prev) => [...prev, message]),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send(JSON.stringify({user: 'me', text: draft}));
    setDraft('');
  };

  return (
    <div>
      <p>{status === 'open' ? 'Online' : reconnectAttempt ? \`Reconnecting (attempt \${reconnectAttempt})\` : status}</p>
      <ul>{messages.map((m, i) => <li key={i}><b>{m.user}</b> {m.text}</li>)}</ul>
      <form onSubmit={submit}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}`,
        api: [
            {param: 'url', type: 'string | null', description: 'Socket URL. Pass null to stay disconnected; changing it closes the old socket and opens a new one.'},
            {param: 'options.protocols', type: 'string | string[]', description: 'Subprotocols passed to the WebSocket constructor.'},
            {param: 'options.reconnect', type: 'boolean | {attempts?: number; delay?: number | ((attempt: number) => number)}', description: 'Reconnect after an unexpected close. true uses 5 attempts with exponential backoff from 1s up to 30s. Closing with close() never reconnects. Defaults to false.'},
            {param: 'options.heartbeat', type: '{message?: WebSocketSendData | (() => WebSocketSendData); interval?: number}', description: 'Send a keep-alive while the socket is open. message defaults to "ping" and interval to 30000ms.'},
            {param: 'options.parse', type: '(data: unknown) => T', description: 'Transform raw event.data before it is stored in lastMessage and passed to onMessage, for example JSON.parse.'},
            {param: 'options.onMessage', type: '(message: T, event: MessageEvent) => void', description: 'Called for every incoming message after parse.'},
            {param: 'options.onOpen', type: '(event: Event) => void', description: 'Called each time a connection opens, including after a reconnect.'},
            {param: 'options.onClose', type: '(event: CloseEvent) => void', description: 'Called each time the socket closes.'},
            {param: 'options.onError', type: '(event: Event) => void', description: 'Called on socket errors.'},
        ],
        returns: [
            {name: 'status', type: "'idle' | 'connecting' | 'open' | 'closing' | 'closed'", description: 'Connection state. idle while url is null. Between reconnect attempts it is closed and reconnectAttempt is above 0.'},
            {name: 'lastMessage', type: 'T | null', description: 'The most recent message after parse, or null before the first one.'},
            {name: 'send', type: '(data: WebSocketSendData) => boolean', description: 'Sends immediately when open. While connecting or waiting to reconnect the message is queued and flushed on open. Returns false when the message was dropped because the socket is closed for good.'},
            {name: 'close', type: '(code?: number, reason?: string) => void', description: 'Close the socket, clear the queue and stop reconnecting.'},
            {name: 'reconnect', type: '() => void', description: 'Close the current socket and open a new one with the attempt counter reset. Also reopens after close().'},
            {name: 'reconnectAttempt', type: 'number', description: 'The current reconnect attempt, starting at 1. Resets to 0 when a connection opens.'},
            {name: 'getSocket', type: '() => WebSocket | null', description: 'The underlying socket, for binaryType, bufferedAmount and anything else the hook does not wrap.'},
            {name: 'isSupported', type: 'boolean', description: 'False when the WebSocket API is missing.'},
        ],
    },
    useeventsource: {
        name: 'useEventSource',
        description: 'Subscribe to a Server-Sent Events stream and keep the latest event in state. Use it for one-way server pushes such as notifications, progress updates and price tickers where a WebSocket would be more than you need.',
        category: 'Realtime',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useEventSource<T = string>(url: string | null, options?: EventSourceOptions<T>): EventSourceResult<T>',
        usage: `import {useState} from 'react';
import {useEventSource} from '@zenuilabs/react-hooks';

type Job = {id: string; progress: number; state: 'running' | 'done' | 'failed'};

export default function JobProgress({jobId}: {jobId: string}) {
  const [history, setHistory] = useState<string[]>([]);

  const {status, lastEvent, error, close} = useEventSource<Job>(\`/api/jobs/\${jobId}/events\`, {
    events: ['progress', 'done'],
    parse: (data) => JSON.parse(data),
    onMessage: (event) => {
      setHistory((prev) => [...prev, \`\${event.type}: \${event.data.progress}%\`]);
      if (event.type === 'done') close();
    },
  });

  return (
    <section>
      <p>Stream: {status}{error ? ' (reconnecting)' : ''}</p>
      <progress max={100} value={lastEvent?.data.progress ?? 0} />
      <ol>{history.map((line, i) => <li key={i}>{line}</li>)}</ol>
    </section>
  );
}`,
        api: [
            {param: 'url', type: 'string | null', description: 'Stream URL. Pass null to stay disconnected; changing it opens a new stream.'},
            {param: 'options.events', type: 'string[]', description: 'Named events (the event: field) to listen for. Unnamed message events are always received.'},
            {param: 'options.withCredentials', type: 'boolean', description: 'Send cookies on cross-origin requests. Defaults to false.'},
            {param: 'options.parse', type: '(data: string) => T', description: 'Transform the raw payload of every event, for example JSON.parse.'},
            {param: 'options.onMessage', type: '(message: EventSourceMessage<T>) => void', description: 'Called for every received event with {type, data, id}.'},
            {param: 'options.onOpen', type: '(event: Event) => void', description: 'Called when the stream opens, including after an automatic reconnect.'},
            {param: 'options.onError', type: '(event: Event) => void', description: 'Called on errors. The browser retries on its own unless the server responded with a fatal status.'},
            {param: 'options.eventSourceClass', type: 'new (url: string, init?: EventSourceInit) => EventSourceLike', description: 'Constructor to use instead of the global EventSource, for tests, mocks or a polyfill that supports headers.'},
        ],
        returns: [
            {name: 'status', type: "'idle' | 'connecting' | 'open' | 'closed'", description: 'Stream state. After a network error it goes back to connecting while the browser retries.'},
            {name: 'lastEvent', type: '{type: string; data: T; id: string | null} | null', description: 'The most recent event. type is "message" for unnamed events.'},
            {name: 'error', type: 'Event | null', description: 'The last error event. Cleared when the stream opens again.'},
            {name: 'close', type: '() => void', description: 'Close the stream. The browser stops retrying.'},
            {name: 'reconnect', type: '() => void', description: 'Close the current stream and open a new one.'},
            {name: 'isSupported', type: 'boolean', description: 'False when EventSource is missing and no eventSourceClass was given.'},
        ],
    },
    usepolling: {
        name: 'usePolling',
        description: 'Call an async function on an interval without overlapping calls. It pauses while the tab is hidden and backs off after errors, so it suits status checks and dashboards that cannot use a push connection.',
        category: 'Realtime',
        level: 'advanced',
        since: '2.1.0',
        signature: 'usePolling<T>(fn: (signal: AbortSignal) => Promise<T>, options: PollingOptions<T>): PollingResult<T>',
        usage: `import {usePolling} from '@zenuilabs/react-hooks';

type Build = {id: string; state: 'queued' | 'running' | 'passed' | 'failed'};

export default function BuildStatus({buildId}: {buildId: string}) {
  const {data, error, isFetching, lastUpdated, errorCount, stop, pollNow} = usePolling<Build>(
    async (signal) => {
      const response = await fetch(\`/api/builds/\${buildId}\`, {signal});
      if (!response.ok) throw new Error(\`Request failed with \${response.status}\`);
      return response.json();
    },
    {
      interval: 3000,
      backoff: {factor: 2, max: 60000},
      onSuccess: (build) => {
        if (build.state === 'passed' || build.state === 'failed') stop();
      },
    }
  );

  return (
    <div>
      <p>Build {buildId}: {data?.state ?? 'loading'} {isFetching && '(checking)'}</p>
      {error ? <p>Retrying after {errorCount} failed attempts</p> : null}
      {lastUpdated && <small>Updated {new Date(lastUpdated).toLocaleTimeString()}</small>}
      <button onClick={() => pollNow()}>Check now</button>
    </div>
  );
}`,
        api: [
            {param: 'fn', type: '(signal: AbortSignal) => Promise<T>', description: 'The async call to repeat. The signal aborts when polling stops or the component unmounts. The latest function is always used.'},
            {param: 'options.interval', type: 'number', description: 'Milliseconds between the end of one call and the start of the next.'},
            {param: 'options.enabled', type: 'boolean', description: 'Poll while true. Changing it starts or stops polling. Defaults to true.'},
            {param: 'options.pauseWhenHidden', type: 'boolean', description: 'Skip polls while the tab is hidden and poll once as soon as it becomes visible. Defaults to true.'},
            {param: 'options.backoff', type: '{factor?: number; max?: number}', description: 'After n consecutive errors wait interval * factor^n, capped at max. factor defaults to 2 and max to 16 times the interval. Without it errors retry at the normal interval.'},
            {param: 'options.immediate', type: 'boolean', description: 'Poll as soon as polling starts instead of waiting one interval. Defaults to true.'},
            {param: 'options.onSuccess', type: '(data: T) => void', description: 'Called after each successful call.'},
            {param: 'options.onError', type: '(error: unknown) => void', description: 'Called after each failed call.'},
        ],
        returns: [
            {name: 'data', type: 'T | undefined', description: 'Result of the last successful call. Kept while later calls fail.'},
            {name: 'error', type: 'unknown', description: 'Error from the last call, or undefined after a success.'},
            {name: 'isPolling', type: 'boolean', description: 'True while polling is started, including while paused for a hidden tab.'},
            {name: 'isPaused', type: 'boolean', description: 'True while polling waits for the tab to become visible.'},
            {name: 'isFetching', type: 'boolean', description: 'True while a call is in flight.'},
            {name: 'lastUpdated', type: 'number | null', description: 'Timestamp of the last successful call.'},
            {name: 'errorCount', type: 'number', description: 'Consecutive failures. Resets to 0 on success.'},
            {name: 'nextDelay', type: 'number', description: 'Delay before the next scheduled call, including backoff.'},
            {name: 'start', type: '() => void', description: 'Start polling.'},
            {name: 'stop', type: '() => void', description: 'Stop polling and abort the call in flight.'},
            {name: 'pollNow', type: '() => Promise<T | undefined>', description: 'Poll right away and restart the interval. If a call is already running it returns that call instead of starting a second one. Works while stopped without restarting the loop.'},
        ],
    },
    useinfinitescroll: {
        name: 'useInfiniteScroll',
        description: 'Load the next page when a sentinel element at the end of a list scrolls into view. It never fires while a load is running, keeps loading while the sentinel stays visible, and stops after an error until you retry.',
        category: 'Async & Data',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useInfiniteScroll<T extends Element = HTMLElement>(options: InfiniteScrollOptions): InfiniteScrollResult<T>',
        usage: `import {useState} from 'react';
import {useInfiniteScroll} from '@zenuilabs/react-hooks';

type Post = {id: number; title: string};

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(Infinity);

  const {sentinelRef, isLoading, error, retry} = useInfiniteScroll<HTMLDivElement>({
    hasMore: posts.length < total,
    loadMore: async () => {
      const response = await fetch(\`https://dummyjson.com/posts?limit=10&skip=\${posts.length}\`);
      if (!response.ok) throw new Error('Could not load posts');
      const page = await response.json();
      setPosts((prev) => [...prev, ...page.posts]);
      setTotal(page.total);
    },
  });

  return (
    <main>
      {posts.map((post) => <article key={post.id}><h2>{post.title}</h2></article>)}
      <div ref={sentinelRef}>
        {error ? <button onClick={retry}>Try again</button> : isLoading ? 'Loading...' : null}
      </div>
    </main>
  );
}`,
        api: [
            {param: 'options.loadMore', type: '() => Promise<unknown> | void', description: 'Load and append the next page. Return a promise so the hook knows when loading ends; a rejection sets error.'},
            {param: 'options.hasMore', type: 'boolean', description: 'Whether more pages exist. The observer disconnects when false.'},
            {param: 'options.rootMargin', type: 'string', description: 'How far outside the root the sentinel counts as visible, so the next page loads early. Defaults to "200px".'},
            {param: 'options.root', type: 'Element | null | RefObject<Element | null>', description: 'Scroll container to observe against. Defaults to the viewport.'},
            {param: 'options.disabled', type: 'boolean', description: 'Pause loading without removing the sentinel. Defaults to false.'},
        ],
        returns: [
            {name: 'sentinelRef', type: '(node: T | null) => void', description: 'Callback ref for an element placed after the last item.'},
            {name: 'isLoading', type: 'boolean', description: 'True while loadMore is running.'},
            {name: 'error', type: 'unknown', description: 'Error from the last loadMore. Automatic loading stops until retry is called.'},
            {name: 'retry', type: '() => void', description: 'Clear the error and load again. Also works as a manual "Load more" button.'},
            {name: 'isSupported', type: 'boolean', description: 'False when IntersectionObserver is missing. Fall back to a button that calls retry.'},
        ],
    },
    usecountdown: {
        name: 'useCountdown',
        description: 'Count down to a date or through a duration and expose days, hours, minutes and seconds. Time left is computed from the clock rather than by counting ticks, so it does not drift in background tabs. When the target is a Date, the first render depends on the current time, so render it on the client only to avoid a hydration mismatch.',
        category: 'Time & Motion',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useCountdown(target: Date | number, options?: CountdownOptions): CountdownResult',
        usage: `import {useCountdown} from '@zenuilabs/react-hooks';

const pad = (n: number) => String(n).padStart(2, '0');

export default function QuizTimer({onTimeUp}: {onTimeUp: () => void}) {
  const {minutes, seconds, progress, isRunning, isComplete, pause, resume, reset} = useCountdown(
    5 * 60 * 1000,
    {onComplete: onTimeUp}
  );

  if (isComplete) {
    return (
      <div>
        <p>Time is up.</p>
        <button onClick={() => reset()}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <p style={{fontFamily: 'monospace', fontSize: 32}}>{pad(minutes)}:{pad(seconds)}</p>
      <progress max={1} value={progress} />
      <button onClick={isRunning ? pause : resume}>{isRunning ? 'Pause' : 'Resume'}</button>
    </div>
  );
}`,
        api: [
            {param: 'target', type: 'Date | number', description: 'A Date counts down to that moment. A number is a duration in milliseconds (multiply seconds by 1000). Changing it resets the countdown.'},
            {param: 'options.interval', type: 'number', description: 'Update interval in milliseconds. Updates are aligned to boundaries of the remaining time so the seconds flip on time. Defaults to 1000.'},
            {param: 'options.autoStart', type: 'boolean', description: 'Start on mount. Defaults to true.'},
            {param: 'options.onComplete', type: '() => void', description: 'Called once when the countdown reaches zero.'},
        ],
        returns: [
            {name: 'remaining', type: 'number', description: 'Milliseconds left.'},
            {name: 'days', type: 'number', description: 'Whole days left.'},
            {name: 'hours', type: 'number', description: 'Hours left within the current day, 0 to 23.'},
            {name: 'minutes', type: 'number', description: 'Minutes within the hour, 0 to 59.'},
            {name: 'seconds', type: 'number', description: 'Seconds within the minute, 0 to 59.'},
            {name: 'progress', type: 'number', description: 'Fraction of the duration that has elapsed, from 0 to 1.'},
            {name: 'isRunning', type: 'boolean', description: 'True while counting.'},
            {name: 'isComplete', type: 'boolean', description: 'True once remaining reaches 0.'},
            {name: 'start', type: '() => void', description: 'Start counting. Restarts from the full duration when complete.'},
            {name: 'pause', type: '() => void', description: 'Freeze the remaining time.'},
            {name: 'resume', type: '() => void', description: 'Continue from the paused time. For a Date target this moves the end time later by the paused duration.'},
            {name: 'reset', type: '(target?: Date | number) => void', description: 'Stop and restore the full duration, or switch to a new target. Call start to begin again.'},
        ],
    },
    usestopwatch: {
        name: 'useStopwatch',
        description: 'A stopwatch with start, pause, reset and laps. Elapsed time comes from a monotonic clock, so the display can update at any rate and never loses time.',
        category: 'Time & Motion',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useStopwatch(options?: StopwatchOptions): StopwatchResult',
        usage: `import {useStopwatch} from '@zenuilabs/react-hooks';

function format(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(2).padStart(5, '0');
  return \`\${minutes}:\${seconds}\`;
}

export default function LapTimer() {
  const {elapsed, laps, isRunning, toggle, reset, lap} = useStopwatch();

  return (
    <div>
      <p style={{fontFamily: 'monospace', fontSize: 40}}>{format(elapsed)}</p>
      <button onClick={toggle}>{isRunning ? 'Pause' : 'Start'}</button>
      <button onClick={lap} disabled={!isRunning}>Lap</button>
      <button onClick={reset}>Reset</button>
      <ol>
        {laps.map((l) => (
          <li key={l.index}>
            Lap {l.index}: {format(l.split)} (total {format(l.total)})
          </li>
        ))}
      </ol>
    </div>
  );
}`,
        api: [
            {param: 'options.autoStart', type: 'boolean', description: 'Start on mount. Defaults to false.'},
            {param: 'options.interval', type: 'number', description: 'Milliseconds between display updates. Defaults to every animation frame; pass 1000 if you only show seconds.'},
        ],
        returns: [
            {name: 'elapsed', type: 'number', description: 'Elapsed milliseconds, excluding paused time.'},
            {name: 'laps', type: '{index: number; split: number; total: number}[]', description: 'Recorded laps, oldest first. split is the lap duration and total the elapsed time at the lap.'},
            {name: 'isRunning', type: 'boolean', description: 'True while timing.'},
            {name: 'start', type: '() => void', description: 'Start or resume.'},
            {name: 'pause', type: '() => void', description: 'Pause and keep the elapsed time.'},
            {name: 'toggle', type: '() => void', description: 'Start when paused, pause when running.'},
            {name: 'reset', type: '() => void', description: 'Stop, zero the clock and clear laps.'},
            {name: 'lap', type: '() => StopwatchLap | null', description: 'Record a lap at the current time and return it, or null when no time has passed since the last lap.'},
            {name: 'getElapsed', type: '() => number', description: 'Read the exact elapsed time now, between display updates.'},
        ],
    },
    usetimeago: {
        name: 'useTimeAgo',
        description: 'Format a date as relative time, such as "3 minutes ago" or "in 2 days", and keep it up to date. It uses Intl.RelativeTimeFormat and schedules each update for the moment the text changes. The text depends on the current time, so a server render can differ from the client; add suppressHydrationWarning to the element or render it on the client only.',
        category: 'Time & Motion',
        level: 'basic',
        since: '2.1.0',
        signature: 'useTimeAgo(date: Date | number | string, options?: TimeAgoOptions): TimeAgoResult',
        usage: `import {useTimeAgo} from '@zenuilabs/react-hooks';

type Comment = {id: string; author: string; body: string; createdAt: string};

function CommentTime({iso}: {iso: string}) {
  const {text} = useTimeAgo(iso);
  return (
    <time dateTime={iso} title={new Date(iso).toLocaleString()} suppressHydrationWarning>
      {text}
    </time>
  );
}

export default function Comments({comments}: {comments: Comment[]}) {
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <strong>{comment.author}</strong> <CommentTime iso={comment.createdAt} />
          <p>{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}`,
        api: [
            {param: 'date', type: 'Date | number | string', description: 'The moment to describe: a Date, a timestamp in milliseconds, or a string Date can parse. Past and future both work.'},
            {param: 'options.locale', type: 'string | string[]', description: 'Locale for Intl.RelativeTimeFormat. Defaults to the runtime locale.'},
            {param: 'options.updateInterval', type: 'number', description: 'Fixed refresh interval in milliseconds. By default updates are scheduled for the exact moment the text changes: every second under a minute, every minute under an hour, and so on.'},
            {param: 'options.numeric', type: "'always' | 'auto'", description: 'auto allows phrases like "yesterday" and "now"; always keeps numbers ("1 day ago"). Defaults to auto.'},
            {param: 'options.style', type: "'long' | 'short' | 'narrow'", description: 'Length of the unit names. Defaults to long.'},
        ],
        returns: [
            {name: 'text', type: 'string', description: 'The formatted relative time. Empty for an invalid date.'},
            {name: 'value', type: 'number', description: 'Signed whole amount in unit: negative in the past, positive in the future.'},
            {name: 'unit', type: "'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'", description: 'The unit used for text.'},
            {name: 'isFuture', type: 'boolean', description: 'True when the date is in the future.'},
        ],
    },
    useanimationframe: {
        name: 'useAnimationFrame',
        description: 'Run a callback on every animation frame with the time since the previous frame. Use it for canvas drawing, games and imperative animations where movement should be scaled by elapsed time.',
        category: 'Time & Motion',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useAnimationFrame(callback: (info: AnimationFrameInfo) => void, options?: AnimationFrameOptions): AnimationFrameResult',
        usage: `import {useRef, useState} from 'react';
import {useAnimationFrame} from '@zenuilabs/react-hooks';

export default function Orbit() {
  const dot = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [speed, setSpeed] = useState(90); // degrees per second

  const {isRunning, start, stop} = useAnimationFrame(({delta}) => {
    angle.current = (angle.current + (speed * delta) / 1000) % 360;
    if (dot.current) {
      dot.current.style.transform = \`rotate(\${angle.current}deg) translateX(80px)\`;
    }
  });

  return (
    <div>
      <div style={{position: 'relative', width: 200, height: 200}}>
        <div ref={dot} style={{position: 'absolute', left: 92, top: 92, width: 16, height: 16, borderRadius: 8, background: 'teal'}} />
      </div>
      <input type="range" min={10} max={720} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
      <button onClick={isRunning ? stop : start}>{isRunning ? 'Stop' : 'Start'}</button>
    </div>
  );
}`,
        api: [
            {param: 'callback', type: '(info: {time: number; delta: number; frame: number; elapsed: number}) => void', description: 'Called every frame. delta is milliseconds since the previous frame (0 on the first), frame counts from 0 and elapsed is time since the loop started. The latest callback is used without restarting the loop.'},
            {param: 'options.enabled', type: 'boolean', description: 'Run the loop. Changing it starts or stops the loop. Defaults to true.'},
        ],
        returns: [
            {name: 'start', type: '() => void', description: 'Start the loop. frame and elapsed restart from 0.'},
            {name: 'stop', type: '() => void', description: 'Cancel the pending frame and stop.'},
            {name: 'isRunning', type: 'boolean', description: 'True while the loop runs.'},
        ],
    },
    usespringvalue: {
        name: 'useSpringValue',
        description: 'Animate a number toward a target with spring physics. Use it for positions, sizes and counters that should settle naturally and stay smooth when the target changes mid-animation. It jumps straight to the target when the user prefers reduced motion.',
        category: 'Time & Motion',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useSpringValue(target: number, options?: SpringValueOptions): SpringValueResult',
        usage: `import {useState} from 'react';
import {useSpringValue} from '@zenuilabs/react-hooks';

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const {value, isAnimating} = useSpringValue(open ? 0 : -320, {stiffness: 260, damping: 24});

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Open'} menu</button>
      <nav
        aria-hidden={!open && !isAnimating}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 320,
          background: 'white',
          boxShadow: '0 0 24px rgba(0,0,0,0.15)',
          transform: \`translateX(\${value}px)\`,
        }}
      >
        <a href="/">Home</a>
        <a href="/settings">Settings</a>
      </nav>
    </div>
  );
}`,
        api: [
            {param: 'target', type: 'number', description: 'Value to animate toward. Changing it mid-animation keeps the current velocity.'},
            {param: 'options.stiffness', type: 'number', description: 'Spring strength. Higher is snappier. Defaults to 170.'},
            {param: 'options.damping', type: 'number', description: 'Friction. Lower values overshoot and wobble. Defaults to 26.'},
            {param: 'options.mass', type: 'number', description: 'Mass of the moving object. Heavier is slower to start and stop. Defaults to 1.'},
            {param: 'options.precision', type: 'number', description: 'The spring rests when both distance and speed fall below this. Defaults to 0.01.'},
            {param: 'options.respectReducedMotion', type: 'boolean', description: 'Jump to the target when prefers-reduced-motion is set. Defaults to true.'},
            {param: 'options.onRest', type: '(value: number) => void', description: 'Called when the spring comes to rest.'},
        ],
        returns: [
            {name: 'value', type: 'number', description: 'The current animated value.'},
            {name: 'velocity', type: 'number', description: 'Current speed in units per second.'},
            {name: 'isAnimating', type: 'boolean', description: 'True while the spring is moving.'},
            {name: 'set', type: '(value: number, immediate?: boolean) => void', description: 'Animate to a value, or jump there with immediate. The target argument takes over again the next time it changes.'},
            {name: 'isReducedMotion', type: 'boolean', description: 'True when animation is skipped because of prefers-reduced-motion.'},
        ],
    },
    useworker: {
        name: 'useWorker',
        description: 'Run a pure function in a Web Worker so heavy computation does not freeze the page. The function is sent as source text, so it must be self-contained: no closures, imports or variables from outside its body, and its arguments and result must be structured-cloneable.',
        category: 'Performance',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useWorker<Args extends unknown[], R>(fn: (...args: Args) => R | Promise<R>, options?: WorkerOptions): WorkerResult<Args, Awaited<R>>',
        usage: `import {useState} from 'react';
import {useWorker} from '@zenuilabs/react-hooks';

// Everything the worker needs lives inside the function.
function countPrimes(limit: number) {
  const sieve = new Uint8Array(limit + 1);
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) continue;
    count++;
    for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
  }
  return count;
}

export default function PrimeCounter() {
  const [limit, setLimit] = useState(50_000_000);
  const {run, status, result, error, terminate} = useWorker(countPrimes, {timeout: 20000});

  return (
    <div>
      <input type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
      <button onClick={() => run(limit).catch(() => {})} disabled={status === 'running'}>Count primes</button>
      {status === 'running' && <button onClick={terminate}>Cancel</button>}
      <p>Status: {status}</p>
      {result !== undefined && <p>{result.toLocaleString()} primes up to {limit.toLocaleString()}</p>}
      {error && <p>{error.message}</p>}
    </div>
  );
}`,
        api: [
            {param: 'fn', type: '(...args: Args) => R | Promise<R>', description: 'A self-contained function, serialized with toString(). Use a function declaration or arrow function; it can be async and can call itself by name. Changing its source starts a new worker.'},
            {param: 'options.timeout', type: 'number', description: 'Terminate the worker and reject with a TimeoutError when a run takes longer than this many milliseconds. Other queued runs are aborted with it.'},
        ],
        returns: [
            {name: 'run', type: '(...args: Args) => Promise<Awaited<R>>', description: 'Run fn in the worker. The worker is created on first use and reused. Resolves with the result; rejects on errors, timeout, terminate or unmount.'},
            {name: 'status', type: "'idle' | 'running' | 'success' | 'error' | 'timeout'", description: 'Status of the most recent run.'},
            {name: 'result', type: 'R | undefined', description: 'Result of the most recent successful run.'},
            {name: 'error', type: 'Error | null', description: 'Error from the most recent failed run, with the name and message thrown inside the worker.'},
            {name: 'terminate', type: '() => void', description: 'Kill the worker, reject pending runs with an AbortError and reset status to idle. The blob URL is revoked; the next run creates a fresh worker.'},
            {name: 'isSupported', type: 'boolean', description: 'False when Web Workers or blob URLs are unavailable.'},
        ],
    },
};
