import {useDrop} from "@zenuilabs/react-hooks";

export default function UseDropExample() {
    const {ref, isOver, data, handlers} = useDrop<HTMLDivElement>();

    const displayData = () => {
        if (!data) return 'None';

        if (typeof data === 'string') {
            return data;
        }

        if (data instanceof FileList) {
            return Array.from(data)
                .map((file) => file.name)
                .join(', ');
        }

        return 'Unknown data type';
    };

    const handleDragStart = (e: React.DragEvent, text: string) => {
        e.dataTransfer.setData('text/plain', text);
    };

    return (
        <div className="flex justify-center dark:text-darkText flex-col rounded-xl p-16 bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-2xl space-y-6">
                {/* Status Display */}
                <div className="rounded-xl p-6 shadow-lg bg-white dark:bg-gray-800">
                    <div className="space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                            Drag State:{' '}
                            <strong
                                className={isOver ? 'text-brandColor dark:text-purple-400' : 'text-gray-900 dark:text-white'}>
                                {isOver ? 'Dragging Over' : 'Idle'}
                            </strong>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Dropped Data:{' '}
                            <strong className="text-gray-900 dark:text-white break-all">
                                {displayData()}
                            </strong>
                        </p>
                    </div>
                </div>

                {/* Draggable Items */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Try dragging these:
                </h2>
                <div className="flex gap-4">
                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'Hello from draggable item 1!')}
                        className="p-4 bg-blue-500 text-white rounded-lg cursor-move hover:bg-blue-600 transition-colors text-center"
                    >
                        Drag me! (Item 1)
                    </div>

                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'This is draggable item 2')}
                        className="p-4 bg-green-500 text-white rounded-lg cursor-move hover:bg-green-600 transition-colors text-center"
                    >
                        Drag me! (Item 2)
                    </div>

                    <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'This is draggable item 3')}
                        className="p-4 bg-purple-500 text-white rounded-lg cursor-move hover:bg-purple-600 transition-colors text-center"
                    >
                        Drag me! (Item 3)
                    </div>
                </div>

                {/* Drop Zone */}
                <div
                    ref={ref}
                    {...handlers}
                    className={`h-64 flex items-center justify-center rounded-lg border-2 border-dashed transition-all duration-300 ${
                        isOver
                            ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40'
                            : 'border-gray-200 dark:border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                >
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                        Drop Zone
                    </p>
                </div>
            </div>
        </div>
    );
}