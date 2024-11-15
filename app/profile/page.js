import MainLayout from "../layout/mainLayout";
import { getProfile, profile } from "../actions/profile";
import ProfileComponent from './_component'


const form = [
  {
    id: "firstname",
    type: "text",
    value: "",
    label: "First Name"
  },
  {
    id: "lastname",
    type: "text",
    value: "",
    label: "Last Name"
  },
  {
    id: "phoneNumber",
    type: "text",
    value: "",
    label: "Mobile Number"
  },
  {
    id: "email",
    type: "email",
    value: "",
    label: "Email"
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
  }
]
export default async function Profile() {

  const user = await getProfile();

  for (let index = 0; index < form.length; index++) {
    const element = form[index];
    form[index].value = user[element.id]
  }

  return (
    <MainLayout>
      <ProfileComponent form={form}/>
    </MainLayout >
  );
}
