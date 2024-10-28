'use client';
import Image from "next/image";
import logo from '../../public/images/logo.png'
import Hamburger from "../components/hamburger";
import { useState } from "react";
import Sidebar from '../components/sidebar'
import iconFooter from '../../public/images/logo-footer.png';

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <html lang="en">
      <body>

        <header>

          <nav className='fixed p-3 w-full '>
            <div className="absolute top-0">
              <Hamburger toggle={toggle}></Hamburger>
            </div>

            <div className="flex justify-center">
              <Image alt='logo'  src={logo}></Image>
            </div>
          </nav>
        </header>
        <main>
          <div className="bg-background py-[52px]">

            <Sidebar isOpen={isOpen} toggle={toggle} />
            {children}

          </div>
        </main>
        <footer>
          <div className='absolute bottom-[50px] w-full text-center'>

            <div className='w-full flex justify-center items-center'>

              <Image alt='footer'  src={iconFooter}></Image>
            </div>
            <a href='mailto:luckytaya.com.ph'>Contact Us: luckytaya.com.ph</a>
          </div>
        </footer>
      </body>
    </html >
  );
}
