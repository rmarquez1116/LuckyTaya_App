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
        <div role="alert" className='absolute w-full top-0'>
            <div className={`${color(type)} text-white font-bold rounded-t px-4 py-2`}>
                <p>
                    {title}
                </p>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Alert