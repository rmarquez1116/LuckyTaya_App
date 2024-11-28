import React from 'react'
import logo from '../../public/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';

function CommonLayout({ children }) {
    return (
        <React.Fragment>

            <div>
                <nav className='fixed p-3 w-full'>
                    <div className="flex justify-center">
                        <Link href="/">
                            <Image alt='logo' src={logo}></Image>
                        </Link>
                    </div>
                </nav>
            </div>
            <div>
                <div className="min-h-screen py-10 flex justify-center items-center ">

                    {children}

                </div>
            </div>
        </React.Fragment>
    )
}

export default CommonLayout