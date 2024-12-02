'use client';
import Image from "next/image";
import logo from '../../public/images/logo.png'
import Hamburger from "../components/hamburger";
import React, { useEffect, useState } from "react";
import Sidebar from '../components/sidebar'
import iconFooter from '../../public/images/logo-footer.png';
import Link from "next/link";
import { useProfileContext } from "../context/profileContext";

export default function MainLayout({ children }) {
  const { profile } = useProfileContext();
  const [isEnableMenus, setIsEnableMenus] = useState(false)

  useEffect(() => {
    if (profile) {
      if (profile.status && profile.status == "APPROVED") {
        setIsEnableMenus(true)
      }
    }
  }, [profile])

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
      <main className="min-h-screen">
        <div className="bg-background py-[52px] ">
          <Sidebar isEnabled={isEnableMenus} profile={profile} isOpen={isOpen} toggle={toggle} />

          {children}



          <footer className="text-white py-4 text-center">

            <div className="text-center ">

              <div className='flex justify-center items-center'>

                <Image alt='footer' src={iconFooter}></Image>
              </div>
              <a href='mailto:luckytaya.com.ph'>Contact Us: luckytaya.com.ph</a>

            </div>
          </footer></div>
      </main>

    </React.Fragment>
  );
}