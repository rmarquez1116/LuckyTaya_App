'use client'
import BalanceHeader from "../components/balanceHeader";
import MainLayout from "../layout/mainLayout";
import dynamic from "next/dynamic";

const Form = dynamic(()=>import('../components/form'),{ssr : false})
const form = [
  {
    id: "mobile_number",
    type: "text",
    value: "",
    label: "Mobile Number"
  },
  {
    id: "username",
    type: "text",
    value: "",
    label: "Username"
  },
  {
    id: "birthdate",
    type: "date",
    value: "",
    label: "Birthdate"
  },
  {
    id: "region",
    type: "text",
    value: "",
    label: "Region"
  },
  {
    id: "province",
    type: "text",
    value: "",
    label: "Province"
  },
  {
    id: "city",
    type: "text",
    value: "",
    label: "City / Municipality"
  },
  {
    id: "barangay",
    type: "text",
    value: "",
    label: "Barangay"
  },
]
export default function Profile() {
  return (
    <MainLayout>
      <BalanceHeader type={2}></BalanceHeader>
      <div className="flex justify-center align-center  p-6 mt-5">
        <div className="flex flex-col card w-10/12 max-w-md p-5 bg-white rounded-3xl shadow">
          <div className="bg-dark gap-2 p-2 flex">
            <label className="pl-3 content-center">Profile</label>
            <button className="primary w-[80px] ml-auto">Edit</button>
          </div>
          <Form fields={form} buttonText="Update Profile"></Form>
        </div>
      </div>
    </MainLayout >
  );
}
