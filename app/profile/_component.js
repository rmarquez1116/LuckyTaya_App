'use client'
import React, { useActionState, useEffect } from "react";
import BalanceHeader from "../components/balanceHeader";
import MainLayout from "../layout/mainLayout";
import dynamic from "next/dynamic";
import { profile } from "../actions/profile";
import { useRouter } from 'next/navigation'

const Form = dynamic(() => import('../components/form'), { ssr: false })

export default function ProfileComponent({ form }) {

    const router = useRouter();
    const [state, profileAction] = useActionState(profile, undefined);
    useEffect(() => {
        if (state?.success) {
            const result = confirm("Profile Updated")
            router.push("/")
        }
    }, [state])

    return (
        <React.Fragment>
            <BalanceHeader type={2}></BalanceHeader>
            <div className="flex justify-center align-center">
                <div className="flex flex-col card w-10/12 max-w-md p-6 mt-10 bg-white rounded-3xl shadow">
                    <div className="bg-dark gap-2 p-2 flex">
                        <label className="pl-3 content-center">Profile</label>
                        <button className="primary w-[80px] ml-auto">Edit</button>
                    </div>
                    <Form action={profileAction} fields={form} buttonText="Update Profile"></Form>
                </div>
            </div>
        </React.Fragment >
    );
}
