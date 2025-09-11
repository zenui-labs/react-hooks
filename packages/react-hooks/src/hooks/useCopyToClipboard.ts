import {useCallback, useState} from 'react';

export function useCopyToClipboard() {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text: ', error);
            setIsCopied(false);
        }
    }, []);

    return {isCopied, copyToClipboard};
}