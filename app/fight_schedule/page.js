import Image from "next/image";
import MainLayout from "../layout/mainLayout";
import Legends from '../components/legends';
import CenterLabel from '../components/centerLabel';
import Calendar from '../components/calendar';

export default function Home() {

  return (
    <MainLayout>
      <div className="w-full min-h-full p-8 pb-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center">

        <CenterLabel label="FIGHT SCHEDULE" />
        <br />
        <div className="p-5  max-w-md   card2 rounded-[20px] grid grid-cols-2 grid-rows-2 gap-4 w-full">
          <Legends></Legends>
        </div>
        <br />


        <Calendar currentDate={new Date()} />

      </div>
    </MainLayout>
  );
}
