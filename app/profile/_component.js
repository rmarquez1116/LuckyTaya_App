'use client'
import React, { useActionState, useState, useEffect } from "react";
import BalanceHeader from "../components/balanceHeader";
import dynamic from "next/dynamic";
import { profile } from "../actions/profile";
import { useRouter } from 'next/navigation'
import { barangays, cities, provinces } from "../actions/address";

const Form = dynamic(() => import('../components/form'), { ssr: false })

export default function ProfileComponent(
    {
        form, accountNumber,
        regionIndex, provinceIndex, cityIndex, barangayIndex
    }) {

    const router = useRouter();
    const [formData, setFormData] = useState(form)

    useEffect(() => {
        form[regionIndex].onSelect = async (code) => {
            const currentForm = Object.assign([], formData)
            currentForm[regionIndex].value = code.value
            currentForm[provinceIndex].items = await provinces(code.value);
            currentForm[cityIndex].items = []
            currentForm[barangayIndex].items = []
            setFormData(currentForm);
        }

        form[provinceIndex].onSelect = async (code) => {  
            const currentForm = Object.assign([], formData)
            currentForm[provinceIndex].value = code.value
            currentForm[cityIndex].items = await cities(code.value);
            currentForm[barangayIndex].items = []
            setFormData(currentForm);
        }

        form[cityIndex].onSelect = async (code) => {
            const currentForm = Object.assign([], formData)
            currentForm[cityIndex].value = code.value
            currentForm[barangayIndex].items = await barangays(code.value)
            setFormData(currentForm);
        }
        form[barangayIndex].onSelect = async (code) => {
            const currentForm = Object.assign([], formData)
            currentForm[barangayIndex].value = code.value
            setFormData(currentForm);
        }
    }, [])


    const [state, profileAction] = useActionState(profile, undefined);
    useEffect(() => {
        if (state?.success) {
            const result = confirm("Profile Updated")
            router.push("/upload_id")
        }
    }, [state])

    return (
        <React.Fragment>
            <BalanceHeader type={2}></BalanceHeader>
            <div className="flex justify-center align-center">
                <div className="flex flex-col card w-10/12 max-w-md p-6 mt-10 bg-white rounded-3xl shadow">
                    <label className="text-left">Account Number</label>
                    <div className="bg-dark gap-2 p-2 flex mt-2">
                        <label className="pl-3 content-center">{accountNumber}</label>
                        <button className="primary w-[80px] ml-auto">Profile</button>
                    </div>
                    <Form action={profileAction} fields={formData} buttonText="Update Profile"></Form>
                </div>
            </div>
        </React.Fragment >
    );
}
