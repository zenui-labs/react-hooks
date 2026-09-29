'use client'

import React, {useEffect, useMemo} from 'react';
import {FileUp, FolderOpen, Image as ImageIcon, X} from 'lucide-react';
import {useFileDialog} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function UseFileDialogDemo() {
    const {files, open, reset} = useFileDialog({multiple: true});

    const previews = useMemo(
        () => files.map((file) => (file.type.startsWith('image/') ? URL.createObjectURL(file) : null)),
        [files]
    );
    useEffect(() => () => previews.forEach((url) => url && URL.revokeObjectURL(url)), [previews]);

    const total = files.reduce((sum, file) => sum + file.size, 0);

    return (
        <Stage>
            <StageHeader
                title="File picker without an input"
                hint="These are plain buttons. Each one opens the native picker with different options through open(overrides)."
            />

            <Row>
                <Button onClick={() => open()}><FolderOpen className="size-4"/>Any files</Button>
                <Button variant="secondary" onClick={() => open({accept: 'image/*'})}>
                    <ImageIcon className="size-4"/>Images only
                </Button>
                <Button variant="secondary" onClick={() => open({accept: '.pdf,.txt,.md', multiple: false})}>
                    <FileUp className="size-4"/>One document
                </Button>
                <Button variant="ghost" onClick={reset} disabled={files.length === 0}>
                    <X className="size-4"/>Reset
                </Button>
            </Row>

            <div className="mt-5 min-h-24 rounded-xl border border-line bg-paper/70 p-3">
                {files.length === 0 ? (
                    <p className="p-4 text-center text-sm text-ink-3">No files picked yet.</p>
                ) : (
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {files.map((file, i) => (
                            <li key={`${file.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-line bg-panel p-2">
                                {previews[i] ? (
                                    <img src={previews[i]!} alt="" className="size-10 rounded-md object-cover"/>
                                ) : (
                                    <div className="flex size-10 items-center justify-center rounded-md bg-panel-2 font-mono text-[10px] uppercase text-ink-2">
                                        {file.name.split('.').pop()?.slice(0, 4) || 'file'}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="truncate text-sm text-ink">{file.name}</div>
                                    <div className="font-mono text-[11px] text-ink-3">
                                        {formatSize(file.size)} {file.type && `· ${file.type}`}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ReadoutGrid cols={2} className="mt-5">
                <Readout label="files.length" value={files.length} tone={files.length ? 'accent' : 'default'}/>
                <Readout label="total size" value={formatSize(total)}/>
            </ReadoutGrid>
            <Note className="mt-3">
                Files never leave your browser. On phones, passing capture opens the camera directly.
            </Note>
        </Stage>
    );
}
