import React from "react";
import { useFetch } from "@zenuilabs/react-hooks";

const UseFetchExample = () => {
    const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts");

    if (loading) return <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-8 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
            <h2 className="text-lg font-semibold mb-3">Fetched Posts</h2>
            <ul className="space-y-3 mb-5">
                {/*@ts-ignore*/}
                {data?.slice(0, 5).map((post: any) => (
                    <li key={post.id} className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                        <h3 className="font-semibold mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UseFetchExample;
