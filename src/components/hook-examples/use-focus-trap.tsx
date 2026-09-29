'use client'

import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import {useFocusTrap} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Kbd, Log, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function describe(element: Element | null) {
    if (!element || element === document.body) return 'body';
    const tag = element.tagName.toLowerCase();
    const label = element.getAttribute('aria-label')
        || element.getAttribute('name')
        || element.textContent?.trim().slice(0, 24)
        || element.getAttribute('placeholder')
        || '';
    return label ? `${tag} "${label}"` : tag;
}

export default function UseFocusTrapDemo() {
    const [open, setOpen] = useState(false);
    const [escapeDeactivates, setEscapeDeactivates] = useState(true);
    const [returnFocus, setReturnFocus] = useState(true);
    const [focused, setFocused] = useState('body');
    const [entries, setEntries] = useState<string[]>([]);

    const log = (line: string) => setEntries((previous) => [line, ...previous].slice(0, 14));

    const trapRef = useFocusTrap<HTMLDivElement>(open, {
        initialFocus: '[name="workspace"]',
        returnFocus,
        escapeDeactivates,
        onEscape: () => {
            log('Escape pressed, onEscape closes the dialog');
            setOpen(false);
        },
    });

    // Show where focus is, so Tab and Shift+Tab are visible.
    useEffect(() => {
        const update = () => {
            const name = describe(document.activeElement);
            setFocused(name);
            log(`focus: ${name}`);
        };
        document.addEventListener('focusin', update);
        return () => document.removeEventListener('focusin', update);
    }, []);

    return (
        <Stage>
            <StageHeader
                title="Tab around a dialog"
                hint={<>Open the dialog, then press <Kbd>Tab</Kbd> and <Kbd>Shift</Kbd> <Kbd>Tab</Kbd>. Focus cycles inside it and never reaches the buttons behind. <Kbd>Esc</Kbd> closes it.</>}
                live={open}
            />
            <div className="space-y-4">
                <div className="relative min-h-80 overflow-hidden rounded-xl border border-line bg-paper/60 p-4">
                    <Row>
                        <Button onClick={() => setOpen(true)}>Rename workspace</Button>
                        <Button variant="secondary">Behind the dialog</Button>
                        <Button variant="ghost">Also behind</Button>
                    </Row>
                    <p className="mt-4 max-w-sm text-sm text-ink-3">
                        These buttons stay in the tab order of the page. While the trap is active, Tab skips them.
                    </p>

                    {open && (
                        <div className="absolute inset-0 flex items-center justify-center bg-paper/80 p-4">
                            <div
                                ref={trapRef}
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="trap-demo-title"
                                className="w-full max-w-sm space-y-3 rounded-xl border border-line-strong bg-panel p-4 shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 id="trap-demo-title" className="font-display text-base font-semibold text-ink">Rename workspace</h4>
                                    <Button size="sm" variant="ghost" aria-label="Close" onClick={() => setOpen(false)}>
                                        <X className="size-4"/>
                                    </Button>
                                </div>
                                <Field label="Name">
                                    <Input name="workspace" defaultValue="Design team"/>
                                </Field>
                                <Field label="Slug">
                                    <Input name="slug" defaultValue="design-team"/>
                                </Field>
                                <div className="flex justify-end gap-2">
                                    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button onClick={() => setOpen(false)}>Save</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Row>
                    <Button size="sm" variant={escapeDeactivates ? 'primary' : 'secondary'} onClick={() => setEscapeDeactivates((on) => !on)}>
                        escapeDeactivates: {String(escapeDeactivates)}
                    </Button>
                    <Button size="sm" variant={returnFocus ? 'primary' : 'secondary'} onClick={() => setReturnFocus((on) => !on)}>
                        returnFocus: {String(returnFocus)}
                    </Button>
                </Row>
                <ReadoutGrid cols={2}>
                    <Readout label="active" value={String(open)} live={open}/>
                    <Readout label="Focused element" value={focused} tone="accent"/>
                </ReadoutGrid>
                <Log entries={entries} empty="Focus changes show up here."/>
            </div>
        </Stage>
    );
}
