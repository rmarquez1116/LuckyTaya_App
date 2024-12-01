'use client';
import Image from "next/image";
import logo from '../../public/images/logo.png'
import Hamburger from "../components/hamburger";
import React, { useState } from "react";
import Sidebar from '../components/sidebar'
import iconFooter from '../../public/images/logo-footer.png';
import Link from "next/link";

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <React.Fragment>

      <header>

        <nav className='fixed p-3 w-full '>
          <div className="absolute top-0">
            <Hamburger toggle={toggle}></Hamburger>
          </div>

          <div className="flex justify-center">
            <Link href="/">
              <Image alt='logo' src={logo}></Image>
            </Link>
          </div>
        </nav>
      </header>
      <main class="min-h-screen">
        <div className="bg-background py-[52px] ">
          <Sidebar isOpen={isOpen} toggle={toggle} />

          {children}
          <footer class="text-white py-4 text-center">

            <div className="text-center ">

              <div className='flex justify-center items-center'>

                <Image alt='footer' src={iconFooter}></Image>
              </div>
              <a href='mailto:luckytaya.com.ph'>Contact Us: luckytaya.com.ph</a>

            </div>
          </footer>
        </div>
      </main>

    </React.Fragment>
  );
}