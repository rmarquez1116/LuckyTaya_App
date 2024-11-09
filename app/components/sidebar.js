import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import cs from '../../public/images/cs.png';
import cashIn from '../../public/images/cashin.png';
import cashOut from '../../public/images/cashout.png';
import SidebarButton from '../components/sidebarButton';
import Menu from '../components/menu';
import iconFooter from '../../public/images/logo-footer.png';
import { logout } from '../actions/auth';

function Sidebar({ toggle, isOpen }) {
  return (
    <React.Fragment>
      <div className='h-full w-full absolute top-0' onClick={toggle}
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: 0,
          left: ` ${isOpen ? "0" : "-100%"}`,
        }}></div>
      <div
        className={`sidebar-container 
        fixed w-80 h-full overflow-hidden ease-in-out duration-300
        text-center
        pt-[50px] left-0 z-10 `}
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: 0,
          left: ` ${isOpen ? "0" : "-100%"}`,
        }}
      // onClick={toggle}
      >

        <div className='p-3 grid grid-cols-3 grid-rows-1 gap-4 text-center'>
          <Link href="/cashin">
            <SidebarButton img={cashIn} label="Cash In"></SidebarButton>
          </Link>   <Link href="/cashout">
            <SidebarButton img={cashOut} label="Cash Out"></SidebarButton>
          </Link>
          <Link href="/support">
            <SidebarButton img={cs} label="Support"></SidebarButton>
          </Link>
        </div>
        <Menu></Menu>
        <button onClick={() => logout()} className='w-[50%]'>Logout</button>

        <div className='absolute bottom-[50px] w-full'>

          <div className='w-full flex justify-center items-center'>

            <Image alt='footer' src={iconFooter}></Image>
          </div>
          <a href='mailto:luckytaya.com.ph'>Contact Us: luckytaya.com.ph</a>
        </div>
      </div>
      <div />
    </React.Fragment>
  )
}

export default Sidebar