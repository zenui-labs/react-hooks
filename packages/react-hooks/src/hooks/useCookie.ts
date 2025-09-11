import {useCallback, useState} from 'react';
import {CookieOptions} from "../types";

export function useCookie(name: string, initialValue: string = '') {
    const getCookie = () => {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? decodeURIComponent(match[2]) : initialValue;
    };

    const [value, setValue] = useState<string>(getCookie);

    const updateCookie = useCallback((newValue: string, options: CookieOptions = {}) => {
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(newValue)}`;

        if (options.path) cookieStr += `; path=${options.path}`;
        if (options.expires) cookieStr += `; expires=${options.expires.toUTCString()}`;
        if (options.maxAge) cookieStr += `; max-age=${options.maxAge}`;
        if (options.secure) cookieStr += `; secure`;
        if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;

        document.cookie = cookieStr;
        setValue(newValue);
    }, [name]);

    const removeCookie = useCallback(() => {
        document.cookie = `${encodeURIComponent(name)}=; max-age=0`;
        setValue('');
    }, [name]);

    return {value, setValue: updateCookie, remove: removeCookie};
}
