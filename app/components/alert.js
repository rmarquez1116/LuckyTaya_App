import React, { useEffect } from 'react'
import Timer from './timer';

function Alert({ title, message, type, onClose, timeout = 3000, isAnimating = true, hasTimer = false }) {
    useEffect(() => {
        // setTimeout(() => {
        //     onClose()
        // }, timeout);

        return () => {
        }
    }, [timeout, onClose])

    const color = m => {
        switch (m) {
            case 'success':
                return 'successColor';
            case 'error':
                return 'meronColor';
            case 'info':
                return 'walaColor';
            case 'warning':
                return 'yellowColor';
            default:
                return 'successColor';
        }
    };

    return (
        <div role="alert" className={`${color(type)} fixed bottom-0 right-0 w-[100%] z-20 `}>
            <div className='items-center grid grid-cols-5 grid-rows-1 gap-4'>
                <div className={`col-span-${hasTimer ? '4' : '5'} overflow-hidden text-white font-bold rounded-t px-4 py-2`}>
                    {/* <p>
                    {title}
                </p> */}
                    <p className={`label-header1 whitespace-nowrap ${isAnimating ? ' scrolling-text ' : ''}`}>{message}</p>
                </div>
                {hasTimer && <div>
                    <Timer duration={timeout}></Timer>
                </div>
                }
            </div >
        </div >
    )
}

export default Alert