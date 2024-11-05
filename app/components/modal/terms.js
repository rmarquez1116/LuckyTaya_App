import React from 'react'

function Terms({ onClose }) {
    return (
        <div className='absolute justify-center items-center flex w-full h-full overflow-hidden backdrop-blur'>
            <div className="flex flex-col card max-w-sm gap-10 p-6 mt-10 bg-white rounded-3xl shadow">
                <label className="text-center">Terms and Services</label>
                <label className="text-center">Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit. Sed ultricies fermentum ipsum a congue. 
                    Integer auctor a risus molestie blandit. 
                    Aenean dignissim cursus arcu, condimentum accumsan sapien suscipit at. 
                    Maecenas et nisi eget augue vulputate pulvinar ac at velit. </label>
                <button onClick={onClose} className='primary w-full'>Accept</button>
            </div>
        </div>
    )
}

export default Terms