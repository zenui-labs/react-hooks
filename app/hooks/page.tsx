import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, ExternalLink, Code } from 'lucide-react';

const hooks = [
  {
    name: 'useLocalStorage',
    description: 'Persist state in localStorage with automatic JSON serialization and synchronization',
    category: 'State Management',
    slug: 'uselocalstorage'
  },
  {
    name: 'useDebounce',
    description: 'Delay value updates until after a specified delay, perfect for search inputs',
    category: 'Performance',
    slug: 'usedebounce'
  },
  {
    name: 'useToggle',
    description: 'Manage boolean state with convenient helper functions for common operations',
    category: 'State Management',
    slug: 'usetoggle'
  },
  {
    name: 'useCounter',
    description: 'Counter state with increment, decrement, reset, and set operations',
    category: 'State Management',
    slug: 'usecounter'
  },
  {
    name: 'useFetch',
    description: 'Simple data fetching with loading states, error handling, and refetch functionality',
    category: 'Data Fetching',
    slug: 'usefetch'
  },
  {
    name: 'useHover',
    description: 'Track hover state of DOM elements with automatic event cleanup',
    category: 'DOM & Events',
    slug: 'usehover'
  },
  {
    name: 'useClickOutside',
    description: 'Detect clicks outside a referenced element, useful for modals and dropdowns',
    category: 'DOM & Events',
    slug: 'useclickoutside'
  },
  {
    name: 'useCopyToClipboard',
    description: 'Copy text to clipboard with feedback state and error handling',
    category: 'Utilities',
    slug: 'usecopytoclipboard'
  },
  {
    name: 'useInterval',
    description: 'Declarative interval hook with automatic cleanup and pause/resume capability',
    category: 'Utilities',
    slug: 'useinterval'
  },
  {
    name: 'useWindowSize',
    description: 'Track window dimensions with automatic updates on resize events',
    category: 'DOM & Events',
    slug: 'usewindowsize'
  }
];

const categories = Array.from(new Set(hooks.map(hook => hook.category)));

export default function HooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">React Hooks</h1>
                <p className="text-sm text-muted-foreground">Library Documentation</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input 
              placeholder="Search hooks..." 
              className="pl-9 w-64"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">React Hooks Library</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of production-ready React hooks. Click on any hook to see live examples, 
            copy code snippets, and try them in an online playground.
          </p>
        </div>

        {/* Installation */}
        <div className="mb-12 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm mb-4">
                npm install @zenuilabs/react-hooks
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-sm"><code>{`import { useLocalStorage, useDebounce } from '@zenuilabs/react-hooks';

function MyComponent() {
  const [name, setName] = useLocalStorage('name', '');
  const debouncedName = useDebounce(name, 300);
  
  return <input value={name} onChange={e => setName(e.target.value)} />;
}`}</code></pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hooks Grid */}
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full"></div>
                {category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hooks.filter(hook => hook.category === category).map(hook => (
                  <Card key={hook.name} className="hover:shadow-lg transition-all duration-200 hover:border-purple-200">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-mono text-purple-600">
                          {hook.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {hook.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {hook.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/hooks/${hook.slug}`}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          View Details & Examples
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Need a Custom Hook?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? We're always adding new hooks based on community feedback.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <a href="https://github.com/zenuilabs/react-hooks/issues" target="_blank" rel="noopener noreferrer">
                    Request Hook
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/zenuilabs/react-hooks" target="_blank" rel="noopener noreferrer">
                    Contribute
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}