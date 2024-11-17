import { useState } from 'react';

const Pin = ({title, isOpen, onClose, onSubmit }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');

    const handleNumberClick = (num) => {
        if (isConfirming && confirmPin.length < 4) {
            setConfirmPin((prev) => prev + num);
        } else if (!isConfirming && pin.length < 4) {
            setPin((prev) => prev + num);
        }
    };

    const handleDeleteClick = () => {
        if (isConfirming) {
            setConfirmPin((prev) => prev.slice(0, -1));
        } else {
            setPin((prev) => prev.slice(0, -1));
        }
    };

    const handleSubmit = () => {
        if (isConfirming) {

            if (pin !== confirmPin) {
                setError('PINs do not match.');
                return;
            }
            onSubmit(pin); // Call the submit handler passed in as prop
        }
        else {
            if (pin.length < 4) {
                setError('PIN is invalid.');
            }
            else {
                setIsConfirming(true)
                setError('');
            }

        }

        // setError('');
        // onClose(); // Close modal on successful submission
    };

    const handleCancel = () => {
        setPin('');
        setConfirmPin('');
        setError('');
        setIsConfirming(false);
        onClose(); // Close the modal when canceled
    };

    if (!isOpen) return null;

    return (
        <div className='z-10 items-start top-0 pt-[50px] absolute justify-center flex w-full h-full overflow-hidden backdrop-blur'>
            <div className="flex flex-col card max-w-md p-7 bg-white shadow rounded-[40px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900 font-bold text-xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    <label className="">
                        {isConfirming ? 'Confirm PIN' : 'Enter PIN'}</label>
                    <input
                        type="password"
                        value={isConfirming ? confirmPin : pin}
                        readOnly
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="****"
                    />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="h-[50px] amount-button text-center rounded-[20px] focus:outline-none"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleDeleteClick}
                        className=" rounded-[40px] text-xl bg-red-500 text-white hover:bg-red-600 col-span-2"
                    >
                        DEL
                    </button>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-[40px] hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className=" bg-blue-600 text-white rounded-md primary"
                    >
                        {isConfirming ? 'Submit' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pin;