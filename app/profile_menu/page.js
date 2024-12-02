'use client'
import {  useState } from 'react';
import { FaChevronDown, FaChevronUp, FaWifi, FaVolumeUp, FaUserCog, FaLock, FaFileUpload } from 'react-icons/fa';
import MainLayout from '../layout/mainLayout';
import BalanceHeader from '../components/balanceHeader';
import { useRouter } from 'next/navigation';

const sections = [
  {
    title: 'Account',
    items: [
      { link: "/profile", title: 'Profile', icon: <FaUserCog /> },
      { link: "/change_password", title: 'Change Password', icon: <FaUserCog /> },
      { link: "/upload_id", title: 'Upload Id', icon: <FaFileUpload /> },
    ]
  }
];

export default function SettingsMenu() {
  const router = useRouter();
  const onMenuClick = (url)=>{
    router.push(url)
  }
  const [openSections, setOpenSections] = useState({ Account: true });

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };


  return (
    <MainLayout>
      <BalanceHeader type={1} />
      <div className="max-w-lg  mt-4 mx-auto p-4 space-y-4 bg-dark-no-border shadow-md rounded-md">
        {sections.map((section, index) => (
          <div key={index} className="border-b pb-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection(section.title)}
            >
              <h3 className="font-semibold text-lg">{section.title}</h3>
              {openSections[section.title] ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>

            {openSections[section.title] && (
              <div className="mt-2 space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div onClick={()=>onMenuClick(item.link)} key={itemIndex} className="flex items-center space-x-3 p-2  cursor-pointer ">
                    <div className="text-xl text-white-600">{item.icon}</div>
                    <p className="text-base text-white-800">{item.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}