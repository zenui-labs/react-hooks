import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Zap, Shield, Download, Github, ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-xs sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">ZenUI Labs</h1>
              <p className="text-sm text-muted-foreground">React Hooks</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/hooks">
              <Button variant="ghost">Hooks</Button>
            </Link>
            <Button size="sm" asChild>
              <a href="https://github.com/zenuilabs/react-hooks" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            v1.0.0 • TypeScript Ready
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Modern React Hooks Library
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A collection of production-ready React hooks that supercharge your development workflow. 
            TypeScript support, zero dependencies, and developer-friendly documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-md font-mono text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              npm install @zenuilabs/react-hooks
            </div>
            <Link href="/hooks">
              <Button size="lg" className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Explore Hooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Hooks?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Performance Optimized</CardTitle>
                <CardDescription>
                  Built with performance in mind. Each hook is optimized for minimal re-renders and maximum efficiency.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>TypeScript First</CardTitle>
                <CardDescription>
                  Full TypeScript support with comprehensive type definitions. Catch errors early and improve your DX.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-green-100 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Zero Dependencies</CardTitle>
                <CardDescription>
                  Pure React hooks with no external dependencies. Lightweight and tree-shakeable for optimal bundle size.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Hooks Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Hooks</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore some of our most popular hooks that developers love using in their React applications.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'useLocalStorage',
                description: 'Persist state in localStorage with automatic serialization',
                category: 'State'
              },
              {
                name: 'useDebounce',
                description: 'Delay value updates for performance optimization',
                category: 'Performance'
              },
              {
                name: 'useFetch',
                description: 'Simple data fetching with loading and error states',
                category: 'Data'
              },
              {
                name: 'useToggle',
                description: 'Boolean state management with helper functions',
                category: 'State'
              },
              {
                name: 'useHover',
                description: 'Track hover state of DOM elements',
                category: 'DOM'
              },
              {
                name: 'useCounter',
                description: 'Counter with increment, decrement, and reset',
                category: 'State'
              }
            ].map((hook) => (
              <Card key={hook.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg font-mono text-purple-600">{hook.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">{hook.category}</Badge>
                  </div>
                  <CardDescription>{hook.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/hooks/${hook.name.toLowerCase()}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/hooks">
              <Button variant="outline" size="lg">
                View All Hooks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-blue-600 rounded-md flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">ZenUI Labs</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Building modern, developer-friendly tools for the React ecosystem.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="https://github.com/zenuilabs/react-hooks" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/@zenuilabs/react-hooks" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              NPM
            </a>
            <Link href="/hooks" className="hover:text-foreground transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}