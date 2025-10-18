import React, {useState} from "react";
import {useVideo} from "@zenuilabs/react-hooks";

const UseVideoExample = () => {
    const {
        videoRef,
        playing,
        currentTime,
        duration,
        volume,
        muted,
        controls
    } = useVideo("https://www.w3schools.com/html/mov_bbb.mp4");
    const [volumeInput, setVolumeInput] = useState(volume);

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <video ref={videoRef} className="w-full rounded-lg max-w-md bg-black"/>

            <div className="flex flex-col space-y-2 w-full max-w-md">
                <p className="text-gray-700 dark:text-gray-300">
                    {playing ? "Playing" : "Paused"} - {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                </p>

                <div className="flex space-x-2">
                    <button onClick={controls.play}
                            className="px-4 py-2 bg-brandColor text-white rounded-md">Play
                    </button>
                    <button onClick={controls.pause}
                            className="px-4 py-2 bg-brandColor text-white rounded-md">Pause
                    </button>
                    <button onClick={controls.stop}
                            className="px-4 py-2 bg-brandColor text-white rounded-md">Reset
                    </button>
                    <button onClick={controls.toggleMute}
                            className="px-4 py-2 bg-brandColor text-white rounded-md">
                        {muted ? "Unmute" : "Mute"}
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300">Volume:</label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volumeInput}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setVolumeInput(val);
                            controls.setVolume(val);
                        }}
                        className="flex-1"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 dark:text-gray-300">Seek:</label>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => controls.setTime(parseFloat(e.target.value))}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default UseVideoExample;