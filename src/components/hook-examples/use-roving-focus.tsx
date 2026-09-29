'use client'

import {useState} from 'react';
import {AlignCenter, AlignLeft, AlignRight, Bold, Code, Italic, Link, Strikethrough, Underline} from 'lucide-react';
import {useRovingFocus} from '@zenuilabs/react-hooks';
import {Button, Kbd, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const TOOLS = [
    {id: 'bold', label: 'Bold', icon: Bold},
    {id: 'italic', label: 'Italic', icon: Italic},
    {id: 'underline', label: 'Underline', icon: Underline},
    {id: 'strike', label: 'Strikethrough', icon: Strikethrough},
    {id: 'link', label: 'Link (disabled)', icon: Link, disabled: true},
    {id: 'code', label: 'Code', icon: Code},
    {id: 'left', label: 'Align left', icon: AlignLeft},
    {id: 'center', label: 'Align center', icon: AlignCenter},
    {id: 'right', label: 'Align right', icon: AlignRight},
];

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const itemClass = (active: boolean) =>
    'relative flex items-center justify-center rounded-lg border outline-none transition-colors focus-visible:border-accent focus-visible:bg-accent-soft disabled:opacity-40 '
    + (active ? 'border-accent bg-accent-soft text-ink' : 'border-line-strong bg-panel text-ink-2 hover:text-ink');

export default function UseRovingFocusDemo() {
    const [loop, setLoop] = useState(true);
    const [formats, setFormats] = useState<string[]>(['bold']);
    const [align, setAlign] = useState('left');
    const [dialed, setDialed] = useState('');

    const toolbar = useRovingFocus<HTMLButtonElement>({
        count: TOOLS.length,
        orientation: 'horizontal',
        loop,
        isDisabled: (index) => Boolean(TOOLS[index].disabled),
    });

    const keypad = useRovingFocus<HTMLButtonElement>({count: KEYPAD.length, columns: 3, loop});

    const press = (id: string) => {
        if (id === 'left' || id === 'center' || id === 'right') setAlign(id);
        else setFormats((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));
    };

    const previewClass = [
        formats.includes('bold') && 'font-semibold',
        formats.includes('italic') && 'italic',
        formats.includes('underline') && 'underline',
        formats.includes('strike') && 'line-through',
        formats.includes('code') && 'font-mono',
        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left',
    ].filter(Boolean).join(' ');

    return (
        <Stage>
            <StageHeader
                title="One tab stop, arrow keys inside"
                hint={<>Tab into the toolbar, then use <Kbd>Left</Kbd> <Kbd>Right</Kbd> <Kbd>Home</Kbd> <Kbd>End</Kbd>. Tab again jumps straight to the keypad, which is a 3 column grid.</>}
            />
            <div className="space-y-5">
                <div>
                    <div role="toolbar" aria-label="Formatting" aria-orientation="horizontal" className="flex flex-wrap gap-1">
                        {TOOLS.map((tool, index) => {
                            const Icon = tool.icon;
                            const props = toolbar.getItemProps(index);
                            const on = formats.includes(tool.id) || align === tool.id;
                            return (
                                <div key={tool.id} className="flex flex-col items-center gap-1">
                                    <button
                                        type="button"
                                        {...props}
                                        aria-label={tool.label}
                                        aria-pressed={on}
                                        disabled={tool.disabled}
                                        onClick={() => press(tool.id)}
                                        className={itemClass(on) + ' size-10'}
                                    >
                                        <Icon className="size-4"/>
                                    </button>
                                    <span className={'font-mono text-[10px] ' + (props.tabIndex === 0 ? 'text-accent' : 'text-ink-3')}>
                                        {props.tabIndex}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <p className={'mt-3 rounded-xl border border-line bg-paper/70 p-4 text-ink ' + previewClass}>
                        The quick brown fox jumps over the lazy dog.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                    <div role="group" aria-label="Keypad" className="grid w-44 grid-cols-3 gap-1.5">
                        {KEYPAD.map((key, index) => (
                            <button
                                key={key}
                                type="button"
                                {...keypad.getItemProps(index)}
                                onClick={() => setDialed((value) => (value + key).slice(-12))}
                                className={itemClass(index === keypad.activeIndex) + ' h-11 font-mono text-base'}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Readout label="Dialed" value={dialed || 'nothing yet'}/>
                        <Row>
                            <Button size="sm" variant="secondary" onClick={() => setDialed('')}>Clear</Button>
                            <Button size="sm" variant={loop ? 'primary' : 'secondary'} onClick={() => setLoop((on) => !on)}>
                                loop: {String(loop)}
                            </Button>
                        </Row>
                    </div>
                </div>

                <ReadoutGrid cols={3}>
                    <Readout label="toolbar.activeIndex" value={`${toolbar.activeIndex} (${TOOLS[toolbar.activeIndex].label})`} tone="accent"/>
                    <Readout label="keypad.activeIndex" value={`${keypad.activeIndex} (${KEYPAD[keypad.activeIndex]})`} tone="accent"/>
                    <Readout label="Tab stops" value="2 for 21 buttons"/>
                </ReadoutGrid>
                <Note>
                    The numbers under the toolbar are each button&apos;s tabIndex. The Link button is disabled and skipped.
                    In the keypad, Up and Down move by a row and wrap within the column when loop is on.
                </Note>
            </div>
        </Stage>
    );
}
