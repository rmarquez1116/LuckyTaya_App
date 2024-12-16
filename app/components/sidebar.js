import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import cs from '../../public/images/cs.png';
import cashIn from '../../public/images/cashin.png';
import cashOut from '../../public/images/cashout.png';
import play from '../../public/images/play.png';
import SidebarButton from '../components/sidebarButton';
import Menu from '../components/menu';
import iconFooter from '../../public/images/logo-footer.png';
import { logout } from '../actions/auth';
import { redirect } from 'next/navigation';
import logoutIcon from '../../public/images/logout.svg'

function Sidebar({ isEnabled = false, toggle, isOpen }) {

  const onLogout = async () => {
    await logout()
    redirect('/login')
  }

  const renderSideBarMenu = (link, image, title) => {

    if (isEnabled)
      return <Link href={link} className='cursor-pointer'>
        <SidebarButton img={image} label={title}></SidebarButton>
      </Link>
    else return <div className='cursor-not-allowed'>
      <SidebarButton img={image} label={title}></SidebarButton>
    </div>
  }
  return (

    <React.Fragment>
      <div className='h-full w-screen absolute top-0 z-20' onClick={toggle}
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: 0,
          left: ` ${isOpen ? "0" : "-100%"}`,
        }}></div>
      <div
        className={`sidebar-container 
        fixed w-80 h-full overflow-hidden ease-in-out duration-300
        text-center
        pt-[20px] left-0   z-[1000] `}
        style={{
          opacity: `${isOpen ? "1" : "0"}`,
          top: 0,
          left: ` ${isOpen ? "0" : "-100%"}`,
        }}
      // onClick={toggle}
      >

        <div className='p-3 grid grid-cols-2 grid-rows-2 gap-4 text-center'>
          {renderSideBarMenu('/cashin', cashIn, 'Cash In')}
          {renderSideBarMenu('/request_fund', cashIn, 'Request Fund')}

          {renderSideBarMenu('/game', play, 'Play')}
          {renderSideBarMenu('/cashout', cashOut, 'Cash Out')}
          {/* <Link href="/cashout">
            <SidebarButton img={cashOut} label="Cash Out"></SidebarButton>
          </Link> */}
        </div>
        <Menu isEnabled={isEnabled}></Menu>


        <button onClick={() => onLogout()} className='justify-center w-full p-4 text-red hover:bg-cursedBlack hover:rounded-xlg hover:text-[#E7DE54] flex gap-2'>
          <Image src={logoutIcon} alt="logout" className={`h-4 w-auto my-auto`} /> Logout</button>

        <div className='p-3 grid grid-cols-3 grid-rows-1 gap-4 text-center  z-20'>
          <div></div>
          <div>
            {renderSideBarMenu('/support',cs,'Support')}
          </div>
          <div></div>
        </div>
        <br />
        <div className='w-full z-0'>

          <div className='w-full flex justify-center items-center'>

            <Image alt='footer' src={iconFooter}></Image>
          </div>
          <a href='mailto:luckytaya02@gmail.com'>Contact Us: luckytaya.online</a>
        </div>
      </div>  
      <div />
    </React.Fragment >
  )
}

export default Sidebar