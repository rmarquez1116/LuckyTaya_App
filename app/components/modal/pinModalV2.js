import { useState } from 'react';

const PinV2 = ({ title, isOpen, onClose, onSubmit }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleNumberClick = (num) => {
        if (pin.length < 4) {
            setPin((prev) => prev + num);
        }
    };

    const handleDeleteClick = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        onSubmit(pin); // Call the submit handler passed in as prop
    };

    const handleCancel = () => {
        setPin('');
        setError('');;
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
                        Enter PIN</label>
                    <input
                        type="password"
                        value={pin}
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

                        type='button'
                        onClick={handleDeleteClick}
                        className=" rounded-[40px] text-xl bg-red-500 text-white hover:bg-red col-span-2"
                    >
                        DEL
                    </button>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4">
                    <button

                        type='button'
                        onClick={() => onClose()}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-[40px] hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className=" bg-blue-600 text-white rounded-md primary"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PinV2;