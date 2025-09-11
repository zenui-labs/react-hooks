import {useEffect, useState} from 'react';
import {LocationState} from "../types";

export function useLocation() {
    const getLocation = (): LocationState => ({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
    });

    const [location, setLocation] = useState<LocationState>(getLocation);

    useEffect(() => {
        const handleChange = () => setLocation(getLocation());

        window.addEventListener('popstate', handleChange);
        window.addEventListener('hashchange', handleChange);

        return () => {
            window.removeEventListener('popstate', handleChange);
            window.removeEventListener('hashchange', handleChange);
        };
    }, []);

    return location;
}
