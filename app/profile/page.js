import MainLayout from "../layout/mainLayout";
import { getProfile } from "../actions/profile";
import ProfileComponent from './_component'
import { regions, provinces, cities, barangays } from '../actions/address'

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
    type: "select",
    value: "",
    label: "Region",
    items: []
  },
  {
    id: "province",
    type: "select",
    value: "",
    label: "Province",
    items: []
  },
  {
    id: "city",
    type: "select",
    value: "",
    label: "City / Municipality",
    items: []
  },
  {
    id: "barangay",
    type: "select",
    value: "",
    label: "Barangay",
    items: []
  }
]
export default async function Profile() {

  const user = await getProfile();

  var regionIndex = -1, provinceIndex = -1, cityIndex = -1, barangayIndex = -1;
  const region = await regions();

  const getProvince = async (regionCode) => {
    return await provinces(regionCode)
  }

  const getCities = async (provCode) => {
    return await cities(provCode)
  }

  const getBarangays = async (cityCode) => {
    return await barangays(cityCode)
  }


  for (let index = 0; index < form.length; index++) {
    const element = form[index];
    form[index].value = user[element.id]
    if (element.id == "region") {
      regionIndex = index
      form[index].items = region;
    }
    else if (element.id == 'province') {
      provinceIndex = index
      form[index].items = user['region'] ? await getProvince(user['region']) : []
    }
    else if (element.id == 'city') {
      cityIndex = index
      form[index].items = user['province'] ? await getCities(user['province']) : []
    }
    else if (element.id == 'barangay') {
      barangayIndex = index;
      form[index].items = user['city'] ? await getBarangays(user['city']) : []
    }
  }


  return (
    <MainLayout>
      <ProfileComponent
        form={form}
        regionIndex={regionIndex} provinceIndex={provinceIndex}
        cityIndex={cityIndex} barangayIndex={barangayIndex}
        accountNumber={user.accountNumber} />
    </MainLayout >
  );
}
