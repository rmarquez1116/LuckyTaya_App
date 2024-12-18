'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getSession } from '../actions/auth'
import { usePathname, useRouter } from 'next/navigation';
import Alert from '../components/alert';
import { getProfile } from '../actions/profile';

const pendingRoutes = ['/profile','/profile_menu','/change_password','/upload_id']

const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState(null)
  const getSess = async () => {
    const session = await getProfile();
    setProfile(session)
    if(session && session.status != 'APPROVED' && !pendingRoutes.includes(pathname)){
      router.replace('/profile')
    }
  }

  useEffect(() => {
    getSess();
  }, [pathname]);

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
};