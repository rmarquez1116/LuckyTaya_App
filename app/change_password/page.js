'use client'
import { useActionState, useEffect, useState } from "react";
import Terms from '@components/modal/terms'
import { changePassword } from "@actions/account";
import dynamic from "next/dynamic";
import Alert from "@components/alert";
import { usePathname, useRouter } from 'next/navigation';
import MainLayout from "../layout/mainLayout";
import form from "../forms/changePasswordForm";

const Form = dynamic(() => import('@components/form'), { ssr: false })

export default function ChangePassword() {
  const router = useRouter();
  const pathname = usePathname();
  const [isShowModal, setIsShowModal] = useState(false)
  const [alert, setAlert] = useState({isAnimating : false, timeout: 3000, isOpen: false, message: "", type: "success" })

  const [state, changePasswordAction] = useActionState(changePassword, undefined);

  useEffect(() => {
    if(state && state.success){
      router.push('/')
    }
    else if (state && state.errors) {

      var error = state.errors
      if (error.hasOwnProperty('alert')) {
        setAlert({isAnimating :false, timeout: 5000, isOpen: true, type: "error", message: error.alert[0] })

      }
    }
  }, [state])

  const closeModal = () => {
    setIsShowModal(false);;
  }
  const onCloseAlert = () => {
    setAlert({isAnimating :false, timeout: 3000, isOpen: false, type: "", message: "" })

  }
  return (
    <MainLayout>
      <div className="flex justify-center">

        {alert.isOpen && <Alert isAnimating={alert.isAnimating} timeout={alert.timeout} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}

        <div className="flex flex-col card  w-10/12 max-w-sm p-6 mt-10 bg-white rounded-3xl shadow">
          <Form action={changePasswordAction} state={state} fields={form} buttonText="Change Password"></Form>
        </div>

        {isShowModal && <Terms onClose={() => closeModal()}></Terms>}
      </div>
    </MainLayout >
  );
}
