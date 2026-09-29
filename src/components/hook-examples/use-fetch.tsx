'use client'

import {useState} from 'react';
import {RefreshCw} from 'lucide-react';
import {useFetch} from '@zenuilabs/react-hooks';
import {Button, Led, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

interface Post {
    id: number;
    title: string;
    body: string;
}

const BASE = 'https://jsonplaceholder.typicode.com/posts';

export default function UseFetchDemo() {
    const [id, setId] = useState<number | 'missing'>(1);
    const url = id === 'missing' ? `${BASE}/0` : `${BASE}/${id}`;
    const {data, loading, error, refetch} = useFetch<Post>(url);

    return (
        <Stage>
            <StageHeader
                title="Load a post"
                hint="Pick a post. Clicking quickly aborts the previous request, so only the last one lands."
                live={loading}
            />
            <div className="space-y-4">
                <Row>
                    {[1, 2, 3, 4, 5].map(n => (
                        <Button key={n} size="sm" variant={id === n ? 'primary' : 'secondary'} onClick={() => setId(n)}>
                            Post {n}
                        </Button>
                    ))}
                    <Button size="sm" variant={id === 'missing' ? 'danger' : 'ghost'} onClick={() => setId('missing')}>
                        Missing post
                    </Button>
                    <Button size="sm" variant="ghost" onClick={refetch}><RefreshCw size={14}/> refetch()</Button>
                </Row>
                <div className="min-h-28 rounded-xl border border-line bg-paper/80 p-4">
                    {error ? (
                        <p className="text-sm text-danger">{error}</p>
                    ) : data ? (
                        <div className={loading ? 'opacity-50' : undefined}>
                            <p className="font-display font-semibold text-ink">{data.title}</p>
                            <p className="mt-2 text-sm text-ink-2">{data.body}</p>
                        </div>
                    ) : (
                        <Led on={loading} label="Loading"/>
                    )}
                </div>
                <ReadoutGrid>
                    <Readout label="loading" value={String(loading)} live={loading}/>
                    <Readout label="data.id" value={data ? data.id : 'null'} tone="accent"/>
                    <Readout label="error" value={error ?? 'null'} tone={error ? 'danger' : 'default'}/>
                </ReadoutGrid>
                <Note>Data from the previous request stays visible while the next one loads.</Note>
            </div>
        </Stage>
    );
}
