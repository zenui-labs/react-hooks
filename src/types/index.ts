export interface HookType {
    name: string
    description: string
    category: string
    usage: string
    api: {
        key: string
        type: string
        description: string
        param?: string
    }[]
    returns: {
        name: string
        type: string
        description: string
    }[]
}