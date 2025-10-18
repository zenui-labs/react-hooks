import React, {useState} from "react";
import {useAudio} from "@zenuilabs/react-hooks";

const UseAudioExample = () => {
    const {
        playing,
        currentTime,
        duration,
        volume,
        controls
    } = useAudio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    const [volumeInput, setVolumeInput] = useState(volume);

    return (
        <div
            className="flex flex-col justify-center p-10 bg-gray-100 dark:bg-gray-900 rounded-xl space-y-6 w-full">
            <div className="flex flex-col max-w-md space-y-2 w-full">
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

export default UseAudioExample;