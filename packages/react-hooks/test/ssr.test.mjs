// Server-render smoke test.
// Every exported hook must render with react-dom/server in plain Node (no window,
// no document, no navigator). Each file in test/cases exports `cases`: a map from
// hook name to a function `(lib, React) => void` that calls the hook with sensible
// arguments inside a component.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readdir} from 'node:fs/promises';
import {createElement} from 'react';
import * as React from 'react';
import {renderToString} from 'react-dom/server';
import * as lib from '../dist/index.mjs';

const caseFiles = (await readdir(new URL('./cases/', import.meta.url))).filter((f) => f.endsWith('.mjs'));
const cases = {};
for (const file of caseFiles) {
    const mod = await import(new URL(`./cases/${file}`, import.meta.url));
    Object.assign(cases, mod.cases);
}

const exportedHooks = Object.keys(lib).filter((name) => /^use[A-Z]/.test(name)).sort();

test('no browser globals exist in this environment', () => {
    assert.equal(typeof window, 'undefined');
    assert.equal(typeof document, 'undefined');
});

test('every exported hook has an SSR case', () => {
    const missing = exportedHooks.filter((name) => !cases[name]);
    assert.deepEqual(missing, []);
});

for (const name of exportedHooks) {
    test(`${name} renders on the server`, () => {
        const run = cases[name];
        if (!run) return;
        const Probe = () => {
            run(lib, React);
            return null;
        };
        assert.doesNotThrow(() => renderToString(createElement(Probe)));
    });
}
