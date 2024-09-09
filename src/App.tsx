import { useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import {open} from '@tauri-apps/api/dialog';
import invariant from "tiny-invariant";
import Notification from './Notification';

import "@/App.css"

export default function Component() {
    const [rgbDirectory, setRgbDirectory] = useState('')
    const [nirDirectory, setNirDirectory] = useState('')
    const [timeThreshold, setTimeThreshold] = useState(500)
    const [isRunning, setIsRunning] = useState(false)
    const [notification, setNotification] = useState<{ title: string; message: string; isSuccess: boolean } | null>(null)

    const handleDirectoryChange = async (setDirectory: (value: string) => void) => {
        const selected = await open({directory: true, multiple: false})

        if (selected) {
            invariant(typeof selected === 'string', 'Selected value must be a string');
            setDirectory(selected)
        }
    }

    const isFormValid = useMemo(() => {
        return rgbDirectory !== '' && nirDirectory !== '' && timeThreshold >= 0
    }, [rgbDirectory, nirDirectory, timeThreshold])

    const handleRun = async () => {
        setIsRunning(true)
        try {
            const response: string = await invoke('run', {rgbDir: rgbDirectory, nirDir: nirDirectory, thresh: timeThreshold});
            console.log(response);
            setNotification({
                title: 'Great success!',
                message: response,
                isSuccess: true
            });
        }
        catch (e: any) {
            console.error(e);
            setNotification({
                title: 'Error (sad!)',
                message: (e as string),
                isSuccess: false
            });
        }
        finally {
            setIsRunning(false)
        }
    }

    const dismissNotification = () => {
        setNotification(null);
    }

    return (
        <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mt-8 p-4 bg-white border-4 border-black" style={{fontFamily: 'monospace'}}>
                <h1 className="text-4xl font-bold mb-6 text-center border-b-4 border-black pb-4">IIQ MATCHER/FLATTENER</h1>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="rgb-directory" className="block text-lg mb-2">RGB IMAGE DIRECTORY:</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="rgb-directory"
                                value={rgbDirectory}
                                onChange={(e) => setRgbDirectory(e.target.value)}
                                className="flex-grow border-2 border-black p-2 mr-2"
                                placeholder="Enter or select RGB directory"
                            />
                            <button
                                type="button"
                                onClick={() => handleDirectoryChange(setRgbDirectory)}
                                className="border-2 border-black p-2 bg-white hover:bg-black hover:text-white transition-colors"
                            >
                                BROWSE
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="nir-directory" className="block text-lg mb-2">NIR IMAGE DIRECTORY:</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="nir-directory"
                                value={nirDirectory}
                                onChange={(e) => setNirDirectory(e.target.value)}
                                className="flex-grow border-2 border-black p-2 mr-2"
                                placeholder="Enter or select NIR directory"
                            />
                            <button
                                type="button"
                                onClick={() => handleDirectoryChange(setNirDirectory)}
                                className="border-2 border-black p-2 bg-white hover:bg-black hover:text-white transition-colors"
                            >
                                BROWSE
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="time-threshold" className="block text-lg mb-2">IMAGE MATCH THRESHOLD (MILLISECONDS):</label>
                        <input
                            id="time-threshold"
                            type="number"
                            value={timeThreshold}
                            onChange={(e) => setTimeThreshold(Number(e.target.value))}
                            min={0}
                            step={100}
                            className="w-full border-2 border-black p-2"
                        />
                    </div>

                    {isRunning ? (
                        <div className="w-full bg-black text-white p-4 text-xl font-bold border-2 border-black text-center">
                            RUNNING...
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="w-full bg-black text-white p-4 text-xl font-bold hover:enabled:bg-white hover:enabled:text-black border-2 border-black transition-colors disabled:bg-white disabled:border-white transition-colors duration-200"
                            disabled={!isFormValid}
                            onClick={handleRun}
                        >
                            RUN
                        </button>
                    )}
                </form>
            </div>
            {notification && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md">
                        <Notification
                            title={notification.title}
                            message={notification.message}
                            isSuccess={notification.isSuccess}
                            onDismiss={dismissNotification}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}