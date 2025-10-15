import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {HookType} from "@/types";

const TableHeader = ({children}: { children: React.ReactNode }) => (
    <div
        className="grid grid-cols-3 gap-4 px-4 py-3 bg-muted/50 border-b border-gray-200 dark:border-gray-800 font-semibold text-base">
        {children}
    </div>
);

const TableRow = ({children, isLast = false}: { children: React.ReactNode, isLast: boolean }) => (
    <div
        className={`grid border-gray-200 dark:border-gray-800 grid-cols-3 gap-4 px-4 py-3 hover:bg-muted/30 text-base ${!isLast ? 'border-b border-muted' : ''}`}>
        {children}
    </div>
);

const Api = ({hook}: { hook: HookType }) => {
    return (
        <div className="space-y-6 dark:text-darkText">
            {hook.api && hook.api.length > 0 && (
                <Card className='border-none bg-gray-50 dark:bg-gray-900'>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-semibold">
                            Parameters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="rounded-lg border overflow-hidden border-gray-200 dark:border-gray-800">
                            <TableHeader>
                                <div>Parameter</div>
                                <div>Type</div>
                                <div>Description</div>
                            </TableHeader>
                            {hook.api.map((param, index) => (
                                <TableRow key={index} isLast={index === hook.api.length - 1}>
                                    <div>
                                        <code
                                            className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                                            {param.param}
                                        </code>
                                    </div>
                                    <div>
                                        <Badge variant="secondary"
                                               className="font-mono text-xs dark:bg-gray-800 bg-gray-200 px-2 py-1 rounded-lg">
                                            {param.type}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground">
                                        {param.description}
                                    </div>
                                </TableRow>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {hook.returns && hook.returns.length > 0 && (
                <Card className='border-none bg-gray-50 dark:bg-gray-900'>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-semibold">
                            Returns
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div
                            className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <TableHeader>
                                <div>Property</div>
                                <div>Type</div>
                                <div>Description</div>
                            </TableHeader>
                            {hook.returns.map((ret, index) => (
                                <TableRow key={index} isLast={index === hook.returns.length - 1}>
                                    <div>
                                        <code
                                            className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                                            {ret.name}
                                        </code>
                                    </div>
                                    <div className="max-w-0">
                                        <Badge variant="secondary"
                                               className="font-mono text-xs dark:bg-gray-800 bg-gray-200 rounded-lg w-max px-2 py-1">
                                            {ret.type}
                                        </Badge>
                                    </div>
                                    <div className="text-muted-foreground">
                                        {ret.description}
                                    </div>
                                </TableRow>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {
                !hook.api?.length && !hook.returns.length && (
                    <p className='text-center text-base pt-30'>This hook not have any <i>API</i> or <i>Returns</i>.</p>
                )
            }
        </div>
    );
};

export default Api