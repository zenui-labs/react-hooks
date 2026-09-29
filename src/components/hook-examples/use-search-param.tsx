'use client'

import {useState} from 'react';
import {useSearchParam} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const KEY = 'fruit';
const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango', 'Peach', 'Pear'];

function SearchBox({replace}: { replace: boolean }) {
    const {value, setValue} = useSearchParam(KEY);
    return (
        <Field label={`?${KEY}=`}>
            <Input
                value={value ?? ''}
                placeholder="Type to filter"
                onChange={(e) => setValue(e.target.value || null, {replace})}
            />
        </Field>
    );
}

function Results() {
    const {value} = useSearchParam(KEY);
    const query = (value ?? '').toLowerCase();
    const matches = FRUITS.filter((fruit) => fruit.toLowerCase().includes(query));

    return (
        <ul className="flex min-h-10 flex-wrap gap-2">
            {matches.map((fruit) => (
                <li key={fruit} className="rounded-lg border border-line bg-paper px-2.5 py-1 text-sm text-ink">{fruit}</li>
            ))}
            {matches.length === 0 && <li className="text-sm text-ink-3">No matches</li>}
        </ul>
    );
}

export default function UseSearchParamDemo() {
    const [replace, setReplace] = useState(true);
    const {value, setValue} = useSearchParam(KEY);

    return (
        <Stage>
            <StageHeader
                title="Three components, one parameter"
                hint="The input, the list and the readout each call useSearchParam with the same key. Typing updates all of them and the address bar."
            />
            <div className="space-y-4">
                <SearchBox replace={replace}/>
                <Results/>
                <Row>
                    <Button size="sm" variant="secondary" onClick={() => setValue('an')}>Set &quot;an&quot;</Button>
                    <Button size="sm" variant="ghost" onClick={() => setValue(null)}>Remove parameter</Button>
                    <Button size="sm" variant="secondary" onClick={() => setReplace(!replace)}>replace: {String(replace)}</Button>
                </Row>
                <ReadoutGrid cols={2}>
                    <Readout label="value" value={value === null ? 'null' : `"${value}"`} tone={value === null ? 'default' : 'signal'}/>
                    <Readout label="history mode" value={replace ? 'replaceState' : 'pushState'}/>
                </ReadoutGrid>
                <Note>With replace off, every keystroke adds a history entry, so the back button walks through your typing.</Note>
            </div>
        </Stage>
    );
}
