'use client'

import {useSet} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const TAGS = ['react', 'typescript', 'css', 'testing', 'node', 'design'] as const;
type Tag = (typeof TAGS)[number];

const POSTS: { title: string; tags: Tag[] }[] = [
    {title: 'Typing custom hooks', tags: ['react', 'typescript']},
    {title: 'Container queries in practice', tags: ['css', 'design']},
    {title: 'Testing effects without flakes', tags: ['react', 'testing']},
    {title: 'Streaming responses from Node', tags: ['node', 'typescript']},
    {title: 'Design tokens that scale', tags: ['design', 'css']},
    {title: 'Mocking fetch in unit tests', tags: ['testing', 'node']},
];

export default function UseSetDemo() {
    const {set: selected, size, has, toggle, add, clear, reset} = useSet<Tag>(['react']);

    const visible = size === 0 ? POSTS : POSTS.filter((post) => post.tags.some((tag) => selected.has(tag)));

    return (
        <Stage>
            <StageHeader title="Tag filter" hint="Toggle tags to filter the posts. The selection is a Set, so each tag appears once."/>

            <Row className="mb-4">
                {TAGS.map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => toggle(tag)}
                        aria-pressed={has(tag)}
                        className={cn(
                            'h-8 rounded-full border px-3 font-mono text-xs transition-colors',
                            has(tag)
                                ? 'border-accent bg-accent text-accent-ink'
                                : 'border-line-strong bg-paper text-ink-2 hover:border-ink hover:text-ink'
                        )}
                    >
                        {has(tag) ? '- ' : '+ '}{tag}
                    </button>
                ))}
            </Row>

            <Row className="mb-5">
                <Button size="sm" variant="secondary" onClick={() => TAGS.forEach((tag) => add(tag))}>Select all</Button>
                <Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
                <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
            </Row>

            <ul className="grid gap-2 sm:grid-cols-2">
                {visible.map((post) => (
                    <li key={post.title} className="rounded-xl border border-line bg-paper/70 px-3 py-2">
                        <div className="text-sm text-ink">{post.title}</div>
                        <div className="mt-1 flex gap-2 font-mono text-[11px]">
                            {post.tags.map((tag) => (
                                <span key={tag} className={has(tag) ? 'text-accent' : 'text-ink-3'}>#{tag}</span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
            <Note className="mt-2">An empty selection shows every post.</Note>

            <ReadoutGrid cols={3} className="mt-6">
                <Readout label="size" value={size}/>
                <Readout label="has('react')" value={String(has('react'))} tone={has('react') ? 'accent' : 'default'}/>
                <Readout label="set" value={size ? `{${Array.from(selected).join(', ')}}` : '{}'}/>
            </ReadoutGrid>
        </Stage>
    );
}
