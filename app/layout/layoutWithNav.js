import React from 'react'
import logo from '../../public/images/logo.png';
import Image from 'next/image';

function CommonLayout({ children }) {
    return (
        <div>

            <div>

                <nav className='fixed p-3 w-full'>
                    <div className="flex justify-center">
                        <div>
                            <button className="relative group">
                                <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
                                    <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                                        <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:rotate-[42deg]"></div>
                                        <div className="bg-white h-[2px] w-1/2 rounded transform transition-all duration-300 group-focus:-translate-x-10"></div>
                                        <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:-rotate-[42deg]"></div>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <Image alt='logo' src={logo}></Image>
                    </div>
                </nav>
            </div>
            <div>
                <div className="bg-background py-10 flex justify-center items-center ">

                    {children}

                </div>
            </div>

        </div>
    )
}

export default CommonLayout