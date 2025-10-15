import {useCallback, useEffect} from "react";
import {useAsync} from "../../../packages/react-hooks/src/hooks/useAsync";

const UseAsyncExample = () => {
    const fetchUser = useCallback(async (userId = 1) => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const json = await res.json();
        return json;
    }, []);

    const hookResult = useAsync(fetchUser, false);
    const {data, loading, error, execute, reset} = hookResult;

    useEffect(() => {
        execute(1)
    }, [])

    return (
        <div className="rounded-xl p-8 bg-gray-50 text-gray-900 dark:bg-gray-900 transition-colors">
            <h2 className="text-2xl font-bold mb-6 dark:text-darkText">Async User Fetcher</h2>

            {loading && (
                <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                    <p className="text-blue-300">🔄 Fetching user data...</p>
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300">❌ {error.message}</p>
                </div>
            )}

            {data && (
                <div className="mb-6 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">✅ User Data</h3>
                    <div className="space-y-2 dark:text-darkText/80">
                        <p><strong>Name:</strong> {data.name}</p>
                        <p><strong>Email:</strong> {data.email}</p>
                        <p><strong>Username:</strong> {data.username}</p>
                        <p><strong>Company:</strong> {data.company?.name}</p>
                        <p><strong>City:</strong> {data.address?.city}</p>
                    </div>
                </div>
            )}

            {!data && !loading && !error && (
                <div
                    className="mb-6 p-8 bg-gray-100 dark:bg-gray-700/30 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                    <p className="dark:text-gray-400 text-center text-lg">
                        👇 Click a button below to load user data
                    </p>
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map((id) => (
                    <button
                        key={id}
                        onClick={() => execute(id)}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-black/60 text-white/80 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-all"
                    >
                        Load User {id}
                    </button>
                ))}
                <button
                    onClick={reset}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-gray-600  font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default UseAsyncExample;