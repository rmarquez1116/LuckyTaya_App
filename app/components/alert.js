import React, { useEffect } from 'react'

function Alert({ title, message, type, onClose, timeout = 3000 }) {
    useEffect(() => {
        setTimeout(() => {
            onClose()
        }, timeout);

        return () => {
        }
    }, [timeout,onClose])

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
        <div role="alert" className='fixed top-0 right-0 w-[60%] top-0 z-20'>
            <div className={`${color(type)} overflow-hidden text-white font-bold rounded-t px-4 py-2`}>
                {/* <p>
                    {title}
                </p> */}
                <p className='label-header1 scrolling-text whitespace-nowrap '>{message}</p>
            </div>
        </div>
    )
}

export default Alert