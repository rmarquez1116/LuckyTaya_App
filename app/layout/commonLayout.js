import React from 'react'
import logo from '../../public/images/logo.png';
import Image from 'next/image';

function CommonLayout({ children }) {
    return (
        <React.Fragment>

            <div>
                <nav className='fixed p-3 w-full'>
                    <div className="flex justify-center">

                        <Image alt='button' src={logo}></Image>
                    </div>
                </nav>
            </div>
            <div>
                <div className="bg-background min-h-screen py-10 flex justify-center items-center ">

                    {children}

                </div>
            </div>
        </React.Fragment>
    )
}

export default CommonLayout