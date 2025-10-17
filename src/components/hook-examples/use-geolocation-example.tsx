import React from "react";
import {useGeolocation} from "@zenuilabs/react-hooks";

const UseGeolocationExample = () => {
    const {latitude, longitude, accuracy, error} = useGeolocation();

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Current Location
            </h2>

            {error ? (
                <p className="text-red-500 dark:text-red-400">{error}</p>
            ) : (
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                    <p><span className="font-semibold">Latitude:</span> {latitude ?? "Loading..."}</p>
                    <p><span className="font-semibold">Longitude:</span> {longitude ?? "Loading..."}</p>
                    <p><span className="font-semibold">Accuracy:</span> {accuracy ? `${accuracy} meters` : "Loading..."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UseGeolocationExample;