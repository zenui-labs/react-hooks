'use client'

import {useCallback, useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {cn} from '@/lib/cn';

/**
 * Horizontal rail for chips and tabs. Scrolls with the mouse wheel, drags with the mouse,
 * and shows arrow buttons over a fading mask on whichever side still has content.
 */
export function ScrollRail({children, label, className}: { children: React.ReactNode; label: string; className?: string }) {
    const railRef = useRef<HTMLDivElement>(null);
    const [edges, setEdges] = useState({start: false, end: false});
    const [dragging, setDragging] = useState(false);
    // Set after a drag so the click that ends it does not toggle a chip.
    const suppressClick = useRef(false);

    const measure = useCallback(() => {
        const rail = railRef.current;
        if (!rail) return;
        const start = rail.scrollLeft > 1;
        const end = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1;
        setEdges((prev) => (prev.start === start && prev.end === end ? prev : {start, end}));
    }, []);

    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(rail);
        Array.from(rail.children).forEach((child) => observer.observe(child));

        // Vertical wheel moves the rail sideways. It only takes over while the rail can
        // still move in that direction, so the page scrolls normally at either end.
        const onWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
            const max = rail.scrollWidth - rail.clientWidth;
            if (max <= 0) return;
            const canMove = event.deltaY > 0 ? rail.scrollLeft < max - 1 : rail.scrollLeft > 1;
            if (!canMove) return;
            event.preventDefault();
            rail.scrollLeft += event.deltaY;
        };

        rail.addEventListener('scroll', measure, {passive: true});
        rail.addEventListener('wheel', onWheel, {passive: false});
        return () => {
            observer.disconnect();
            rail.removeEventListener('scroll', measure);
            rail.removeEventListener('wheel', onWheel);
        };
    }, [measure]);

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        const rail = railRef.current;
        if (!rail || event.pointerType !== 'mouse' || event.button !== 0) return;
        if (rail.scrollWidth <= rail.clientWidth) return;

        const startX = event.clientX;
        const startScroll = rail.scrollLeft;
        let moved = false;

        const onMove = (move: PointerEvent) => {
            const dx = move.clientX - startX;
            if (!moved && Math.abs(dx) < 4) return;
            if (!moved) {
                moved = true;
                setDragging(true);
            }
            rail.scrollLeft = startScroll - dx;
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            if (moved) {
                suppressClick.current = true;
                setDragging(false);
            }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    };

    const onClickCapture = (event: React.MouseEvent) => {
        if (!suppressClick.current) return;
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
    };

    const page = (direction: 1 | -1) => {
        const rail = railRef.current;
        if (!rail) return;
        rail.scrollBy({left: direction * rail.clientWidth * 0.7, behavior: 'smooth'});
    };

    return (
        <div className={cn('relative min-w-0', className)}>
            <div
                ref={railRef}
                role="group"
                aria-label={label}
                onPointerDown={onPointerDown}
                onClickCapture={onClickCapture}
                onDragStart={(event) => event.preventDefault()}
                className={cn(
                    'flex gap-2 overflow-x-auto overscroll-x-contain py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                    dragging ? 'cursor-grabbing select-none [&_*]:cursor-grabbing' : ''
                )}
            >
                {children}
            </div>

            <RailEdge side="start" label={label} visible={edges.start} onClick={() => page(-1)}/>
            <RailEdge side="end" label={label} visible={edges.end} onClick={() => page(1)}/>
        </div>
    );
}

function RailEdge({side, label, visible, onClick}: { side: 'start' | 'end'; label: string; visible: boolean; onClick: () => void }) {
    const start = side === 'start';
    const Icon = start ? ChevronLeft : ChevronRight;

    return (
        <div
            aria-hidden={!visible}
            className={cn(
                'pointer-events-none absolute inset-y-0 flex w-24 items-center transition-opacity duration-200',
                start
                    ? 'left-0 justify-start bg-gradient-to-r from-paper from-35% to-transparent'
                    : 'right-0 justify-end bg-gradient-to-l from-paper from-35% to-transparent',
                visible ? 'opacity-100' : 'opacity-0'
            )}
        >
            <button
                type="button"
                tabIndex={visible ? 0 : -1}
                onClick={onClick}
                aria-label={`Scroll ${label.toLowerCase()} ${start ? 'left' : 'right'}`}
                className={cn(
                    'grid size-8 place-items-center rounded-full border border-line-strong bg-panel text-ink-2 shadow-sm transition-colors hover:border-ink hover:text-ink',
                    visible ? 'pointer-events-auto' : 'pointer-events-none'
                )}
            >
                <Icon size={16}/>
            </button>
        </div>
    );
}
