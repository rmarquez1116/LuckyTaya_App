import React, { useEffect, useState } from 'react';
import { useQRCode } from 'next-qrcode';

function QrCode({ onClose, data }) {
    const { Canvas } = useQRCode();
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    // Function to download the QR code as an image
    const downloadQRCode = () => {
        const canvas = document.querySelector('canvas');  // Find the canvas element
        if (canvas) {
            const imageUrl = canvas.toDataURL('image/png'); // Convert canvas to image URL
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'qrcode.png'; // Set the download file name
            link.click(); // Trigger the download
        }
    };

    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            setIsCanvasReady(true); // Mark canvas as ready when found
        }
    }, [data]); // Re-run this effect if the `data` changes

    return (
        <div className='absolute justify-center items-center flex w-full h-full overflow-hidden backdrop-blur'>
            <div className="text-center flex flex-col card max-w-sm gap-10 p-6 mt-2 bg-white rounded-3xl shadow">

                <label>Please Scan QR Code :</label>
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
                    <button
                        onClick={downloadQRCode}
                        className="primary w-full"
                        disabled={!isCanvasReady} // Disable the download button if canvas is not ready
                    >
                        Download QR Code
                    </button>

                <button onClick={onClose} className='text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600'>Close</button>
            </div>
        </div>
    );
}

export default QrCode;