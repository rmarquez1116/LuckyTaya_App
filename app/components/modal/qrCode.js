import React from 'react'
import { useQRCode } from 'next-qrcode';

function QrCode({ onClose, data }) {

    const { Canvas } = useQRCode();
    return (
        <div className='absolute justify-center items-center flex w-full h-full overflow-hidden backdrop-blur'>
            <div className="text-center flex flex-col card max-w-sm gap-10 p-6 mt-2 bg-white rounded-3xl shadow">
               
               <label>Please Scan QR Code : </label>
                <Canvas
                    text={data}
                    options={{
                        errorCorrectionLevel: 'M',
                        margin: 3,
                        scale: 4,
                        width: 250,
                        color: {
                            dark: '#000000',
                            light: '#FFFFFF',
                        },
                    }}
                />
                <button onClick={onClose} className='primary w-full'>Close</button>
            </div>
        </div>
    )
}

export default QrCode