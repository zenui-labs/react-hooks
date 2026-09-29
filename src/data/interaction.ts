import type {HookDoc} from "@/types";

export const interactionHooks: Record<string, HookDoc> = {
    useresizeobserver: {
        name: 'useResizeObserver',
        description: 'Track the size of an element with ResizeObserver, batched to one update per animation frame. Use it for layouts that react to their own container instead of the window.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useResizeObserver<T extends Element = HTMLElement>(options?: ResizeObserverHookOptions): ResizeObserverHookResult<T>',
        usage: `import {useResizeObserver} from '@zenuilabs/react-hooks';

const CARD_MIN_WIDTH = 180;

export default function App() {
  const {ref, width} = useResizeObserver<HTMLDivElement>();
  const columns = Math.max(1, Math.floor(width / CARD_MIN_WIDTH));

  return (
    <div ref={ref} style={{resize: 'horizontal', overflow: 'auto', border: '1px solid #ccc', padding: 12}}>
      <p>{Math.round(width)}px wide, {columns} columns</p>
      <div style={{display: 'grid', gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: 8}}>
        {['Inbox', 'Drafts', 'Sent', 'Archive'].map((label) => (
          <div key={label} style={{padding: 16, background: '#f2f2f2'}}>{label}</div>
        ))}
      </div>
    </div>
  );
}`,
        api: [
            {
                param: 'options.box',
                type: "'content-box' | 'border-box' | 'device-pixel-content-box'",
                description: "Which box to measure. Defaults to 'content-box'. Browsers without device pixel support fall back to the content box.",
            },
        ],
        returns: [
            {
                name: 'ref',
                type: '(node: T | null) => void',
                description: 'Callback ref. Attach it to the element to measure. Mounting late or swapping the element re-observes.',
            },
            {name: 'width', type: 'number', description: 'Width of the chosen box in pixels. 0 before the first measurement.'},
            {name: 'height', type: 'number', description: 'Height of the chosen box in pixels. 0 before the first measurement.'},
            {name: 'entry', type: 'ResizeObserverEntry | null', description: 'The latest raw entry, for reading other box sizes.'},
            {name: 'isSupported', type: 'boolean', description: 'False when ResizeObserver is missing. Always false during server rendering.'},
        ],
    },
    usemutationobserver: {
        name: 'useMutationObserver',
        description: 'Watch a DOM node for added or removed children, attribute changes and text edits. Use it to react to DOM that other code controls, such as third-party widgets or contenteditable regions.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useMutationObserver<T extends Node = Node>(target: MutationObserverTarget<T>, callback: MutationCallback, options?: MutationObserverInit): MutationObserverHookResult',
        usage: `import {useRef, useState} from 'react';
import {useMutationObserver} from '@zenuilabs/react-hooks';

export default function App() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState(0);
  const [edits, setEdits] = useState(0);

  useMutationObserver(editorRef, (records) => {
    setEdits((count) => count + records.length);
    setWords((editorRef.current?.innerText.trim().split(/\\s+/).filter(Boolean).length) ?? 0);
  }, {childList: true, subtree: true, characterData: true});

  return (
    <div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{minHeight: 120, padding: 12, border: '1px solid #ccc'}}
      >
        Start typing here.
      </div>
      <p>{words} words, {edits} DOM changes</p>
    </div>
  );
}`,
        api: [
            {
                param: 'target',
                type: 'RefObject<T | null> | T | null',
                description: 'The node to watch. A ref is re-read after every render, so a node that mounts later is picked up.',
            },
            {
                param: 'callback',
                type: '(records: MutationRecord[], observer: MutationObserver) => void',
                description: 'Called with each batch of changes. The latest function is always used, so it does not need to be memoized.',
            },
            {
                param: 'options',
                type: 'MutationObserverInit',
                description: 'What to watch. Defaults to {childList: true, subtree: true}. Compared by value, so an inline object does not restart the observer.',
            },
        ],
        returns: [
            {name: 'isObserving', type: 'boolean', description: 'True while an observer is attached to a node.'},
            {name: 'takeRecords', type: '() => MutationRecord[]', description: 'Return and clear changes that have not been delivered to the callback yet.'},
        ],
    },
    usedraggable: {
        name: 'useDraggable',
        description: 'Drag an element with mouse, touch or pen, with axis locking, bounds and grid snapping. Arrow keys move the focused element, so dragging also works from the keyboard.',
        category: 'Interaction',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useDraggable<T extends HTMLElement = HTMLElement>(options?: DraggableOptions): DraggableResult<T>',
        usage: `import {useDraggable} from '@zenuilabs/react-hooks';

export default function App() {
  const {ref, position, isDragging, reset} = useDraggable<HTMLDivElement>({
    bounds: 'parent',
    grid: [20, 20],
    onDragEnd: (pos) => localStorage.setItem('note-position', JSON.stringify(pos)),
  });

  return (
    <div>
      <div style={{position: 'relative', height: 300, border: '1px dashed #999'}}>
        <div
          ref={ref}
          style={{
            width: 160,
            padding: 12,
            background: isDragging ? '#fff3b0' : '#fff9d6',
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: \`translate(\${position.x}px, \${position.y}px)\`,
          }}
        >
          Sticky note. Drag me, or focus me and use the arrow keys.
        </div>
      </div>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
        api: [
            {param: 'options.axis', type: "'x' | 'y' | 'both'", description: "Axis the element may move along. Defaults to 'both'."},
            {
                param: 'options.bounds',
                type: "'parent' | {left?, top?, right?, bottom?}",
                description: "'parent' keeps the element inside its parent's padding box. An object limits the position values directly. Unbounded by default.",
            },
            {param: 'options.grid', type: '[x: number, y: number]', description: 'Snap to multiples of these pixel steps. Keyboard moves use the same steps.'},
            {param: 'options.initial', type: '{x: number, y: number}', description: 'Starting position, read once on mount and used by reset. Defaults to {x: 0, y: 0}.'},
            {param: 'options.disabled', type: 'boolean', description: 'Ignore pointer and keyboard input while true.'},
            {param: 'options.handle', type: 'string', description: 'CSS selector. When set, a drag only starts from a matching descendant, such as a title bar.'},
            {param: 'options.onDragStart', type: '(position, event: PointerEvent) => void', description: 'Called when a pointer is pressed on the element.'},
            {param: 'options.onDrag', type: '(position, event) => void', description: 'Called each time the position changes, from a pointer or an arrow key.'},
            {param: 'options.onDragEnd', type: '(position, event) => void', description: 'Called on release, and after each keyboard move. A good place to persist the position.'},
        ],
        returns: [
            {name: 'ref', type: '(node: T | null) => void', description: 'Callback ref. The hook sets touch-action: none and, if needed, tabIndex={0} on the element.'},
            {name: 'position', type: '{x: number, y: number}', description: 'Offset from the element\'s layout position. Apply it with a CSS transform.'},
            {name: 'isDragging', type: 'boolean', description: 'True while a pointer drag is in progress.'},
            {name: 'setPosition', type: '(next | (prev) => next) => void', description: 'Move the element programmatically. The result is snapped and clamped like a drag.'},
            {name: 'reset', type: '() => void', description: 'Return to the initial position.'},
        ],
    },
    usevirtuallist: {
        name: 'useVirtualList',
        description: 'Render only the rows of a long list that are in view, with fixed or variable row heights. Use it when a list has thousands of items and scrolling starts to lag.',
        category: 'Performance',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useVirtualList<T>(items: readonly T[], options: VirtualListOptions): VirtualListResult<T>',
        usage: `import {useMemo} from 'react';
import {useVirtualList} from '@zenuilabs/react-hooks';

export default function App() {
  const orders = useMemo(
    () => Array.from({length: 50000}, (_, i) => ({id: 100000 + i, total: ((i * 37) % 900) + 10})),
    []
  );
  const {containerProps, innerProps, virtualItems, scrollToIndex} = useVirtualList(orders, {
    itemHeight: 36,
    containerHeight: 360,
  });

  return (
    <div>
      <button onClick={() => scrollToIndex(25000, 'center')}>Jump to order 125000</button>
      <div {...containerProps} style={{...containerProps.style, border: '1px solid #ccc'}}>
        <div {...innerProps}>
          {virtualItems.map(({index, item, start, size}) => (
            <div
              key={item.id}
              style={{position: 'absolute', top: 0, left: 0, right: 0, height: size, transform: \`translateY(\${start}px)\`}}
            >
              #{index + 1} order {item.id}: {item.total} USD
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
        api: [
            {param: 'items', type: 'readonly T[]', description: 'The full list. Only its length and the visible items are read.'},
            {
                param: 'options.itemHeight',
                type: 'number | (index: number) => number',
                description: 'Row height in pixels. A function allows variable heights; wrap it in useCallback, because a new function re-measures every row.',
            },
            {param: 'options.overscan', type: 'number', description: 'Extra rows rendered above and below the viewport to avoid blank edges while scrolling. Defaults to 4.'},
            {
                param: 'options.containerHeight',
                type: 'number',
                description: 'Viewport height in pixels, also applied to the container style. When omitted, the container is measured and you set its height with CSS.',
            },
        ],
        returns: [
            {name: 'containerProps', type: '{ref, onScroll, style}', description: 'Spread on the scrolling element. Merge extra styles after the returned style.'},
            {name: 'innerProps', type: '{style}', description: 'Spread on the only child of the container. It is as tall as the whole list.'},
            {
                name: 'virtualItems',
                type: '{index, item, start, size}[]',
                description: 'Rows to render. Position each absolutely: top 0 with translateY(start), and height size.',
            },
            {name: 'totalHeight', type: 'number', description: 'Height of all rows combined, in pixels.'},
            {
                name: 'scrollToIndex',
                type: "(index: number, align?: 'start' | 'center' | 'end' | 'auto') => void",
                description: "Scroll a row into view. 'auto', the default, scrolls only when the row is not fully visible.",
            },
        ],
    },
    usefocustrap: {
        name: 'useFocusTrap',
        description: 'Keep keyboard focus inside a container while it is active, and give focus back when it closes. Use it for modal dialogs, drawers and menus.',
        category: 'Interaction',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useFocusTrap<T extends HTMLElement = HTMLElement>(active: boolean, options?: FocusTrapOptions): (node: T | null) => void',
        usage: `import {useState} from 'react';
import {useFocusTrap} from '@zenuilabs/react-hooks';

export default function App() {
  const [open, setOpen] = useState(false);
  const trapRef = useFocusTrap<HTMLDivElement>(open, {onEscape: () => setOpen(false)});

  return (
    <div>
      <button onClick={() => setOpen(true)}>Delete project</button>
      {open && (
        <div
          ref={trapRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          style={{position: 'fixed', inset: '30% 30% auto', padding: 20, background: 'white', border: '1px solid #ccc'}}
        >
          <h2 id="confirm-title">Delete this project?</h2>
          <p>Type the project name to confirm.</p>
          <input placeholder="my-project"/>
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={() => setOpen(false)}>Delete</button>
        </div>
      )}
    </div>
  );
}`,
        api: [
            {param: 'active', type: 'boolean', description: 'Trap focus while true. Turning it false releases the trap and restores focus.'},
            {
                param: 'options.initialFocus',
                type: 'RefObject<HTMLElement | null> | string | false',
                description: 'Element to focus on activation, as a ref or CSS selector. Defaults to the first tabbable element. false focuses the container.',
            },
            {
                param: 'options.returnFocus',
                type: 'boolean',
                description: 'Focus the previously focused element on deactivation. Skipped if focus already moved elsewhere on purpose. Defaults to true.',
            },
            {
                param: 'options.escapeDeactivates',
                type: 'boolean',
                description: 'Release the trap immediately when Escape is pressed, before active turns false. Defaults to false.',
            },
            {param: 'options.onEscape', type: '(event: KeyboardEvent) => void', description: 'Called on Escape while the trap is active. Close the dialog here.'},
        ],
        returns: [
            {
                name: 'ref',
                type: '(node: T | null) => void',
                description: 'Callback ref for the container. Tab and Shift+Tab cycle through its tabbable elements. Nested traps pause the outer one.',
            },
        ],
    },
    usehotkeys: {
        name: 'useHotkeys',
        description: 'Bind keyboard shortcuts, including combos like mod+k, several bindings at once and sequences like g h. Keys typed into form fields are ignored unless you opt in.',
        category: 'Interaction',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useHotkeys(keys: string | string[], handler: HotkeysHandler, options?: HotkeysOptions): HotkeysResult',
        usage: `import {useState} from 'react';
import {useHotkeys} from '@zenuilabs/react-hooks';

const PAGES: Record<string, string> = {'g h': 'home', 'g i': 'inbox', 'g s': 'settings'};

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [page, setPage] = useState('home');

  useHotkeys('mod+k', () => setPaletteOpen((open) => !open));
  useHotkeys('escape', () => setPaletteOpen(false), {enableOnFormFields: true});
  const {sequence} = useHotkeys(Object.keys(PAGES), (_event, {hotkey}) => setPage(PAGES[hotkey]));

  return (
    <div>
      <p>Page: {page}</p>
      <p>Press Cmd+K or Ctrl+K for the palette. Press g, then h, i or s to navigate.</p>
      {sequence.length > 0 && <p>Waiting after: {sequence.join(' then ')}</p>}
      {paletteOpen && <input autoFocus placeholder="Search commands"/>}
    </div>
  );
}`,
        api: [
            {
                param: 'keys',
                type: 'string | string[]',
                description: "Bindings separated by commas. Join modifiers with '+' (mod, ctrl, meta, alt, shift) and sequence steps with spaces. Use 'comma' and 'plus' for those keys.",
            },
            {
                param: 'handler',
                type: '(event: KeyboardEvent, info: {hotkey: string}) => void',
                description: 'Called when a binding completes. info.hotkey is the binding as written. The latest function is always used.',
            },
            {param: 'options.enabled', type: 'boolean', description: 'Listen while true. Defaults to true.'},
            {param: 'options.preventDefault', type: 'boolean', description: 'Prevent the browser action for the key that completes a binding. Defaults to true.'},
            {
                param: 'options.enableOnFormFields',
                type: 'boolean',
                description: 'Also fire while typing in inputs, textareas, selects and contenteditable elements. Defaults to false.',
            },
            {param: 'options.target', type: 'RefObject<EventTarget | null> | EventTarget | null', description: 'Element to listen on. Defaults to window.'},
            {param: 'options.sequenceTimeout', type: 'number', description: 'Maximum pause between sequence steps, in milliseconds. Defaults to 1000.'},
        ],
        returns: [
            {
                name: 'sequence',
                type: 'string[]',
                description: "Steps typed so far of a sequence in progress, such as ['g']. Empty when no sequence is pending.",
            },
        ],
    },
    usescrollspy: {
        name: 'useScrollSpy',
        description: 'Return the id of the section currently in view, based on IntersectionObserver. Use it to highlight the active link in a table of contents or a sticky nav.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useScrollSpy(ids: string[], options?: ScrollSpyOptions): string | null',
        usage: `import {useScrollSpy} from '@zenuilabs/react-hooks';

const SECTIONS = [
  {id: 'overview', title: 'Overview'},
  {id: 'install', title: 'Install'},
  {id: 'configure', title: 'Configure'},
  {id: 'deploy', title: 'Deploy'},
];

export default function App() {
  const active = useScrollSpy(SECTIONS.map((s) => s.id), {offset: 64});

  return (
    <div style={{display: 'flex', gap: 32}}>
      <nav style={{position: 'sticky', top: 64, alignSelf: 'flex-start'}}>
        {SECTIONS.map((s) => (
          <a key={s.id} href={\`#\${s.id}\`} style={{display: 'block', fontWeight: active === s.id ? 700 : 400}}>
            {s.title}
          </a>
        ))}
      </nav>
      <main>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} style={{minHeight: '80vh'}}>
            <h2>{s.title}</h2>
          </section>
        ))}
      </main>
    </div>
  );
}`,
        api: [
            {param: 'ids', type: 'string[]', description: 'Element ids of the sections. The elements must be in the document when the list changes.'},
            {
                param: 'options.root',
                type: 'RefObject<Element | null> | Element | null',
                description: 'Scrolling container that holds the sections. Defaults to the viewport.',
            },
            {param: 'options.offset', type: 'number', description: 'Pixels at the top of the root to ignore, such as a sticky header. Defaults to 0.'},
            {param: 'options.rootMargin', type: 'string', description: 'Raw IntersectionObserver margin. Overrides the margin derived from offset.'},
        ],
        returns: [
            {
                name: 'activeId',
                type: 'string | null',
                description: 'The topmost visible section, or the last one when scrolled to the end. Keeps its value between sections. null until a section is seen.',
            },
        ],
    },
    usetextselection: {
        name: 'useTextSelection',
        description: 'Track the text the user has selected and where it is on screen, optionally limited to one container. Use it for quote, share or highlight toolbars.',
        category: 'Events & DOM',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useTextSelection(target?: RefObject<Element | null> | Element | null): TextSelectionResult',
        usage: `import {useRef} from 'react';
import {useTextSelection} from '@zenuilabs/react-hooks';

export default function App() {
  const articleRef = useRef<HTMLElement>(null);
  const {text, rect, clear} = useTextSelection(articleRef);

  const quote = () => {
    navigator.clipboard.writeText(\`> \${text}\`);
    clear();
  };

  return (
    <>
      <article ref={articleRef} style={{maxWidth: 560, lineHeight: 1.6}}>
        <p>Select any sentence in this paragraph to quote it. The toolbar follows the selection as the page scrolls.</p>
      </article>
      {rect && (
        <button
          onMouseDown={(event) => event.preventDefault()}
          onClick={quote}
          style={{position: 'fixed', top: rect.top - 40, left: rect.left + rect.width / 2, transform: 'translateX(-50%)'}}
        >
          Quote {text.length} characters
        </button>
      )}
    </>
  );
}`,
        api: [
            {
                param: 'target',
                type: 'RefObject<Element | null> | Element | null',
                description: 'Container to limit the selection to. A selection that runs past its edges is clipped to it. Omit it to track the whole document.',
            },
        ],
        returns: [
            {name: 'text', type: 'string', description: 'The selected text. Empty when nothing is selected.'},
            {
                name: 'rect',
                type: 'DOMRect | null',
                description: 'Bounding box of the selection in viewport coordinates. Updated on scroll and resize. null when nothing is selected.',
            },
            {name: 'isCollapsed', type: 'boolean', description: 'True when there is no selected text, only a caret or nothing.'},
            {name: 'clear', type: '() => void', description: 'Remove the current selection.'},
        ],
    },
    useswipe: {
        name: 'useSwipe',
        description: 'Detect swipe gestures from mouse, touch or pen, with live offsets while the pointer moves. Use it for swipe-to-dismiss cards, carousels and mobile navigation.',
        category: 'Interaction',
        level: 'intermediate',
        since: '2.1.0',
        signature: 'useSwipe<T extends HTMLElement = HTMLElement>(options?: SwipeOptions): SwipeResult<T>',
        usage: `import {useState} from 'react';
import {useSwipe} from '@zenuilabs/react-hooks';

const PHOTOS = ['Harbor at dawn', 'Pine forest', 'Desert road', 'City lights'];

export default function App() {
  const [index, setIndex] = useState(0);
  const {ref, deltaX, isSwiping} = useSwipe<HTMLDivElement>({
    axis: 'x',
    onSwipeLeft: () => setIndex((i) => Math.min(PHOTOS.length - 1, i + 1)),
    onSwipeRight: () => setIndex((i) => Math.max(0, i - 1)),
  });

  return (
    <div
      ref={ref}
      style={{
        height: 200,
        display: 'grid',
        placeItems: 'center',
        background: '#eef',
        transform: \`translateX(\${deltaX}px)\`,
        transition: isSwiping ? 'none' : 'transform 200ms',
        userSelect: 'none',
      }}
    >
      {index + 1} / {PHOTOS.length}: {PHOTOS[index]}
    </div>
  );
}`,
        api: [
            {param: 'options.threshold', type: 'number', description: 'Minimum distance in pixels for a swipe. Defaults to 50.'},
            {
                param: 'options.velocityThreshold',
                type: 'number',
                description: 'A quick flick counts as a swipe below the threshold when its release speed reaches this many pixels per millisecond. Defaults to 0.5.',
            },
            {
                param: 'options.axis',
                type: "'x' | 'y' | 'both'",
                description: "Directions to detect. 'x' keeps vertical page scrolling on touch screens, 'y' keeps horizontal scrolling. Defaults to 'both'.",
            },
            {
                param: 'options.onSwipe',
                type: '(swipe: SwipeEvent) => void',
                description: 'Called for every swipe with direction, deltaX, deltaY, distance, velocity and duration.',
            },
            {param: 'options.onSwipeLeft / Right / Up / Down', type: '(swipe: SwipeEvent) => void', description: 'Called for a swipe in that direction.'},
        ],
        returns: [
            {name: 'ref', type: '(node: T | null) => void', description: 'Callback ref for the swipe surface. The hook sets touch-action to match the axis.'},
            {name: 'direction', type: "'left' | 'right' | 'up' | 'down' | null", description: 'Direction of the most recent swipe. null before the first one.'},
            {name: 'isSwiping', type: 'boolean', description: 'True while a pointer is pressed on the element.'},
            {name: 'deltaX', type: 'number', description: 'Live horizontal offset from the press point. Resets to 0 on release.'},
            {name: 'deltaY', type: 'number', description: 'Live vertical offset from the press point. Resets to 0 on release.'},
        ],
    },
    userovingfocus: {
        name: 'useRovingFocus',
        description: 'Give a group of controls a single Tab stop and move between them with the arrow keys, Home and End. Use it for toolbars, menus, listboxes and grids, as the ARIA patterns expect.',
        category: 'Interaction',
        level: 'advanced',
        since: '2.1.0',
        signature: 'useRovingFocus<T extends HTMLElement = HTMLElement>(options: RovingFocusOptions): RovingFocusResult<T>',
        usage: `import {useState} from 'react';
import {useRovingFocus} from '@zenuilabs/react-hooks';

const ALIGNMENTS = ['Left', 'Center', 'Right', 'Justify'];

export default function App() {
  const [align, setAlign] = useState('Left');
  const {getItemProps} = useRovingFocus<HTMLButtonElement>({
    count: ALIGNMENTS.length,
    orientation: 'horizontal',
  });

  return (
    <div role="toolbar" aria-label="Text alignment" aria-orientation="horizontal">
      {ALIGNMENTS.map((label, index) => (
        <button
          key={label}
          {...getItemProps(index)}
          aria-pressed={align === label}
          onClick={() => setAlign(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}`,
        api: [
            {param: 'options.count', type: 'number', description: 'Number of items.'},
            {
                param: 'options.orientation',
                type: "'horizontal' | 'vertical' | 'both'",
                description: "Which arrow keys move focus. Defaults to 'vertical'. Ignored when columns is set.",
            },
            {param: 'options.loop', type: 'boolean', description: 'Wrap from the last item to the first and back. Defaults to true.'},
            {param: 'options.columns', type: 'number', description: 'Treat items as a grid with this many columns. Left and Right move by one item, Up and Down by one row.'},
            {param: 'options.initialIndex', type: 'number', description: 'Item that owns the Tab stop on mount. Defaults to 0.'},
            {param: 'options.isDisabled', type: '(index: number) => boolean', description: 'Items for which this returns true are skipped by the keyboard.'},
            {param: 'options.onChange', type: '(index: number) => void', description: 'Called when the active item changes.'},
        ],
        returns: [
            {name: 'activeIndex', type: 'number', description: 'Index of the item that owns the Tab stop.'},
            {name: 'setActiveIndex', type: '(index: number) => void', description: 'Move the Tab stop without moving focus.'},
            {name: 'focusItem', type: '(index: number) => void', description: 'Move the Tab stop and focus that item.'},
            {
                name: 'getItemProps',
                type: '(index: number) => {tabIndex, ref, onKeyDown, onFocus}',
                description: 'Props to spread on each item. Clicking or tabbing to an item also makes it active.',
            },
        ],
    },
    usetextareaautosize: {
        name: 'useTextareaAutosize',
        description: 'Grow a textarea to fit its content between a minimum and maximum number of rows. Use it for comment boxes and chat inputs that should not scroll until they get long.',
        category: 'Interaction',
        level: 'basic',
        since: '2.1.0',
        signature: 'useTextareaAutosize(options?: TextareaAutosizeOptions): TextareaAutosizeResult',
        usage: `import {useState} from 'react';
import {useTextareaAutosize} from '@zenuilabs/react-hooks';

export default function App() {
  const [message, setMessage] = useState('');
  const {ref} = useTextareaAutosize({minRows: 1, maxRows: 6, value: message});

  const send = () => {
    console.log('send', message);
    setMessage('');
  };

  return (
    <div style={{display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: 480}}>
      <textarea
        ref={ref}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Write a message"
        style={{flex: 1, resize: 'none', padding: 8, lineHeight: '20px'}}
      />
      <button onClick={send} disabled={!message.trim()}>Send</button>
    </div>
  );
}`,
        api: [
            {param: 'options.minRows', type: 'number', description: 'Smallest height, in rows. Defaults to 1.'},
            {param: 'options.maxRows', type: 'number', description: 'Largest height, in rows. Past it the textarea scrolls. Defaults to no limit.'},
            {
                param: 'options.value',
                type: 'string',
                description: 'The controlled value. Pass it so programmatic changes, such as clearing after send, also resize. Typing is picked up either way.',
            },
        ],
        returns: [
            {
                name: 'ref',
                type: '(node: HTMLTextAreaElement | null) => void',
                description: 'Callback ref for the textarea. The hook sets its height and overflow inline. Set resize: none in your styles.',
            },
            {name: 'height', type: 'number', description: 'Current height in pixels. 0 before mount.'},
            {name: 'rows', type: 'number', description: 'Number of visible rows.'},
            {name: 'recalculate', type: '() => void', description: 'Measure again, for example after a class change that alters the font.'},
        ],
    },
};
