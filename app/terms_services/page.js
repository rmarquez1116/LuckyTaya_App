import MainLayout from "../layout/mainLayout";

const form = [
  {
    id: "username",
    type: "text",
    value: "",
    label: "Username"
  },
  {
    id: "password",
    type: "password",
    value: "",
    label: "Password"
  },
]
export default function TermsServices() {
  return (
    <MainLayout>
      <div className="w-full flex justify-center">

        <div className="flex flex-col gap-10 card max-w-sm p-6 mt-10 bg-white rounded-3xl shadow">
          <label className="text-center label-header1">Terms and Services</label>
          <label className="text-center">Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed ultricies fermentum ipsum a congue.
            Integer auctor a risus molestie blandit.
            Aenean dignissim cursus arcu, condimentum accumsan sapien suscipit at.
            Maecenas et nisi eget augue vulputate pulvinar ac at velit. </label>
          <button className='primary w-full'>Accept</button>

        </div>

      </div>
    </MainLayout >
  );
}
