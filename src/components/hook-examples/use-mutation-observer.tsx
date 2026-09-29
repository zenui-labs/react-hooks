'use client'

import {useEffect, useRef, useState} from 'react';
import {useMutationObserver} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

type OptionKey = 'childList' | 'attributes' | 'characterData' | 'subtree';

const OPTION_KEYS: OptionKey[] = ['childList', 'attributes', 'characterData', 'subtree'];
const WORDS = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel'];

const CHIP_CLASS = 'inline-flex h-8 items-center rounded-lg border border-line-strong bg-paper px-3 font-mono text-xs text-ink outline-none data-[tone=hot]:border-accent data-[tone=hot]:bg-accent-soft focus:border-accent';

function describe(record: MutationRecord) {
    const target = record.target.nodeType === Node.TEXT_NODE
        ? '#text'
        : (record.target as Element).tagName.toLowerCase();
    if (record.type === 'childList') {
        return `childList on <${target}>: +${record.addedNodes.length} / -${record.removedNodes.length}`;
    }
    if (record.type === 'attributes') {
        return `attributes on <${target}>: ${record.attributeName}`;
    }
    return `characterData on ${target}: "${record.target.textContent?.slice(0, 24) ?? ''}"`;
}

export default function UseMutationObserverDemo() {
    // React renders nothing inside this box. Everything in it is changed with plain DOM calls.
    const boxRef = useRef<HTMLDivElement>(null);
    const counter = useRef(0);
    const [options, setOptions] = useState<Record<OptionKey, boolean>>({
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
    });
    const [total, setTotal] = useState(0);
    const [batches, setBatches] = useState(0);
    const [entries, setEntries] = useState<string[]>([]);

    const log = (lines: string[]) => setEntries((previous) => [...lines.reverse(), ...previous].slice(0, 30));

    const invalid = !options.childList && !options.attributes && !options.characterData;

    // A new object each render; the hook compares it by value, so the observer is only rebuilt on toggle.
    const {isObserving, takeRecords} = useMutationObserver(invalid ? null : boxRef, (records) => {
        setTotal((count) => count + records.length);
        setBatches((count) => count + 1);
        log(records.map(describe));
    }, {...options});

    const chips = () => Array.from(boxRef.current?.children ?? []) as HTMLElement[];

    const addChip = () => {
        const chip = document.createElement('span');
        chip.className = CHIP_CLASS;
        chip.textContent = WORDS[counter.current++ % WORDS.length];
        chip.contentEditable = 'true';
        chip.spellcheck = false;
        boxRef.current?.appendChild(chip);
    };

    useEffect(() => {
        if (chips().length === 0) {
            addChip();
            addChip();
            addChip();
        }
    }, []);

    const removeChip = () => chips().at(-1)?.remove();

    const toggleTone = () => {
        const list = chips();
        const chip = list[Math.floor(Math.random() * list.length)];
        if (chip) chip.dataset.tone = chip.dataset.tone === 'hot' ? '' : 'hot';
    };

    const editText = () => {
        const text = chips()[0]?.firstChild;
        if (text && text.nodeType === Node.TEXT_NODE) {
            (text as Text).data = WORDS[counter.current++ % WORDS.length];
        }
    };

    const takeNow = () => {
        addChip();
        const taken = takeRecords();
        log([`takeRecords() returned ${taken.length} record(s); the callback will not see them`]);
    };

    return (
        <Stage>
            <StageHeader
                title="Watch the DOM change"
                hint="The buttons edit the box with plain DOM calls, outside React. You can also click a chip and type."
                live={isObserving}
            />
            <div className="space-y-4">
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">options</span>
                    {OPTION_KEYS.map((key) => (
                        <Button
                            key={key}
                            size="sm"
                            variant={options[key] ? 'primary' : 'secondary'}
                            onClick={() => setOptions((previous) => ({...previous, [key]: !previous[key]}))}
                        >
                            {key}
                        </Button>
                    ))}
                </Row>
                <div ref={boxRef} className="flex min-h-20 flex-wrap content-start items-start gap-2 rounded-xl border border-line bg-paper/60 p-4"/>
                <Row>
                    <Button onClick={addChip}>Append node</Button>
                    <Button variant="secondary" onClick={removeChip}>Remove last</Button>
                    <Button variant="secondary" onClick={toggleTone}>Toggle attribute</Button>
                    <Button variant="secondary" onClick={editText}>Edit text node</Button>
                    <Button variant="ghost" onClick={takeNow}>Append, then takeRecords</Button>
                </Row>
                <ReadoutGrid cols={3}>
                    <Readout label="isObserving" value={String(isObserving)} live={isObserving}/>
                    <Readout label="Records seen" value={total} tone="accent"/>
                    <Readout label="Callback batches" value={batches}/>
                </ReadoutGrid>
                <Log entries={entries} empty="No mutations yet. Press a button."/>
                <Note>
                    {invalid
                        ? 'MutationObserver needs childList, attributes or characterData. The demo passes a null target until one is on.'
                        : 'Turn off subtree and text edits stop reporting: they happen inside a chip, not on the box itself.'}
                </Note>
            </div>
        </Stage>
    );
}
