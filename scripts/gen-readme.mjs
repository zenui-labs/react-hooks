// Regenerates the hook list in both READMEs from the docs data in src/data.
// The list lives between <!-- hooks:start --> and <!-- hooks:end --> markers.
// Requires Node 22.18+ (native TypeScript type stripping).
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const files = ['core-a', 'core-b', 'state-async', 'realtime-motion', 'interaction', 'browser-utils'];
const CATEGORIES = [
    'State', 'Async & Data', 'Realtime', 'Performance', 'Events & DOM',
    'Interaction', 'Browser & Device', 'Media', 'Time & Motion', 'Utilities',
];

const hooks = [];
for (const file of files) {
    const mod = await import(join(root, 'src/data', `${file}.ts`));
    for (const [slug, doc] of Object.entries(Object.values(mod)[0])) hooks.push({slug, ...doc});
}

const lines = [`${hooks.length} hooks in ${CATEGORIES.filter((c) => hooks.some((h) => h.category === c)).length} groups.`, ''];
for (const category of CATEGORIES) {
    const group = hooks.filter((h) => h.category === category).sort((a, b) => a.name.localeCompare(b.name));
    if (group.length === 0) continue;
    lines.push(`### ${category}`, '', '| Hook | What it does |', '| --- | --- |');
    for (const hook of group) {
        const summary = hook.description.split(/(?<=\.)\s/)[0].replace(/\|/g, '\\|');
        const isNew = hook.since === '2.1.0' ? ' `new`' : '';
        lines.push(`| [\`${hook.name}\`](https://react-hooks.zenui.net/hooks/${hook.slug})${isNew} | ${summary} |`);
    }
    lines.push('');
}

const block = `<!-- hooks:start -->\n${lines.join('\n').trim()}\n<!-- hooks:end -->`;

for (const readme of ['README.md', 'packages/react-hooks/README.md']) {
    const path = join(root, readme);
    const source = readFileSync(path, 'utf8');
    const next = source.replace(/<!-- hooks:start -->[\s\S]*<!-- hooks:end -->/, block);
    writeFileSync(path, next);
}

console.log(`readme: ${hooks.length} hooks`);
