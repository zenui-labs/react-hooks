'use client'

import {useEffect, useState} from 'react';
import {useLocalStorage} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const KEY = 'zenui-demo-profile';

interface Profile {
    name: string;
    stars: number;
}

const INITIAL: Profile = {name: 'Ada', stars: 0};

function SecondInstance() {
    const {storedValue} = useLocalStorage<Profile>(KEY, INITIAL);
    return <Readout label="Second instance" value={`${storedValue.name} / ${storedValue.stars}`} live/>;
}

export default function UseLocalStorageDemo() {
    const {storedValue, setValue, remove} = useLocalStorage<Profile>(KEY, INITIAL);
    const [raw, setRaw] = useState<string | null>(null);

    // Show exactly what is in localStorage after every change.
    useEffect(() => {
        setRaw(window.localStorage.getItem(KEY));
    }, [storedValue]);

    const addTwoStars = () => {
        // Two functional updates in one tick. Both apply.
        setValue(prev => ({...prev, stars: prev.stars + 1}));
        setValue(prev => ({...prev, stars: prev.stars + 1}));
    };

    return (
        <Stage>
            <StageHeader
                title="Profile saved to localStorage"
                hint="Edit the name, then reload the page. Open this page in a second tab and changes appear there too."
            />
            <div className="space-y-4">
                <Field label="Display name">
                    <Input
                        value={storedValue.name}
                        onChange={e => setValue(prev => ({...prev, name: e.target.value}))}
                        placeholder="Type a name"
                    />
                </Field>
                <Row>
                    <Button onClick={addTwoStars}>Add 2 stars</Button>
                    <Button variant="secondary" onClick={remove}>Remove key</Button>
                </Row>
                <ReadoutGrid>
                    <Readout label="storedValue.name" value={storedValue.name || '(empty)'}/>
                    <Readout label="storedValue.stars" value={storedValue.stars} tone="accent"/>
                    <SecondInstance/>
                </ReadoutGrid>
                <Readout label={`localStorage["${KEY}"]`} value={raw ?? 'null'}/>
                <Note>Remove key deletes the entry and falls back to the initial value in every instance.</Note>
            </div>
        </Stage>
    );
}
