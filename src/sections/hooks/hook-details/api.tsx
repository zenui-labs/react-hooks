import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {HookType} from "@/types";

const Api = ({hook}: { hook: HookType }) => {
    return (
        <>
            {hook.api.length > 0 && (
                <Card className='border-none bg-gray-50'>
                    <CardHeader>
                        <CardTitle>Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {hook.api.map((param: any, index: number) => (
                                <div key={index} className="border-b pb-3 last:border-b-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                            {param.param}
                                        </code>
                                        <Badge variant="outline" className="text-xs">
                                            {param.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{param.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {hook.returns.length > 0 && (
                <Card className='border-none bg-gray-50'>
                    <CardHeader>
                        <CardTitle>Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {hook.returns.map((ret: any, index: number) => (
                                <div key={index} className="border-b pb-3 last:border-b-0">
                                    <div className="flex items-start gap-2 mb-1">
                                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                            {ret.name}
                                        </code>
                                        <Badge variant="outline" className="text-xs">
                                            {ret.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{ret.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default Api;